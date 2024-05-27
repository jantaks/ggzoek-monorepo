import {
  BasicCrawlerOptions,
  CheerioCrawler,
  CheerioCrawlingContext,
  Configuration, ConfigurationOptions, createCheerioRouter,
  createPlaywrightRouter, Dictionary, enqueueLinks, PlaywrightCrawler,
  PlaywrightCrawlingContext, Request, RouterHandler, sleep
} from 'crawlee';
import { log, MyLogger } from '@ggzoek/logging/src/logger.js';
import { CheerioAPI } from 'cheerio';
import {
  cleanTitle, createHash, formatDate,
  getCheerioFromPage,
  getTimePeriod,
  LinksOptions,
  selectLinks
} from '../utils.js';
import { Locator, Page } from 'playwright';
import repo from '../../../../packages/ggz-drizzle/src/repo.js';
import { InsertVacature, SelectVacature } from '../../../../packages/ggz-drizzle/drizzle/schema.js';
import { getBeroepen } from '../beroepen.js';

interface Scraper {
  crawl(): Promise<void>;
}

type Data = {
  request: Request<Dictionary>
  body: string,
  title: string,
}

type Options = Pick<BasicCrawlerOptions, "requestHandlerTimeoutSecs" | "statisticsOptions" | "maxRequestsPerCrawl" | "maxRequestsPerMinute">

export function defaultConfig(name: string) {
  return new Configuration({
    persistStateIntervalMillis: 5_000,
    purgeOnStart: true,
    defaultKeyValueStoreId: name,
    defaultDatasetId: name
  });
}

export function defaultOptions(): BasicCrawlerOptions {
  return {
    statisticsOptions: {
      logIntervalSecs: 10
    }
  };
}

const DEFAULT_OPTIONS: BasicCrawlerOptions = {
  statisticsOptions: {
    logIntervalSecs: 10
  }
};

const DEFAULT_CONFIG: ConfigurationOptions = {
  persistStateIntervalMillis: 5_000,
  purgeOnStart: true
};

export abstract class BaseScraper implements Scraper {
  protected abstract router: RouterHandler<PlaywrightCrawlingContext> | RouterHandler<CheerioCrawlingContext>;
  protected abstract crawler: CheerioCrawler | PlaywrightCrawler;
  protected config: Configuration;
  private existingUrls: string[] | undefined = undefined;
  private allVacatures: SelectVacature[] | undefined = undefined;
  protected logger: MyLogger


  protected constructor(
    readonly name: string,
    private readonly urls: string[],
    protected readonly options?: Options,
    protected readonly configOptions?: ConfigurationOptions
  ) {
    this.urls = urls;
    this.name = name;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.config = new Configuration({
      ...DEFAULT_CONFIG,
      defaultKeyValueStoreId: name,
      defaultDatasetId: name, ...configOptions
    });
    this.logger = log.child({ scraper: this.name })
    repo.getAllForOrganisation(this.name).then(vacatures => this.allVacatures= vacatures);
  }

  abstract addDefaultHandler(...args: Parameters<typeof this.router.addDefaultHandler>): void;

  abstract addHandler(...args: Parameters<typeof this.router.addHandler>): void;

  async crawl() {
    await this.crawler.run(this.urls);
  }

  private async getAllVacatures(){
    if (!this.allVacatures) {
      this.logger.info('No existing vacatures found. Fetching from database')
      this.allVacatures = await repo.getAllForOrganisation(this.name);
    }
    return this.allVacatures;
  }

  async save(data: Data) {
    const vacature: InsertVacature = {
      organisatie: this.name,
      title: cleanTitle(data.title),
      body: data.body,
      url: data.request.loadedUrl as string,
      urlHash: createHash(data.request.uniqueKey),
      bodyHash: createHash(data.body),
      firstScraped: new Date(),
      lastScraped: new Date(),
      professie: getBeroepen(data.title),
      summary: null
    };

    const allVacatures = await this.getAllVacatures()
    const existing = allVacatures.find(v => v.urlHash === vacature.urlHash);
    if (existing) {
      this.logger.debug(`Vacature ${vacature.url} already exists, last scraped at ${formatDate(existing.lastScraped)})`);
      vacature.firstScraped = existing.firstScraped;
    } else {
      this.logger.info(`New Vacature!!! ${vacature.url}`);
    }
    await repo.upsert(vacature);
  }

  async filterNewUrls(urls: string[]) {
    const period = getTimePeriod();
    if (!this.existingUrls) {
      log.info('No existing urls found. Fetching from database')
      this.existingUrls = await repo.getAllUrlsScrapedWithinHours(period) as string[];
    }
    const savedUrls = this.existingUrls
    const filteredUrls = urls.filter(url => !savedUrls.includes(url));
    log.info(`Found ${urls.length} urls. Selected ${filteredUrls.length} urls that have not been scraped in the last ${period} hours`);
    log.debug('Selected urls:', filteredUrls);
    return filteredUrls;
  }

