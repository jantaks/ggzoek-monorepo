import {
  BasicCrawlerOptions,
  CheerioCrawler,
  CheerioCrawlingContext,
  Configuration,
  ConfigurationOptions,
  createCheerioRouter,
  createPlaywrightRouter,
  enqueueLinks,
  PlaywrightCrawler,
  PlaywrightCrawlingContext,
  Request,
  RouterHandler,
  sleep
} from 'crawlee';
import { log, MyLogger } from '@ggzoek/logging/src/logger.js';
import { CheerioAPI } from 'cheerio';
import {
  cleanTitle,
  createHash,
  formatDate,
  getCheerioFromPage,
  getTimePeriod,
  LinksOptions,
  selectLinks
} from '../utils.js';
import { Locator, Page } from 'playwright';
import vacatures, { bulkInsert, bulkUpsertVacatures } from '@ggzoek/ggz-drizzle/src/vacatures.js';
import { InsertScrapeResult, InsertVacature } from '@ggzoek/ggz-drizzle/src/schema.js';
import { getBeroepen } from '../beroepen.js';
import { getLatest, insert } from '@ggzoek/ggz-drizzle/src/scrapeResults.js';

interface Scraper {
  crawl(): Promise<void>;
}

type Data = {
  request: Request;
  body: string;
  title: string;
};

type Options = Pick<
  BasicCrawlerOptions,
  'requestHandlerTimeoutSecs' | 'statisticsOptions' | 'maxRequestsPerCrawl' | 'maxRequestsPerMinute'
>;

type ScraperType = 'cheerio' | 'playwright';

export const DEFAULT_OPTIONS: BasicCrawlerOptions = {
  statisticsOptions: {
    logIntervalSecs: 10
  }
};

export const DEFAULT_CONFIG: ConfigurationOptions = {
  persistStateIntervalMillis: 5_000,
  purgeOnStart: true
};

export abstract class BaseScraper implements Scraper {
  abstract crawlerType: ScraperType;
  logger: MyLogger;
  protected abstract router:
    | RouterHandler<PlaywrightCrawlingContext>
    | RouterHandler<CheerioCrawlingContext>;
  protected abstract crawler: CheerioCrawler | PlaywrightCrawler;
  protected config: Configuration;
  private allVacatures: Awaited<ReturnType<typeof vacatures.getAllForOrganisation>> | undefined =
    undefined;
  private vacaturesPromise: ReturnType<typeof vacatures.getAllForOrganisation>;
  private newUrls: string[] = [];
  private allUrls: string[] = [];
  private vacaturesUpdated: number = 0;
  private vacaturesToUpdate: Pick<InsertVacature, 'urlHash' | 'lastScraped'>[] = [];
  private vacaturesToInsert: Partial<InsertVacature>[] = [];

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
      defaultDatasetId: name,
      ...configOptions
    });
    this.logger = log.child({ scraper: this.name });
    this.vacaturesPromise = vacatures.getAllForOrganisation(this.name);
  }

  isSlow() {
    if (this.options?.maxRequestsPerMinute) {
      return this.options.maxRequestsPerMinute < 20;
    }
    return false;
  }

  abstract addDefaultHandler(...args: Parameters<typeof this.router.addDefaultHandler>): void;

  abstract addHandler(...args: Parameters<typeof this.router.addHandler>): void;

  async crawl() {
    function toDate(date: unknown): Date | null {
      if (typeof date === 'string') {
        return new Date(date);
      }
      if (date instanceof Date) {
        return date;
      }
      return null;
    }

    await this.crawler.run(this.urls);
    await bulkUpsertVacatures(this.vacaturesToUpdate);
    log.debug(`Updated ${this.vacaturesToUpdate.length} vacatures`);
    await bulkInsert(this.vacaturesToInsert as InsertVacature[]);
    log.debug(`Inserted ${this.vacaturesToInsert.length} new vacatures`);
    const previousResults = await getLatest();
    const results: InsertScrapeResult = {
      ...this.crawler.stats.state,
      newUrls: this.newUrls.length,
      vacaturesUpdated: this.vacaturesUpdated,
      vacaturesFound: new Set(this.allUrls).size,
      scraperName: this.name,
      crawlerStartedAt: toDate(this.crawler.stats.state.crawlerStartedAt),
      crawlerFinishedAt: toDate(this.crawler.stats.state.crawlerFinishedAt),
      statsPersistedAt: toDate(this.crawler.stats.state.statsPersistedAt)
    };
    if (previousResults) {
      const diff = Math.abs(previousResults.vacaturesFound - results.vacaturesFound);
      const diffPercentage = (diff / results.vacaturesFound) * 100;
      if (diffPercentage > 10) {
        this.logger.warn(
          `Difference in requests finished is more than 10%. Previous: ${previousResults.vacaturesFound}, current: ${results.vacaturesFound}`
        );
      }
    }
    this.logger.info(results);
    await insert(results);
  }

  async save(data: Data) {
    const urlHash = createHash(data.request.uniqueKey);
    const allVacatures = await this.getAllVacatures();
    const existing = allVacatures.find((v) => v.urlHash === urlHash);
    if (existing) {
      this.logger.debug(
        `Vacature ${existing.url} already exists, last scraped at ${formatDate(existing.lastScraped)})`
      );
      existing.lastScraped = new Date();
      this.vacaturesToUpdate.push({
        urlHash: urlHash,
        lastScraped: new Date()
      });
      return;
    }

    const newVacature: Omit<InsertVacature, 'beroepen'> = {
      organisatie: this.name,
      title: cleanTitle(data.title),
      body: data.body,
      url: data.request.loadedUrl as string,
      urlHash: urlHash,
      bodyHash: createHash(data.body),
      firstScraped: new Date(),
      lastScraped: new Date(),
      professie: getBeroepen(data.title)
    };

    this.logger.info(`New Vacature!!! ${newVacature.url}`);
    this.newUrls.push(newVacature.url);
    this.vacaturesToInsert.push(newVacature);
    this.vacaturesUpdated++;
  }

  async filterNewUrls(urls: string[]) {
    const hours = getTimePeriod();
    const allVacatures = await this.getAllVacatures();
    const scrapedInPeriod = allVacatures.filter(
      (v) => v.lastScraped > new Date(Date.now() - hours * 60 * 60 * 1000)
    );
    const urlsScrapedInPeriod = scrapedInPeriod.map((v) => v.url);
    const filteredUrls = urls.filter((url) => !urlsScrapedInPeriod.includes(url));
    log.info(
      `Found ${urls.length} urls. Selected ${filteredUrls.length} urls that have not been scraped in the last ${hours} hours`
    );
    log.debug('Selected urls:', filteredUrls);
    return filteredUrls;
  }

  async enqueueNewLinks($: CheerioAPI, options: LinksOptions) {
    const requestQueue = await this.crawler.getRequestQueue();
    const urls = options.urls ? options.urls : selectLinks($, options);
    this.allUrls.push(...urls);
    const filteredUrls = await this.filterNewUrls(urls);
    await enqueueLinks({ label: options.label, urls: filteredUrls, requestQueue: requestQueue });
    return { found: urls.length, enqueued: filteredUrls.length };
  }

  private async getAllVacatures() {
    if (!this.allVacatures) {
      this.allVacatures = await this.vacaturesPromise;
      this.logger.debug(
        `Fetched ${this.allVacatures.length} existing vacatures for organisation from database`
      );
    }
    return this.allVacatures;
  }
}

export class CheerioScraper extends BaseScraper {
  crawlerType = 'cheerio' as ScraperType;
  protected override crawler: CheerioCrawler;
  protected override router: RouterHandler<CheerioCrawlingContext>;