  async enqueueLinks(options: Omit<Parameters<typeof enqueueLinks>[0], "requestQueue">){
    const requestQueue = await this.crawler.getRequestQueue();
    await enqueueLinks({ ...options, requestQueue } );
  }

  async enqueuNewLinks($: CheerioAPI, options: LinksOptions) {
    const requestQueue = await this.crawler.getRequestQueue();
    const foundUrls = selectLinks($, options);
    const filteredUrls = await this.filterNewUrls(foundUrls);
    await enqueueLinks({ label: options.label, urls: filteredUrls, requestQueue: requestQueue });
    return { found: foundUrls.length, enqueued: filteredUrls.length };
  }
}

export class CheerioScraper extends BaseScraper {
  protected override crawler: CheerioCrawler;
  protected override router: RouterHandler<CheerioCrawlingContext>;

  constructor(name: string, urls: string[], options?: Options, config?: ConfigurationOptions) {
    super(name, urls, options, config);
    this.router = createCheerioRouter();
    this.crawler = new CheerioCrawler({ ...this.options, requestHandler: this.router }, this.config);
  }


  override addDefaultHandler(...args: Parameters<typeof this.router.addDefaultHandler>) {
    this.router.addDefaultHandler(...args);
  }

  override addHandler(...args: Parameters<typeof this.router.addHandler>) {
    const label = args[0];
    const handler = args[1];
    const updatedHandler = async (...args: Parameters<typeof handler>) => {
      const context = args[0];
      if (context.response.statusCode > 210) {
        log.error(`Error code when loading ${context.request.loadedUrl}. Statuscode: ${context.response.statusCode}`);
        return;
      }
      await handler(context);
    };
    this.router.addHandler(label, updatedHandler);
  }
}

export class PlaywrightScraper extends BaseScraper {
  protected override crawler: PlaywrightCrawler;
  protected override router: RouterHandler<PlaywrightCrawlingContext>;

  constructor(name: string, urls: string[], options?: Options, config?: ConfigurationOptions) {
    super(name, urls, options, config);
    this.router = createPlaywrightRouter();
    this.crawler = new PlaywrightCrawler({ ...this.options, requestHandler: this.router, requestHandlerTimeoutSecs: 180 }, this.config);
  }

  async paginate(page: Page, locator: (page:Page) => Locator, options: LinksOptions) {
    let pageCounter = 1;
    log.info(`Starting on page: ${pageCounter}`);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        await sleep(1000)
        const $ = await getCheerioFromPage(page)
        const {found, } = await this.enqueuNewLinks($, options);
        log.info(`Found ${found} new links on page ${pageCounter}`);
        if (found === 0) {
          log.info('No new links found. End pagination.');
          break;
        }
        pageCounter++;
        log.info(`Navigating to page: ${pageCounter}`);
        const nextButton = await locator(page)
        if (await nextButton.count() === 0 || ! await nextButton.isVisible()) {
          log.info('No more "next" buttons found. End pagination.');
          break;
        }
        await nextButton.first().click({ timeout: 2000 });
      } catch (error) {
        log.error(`An error occurred in ${this.name}: ${error}`);
        break;
      }
    }
  }

  async expand(page: Page, locator: (page:Page) => Locator, options: LinksOptions) {
    let clickedCounter = 1;
    const urls: string[] = []
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const expandButton = locator(page)
        if (await expandButton.count() === 0 || ! await expandButton.isVisible()) {
          this.logger.info('No more expand buttons found. End pagination.');
          break;
        }
        this.logger.info(`Clicking expand button: ${clickedCounter}`);
        await expandButton.first().click({ timeout: 2000 });
        await sleep(2000)
        const $ = await getCheerioFromPage(page)
        const linksOnPage = selectLinks($, options);
        const newUrls = linksOnPage.filter(url => !urls.includes(url));
        if (newUrls.length === 0) {
          this.logger.info('No new links found. End pagination.');
          break;
        }
        urls.push(...newUrls);
        const filteredUrls = await this.filterNewUrls(newUrls);
        await this.enqueueLinks({ urls: filteredUrls, label: options.label });
        this.logger.info(`Enqueued ${newUrls.length} new links on page ${clickedCounter}`);
        clickedCounter++;
      } catch (error) {
        this.logger.error(`Error in ${this.name}:  ${error}`);
        break;
      }
    }
    this.logger.info(`Finished expanding. Found ${urls.length} urls after ${clickedCounter} clicks`);
  }

  override addHandler(label: string, handler: Parameters<typeof this.router.addHandler>[1]) {
    this.router.addHandler(label, handler);
  }

  override addDefaultHandler(...args: Parameters<typeof this.router.addDefaultHandler>) {
    this.router.addDefaultHandler(...args);
  }
}