  constructor(name: string, urls: string[], options?: Options, config?: ConfigurationOptions) {
    super(name, urls, options, config);
    this.router = createCheerioRouter();
    this.crawler = new CheerioCrawler(
      { ...this.options, requestHandler: this.router },
      this.config
    );
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
        log.error(
          `Error code when loading ${context.request.loadedUrl}. Statuscode: ${context.response.statusCode}`
        );
        return;
      }
      await handler(context);
    };
    this.router.addHandler(label, updatedHandler);
  }
}

export class PlaywrightScraper extends BaseScraper {
  crawlerType = 'playwright' as ScraperType;
  protected override crawler: PlaywrightCrawler;
  protected override router: RouterHandler<PlaywrightCrawlingContext>;

  constructor(name: string, urls: string[], options?: Options, config?: ConfigurationOptions) {
    super(name, urls, options, config);
    this.router = createPlaywrightRouter();
    this.crawler = new PlaywrightCrawler(
      {
        ...this.options,
        requestHandler: this.router,
        requestHandlerTimeoutSecs: 180
      },
      this.config
    );
  }

  async paginate(page: Page, locator: (page: Page) => Locator, options: LinksOptions) {
    let pageCounter = 1;
    log.info(`Starting on page: ${pageCounter}`);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        await sleep(2000);
        const $ = await getCheerioFromPage(page);
        const { found } = await this.enqueueNewLinks($, options);
        if (found === 0) {
          log.info(`No links found on page ${pageCounter}. End pagination.`);
          break;
        }
        log.info(`Found ${found} links on page ${pageCounter}`);
        const nextButton = locator(page);
        // if ((await nextButton.count()) === 0 || !(await nextButton.isVisible())) {
        if (
          (await nextButton.count()) === 0 ||
          !(await nextButton.isVisible()) ||
          !(await nextButton.isEnabled())
        ) {
          log.info('No more "next" buttons found. End pagination.');
          break;
        }
        pageCounter++;
        log.info(`Navigating to page: ${pageCounter}`);
        await nextButton.first().click({ timeout: 2000 });
      } catch (error) {
        log.error(`An error occurred in ${this.name}: ${error}`);
        break;
      }
    }
  }

  async expand(page: Page, locator: (page: Page) => Locator, options: LinksOptions) {
    let clickedCounter = 1;
    const urls: string[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const expandButton = locator(page);
        if ((await expandButton.count()) === 0 || !(await expandButton.isVisible())) {
          this.logger.info('No more expand buttons found. End pagination.');
          break;
        }
        this.logger.info(`Clicking expand button: ${clickedCounter}`);
        await expandButton.first().click({ timeout: 5000 });
        await sleep(2000);
        const $ = await getCheerioFromPage(page);
        const linksOnPage = selectLinks($, options);
        const newUrls = linksOnPage.filter((url) => !urls.includes(url));
        if (newUrls.length === 0) {
          this.logger.info('No new links found. End pagination.');
          break;
        }
        urls.push(...newUrls);
        // const filteredUrls = await this.filterNewUrls(newUrls);
        const { enqueued: e } = await this.enqueueNewLinks($, {
          urls: newUrls,
          label: options.label
        });
        this.logger.info(
          `Found ${newUrls.length} vacatures on page ${clickedCounter}. Enqueued (not scraped in previous period): ${e}`
        );
        clickedCounter++;
      } catch (error) {
        this.logger.error(error);
        break;
      }
    }
    this.logger.info(
      `Finished expanding. Found ${urls.length} urls after ${clickedCounter} clicks`
    );
  }

  override addHandler(label: string, handler: Parameters<typeof this.router.addHandler>[1]) {
    this.router.addHandler(label, handler);
  }

  override addDefaultHandler(...args: Parameters<typeof this.router.addDefaultHandler>) {
    this.router.addDefaultHandler(...args);
  }
}
