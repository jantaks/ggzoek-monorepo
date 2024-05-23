import {
  CheerioCrawler,
  CheerioCrawlingContext,
  Configuration, CrawlingContext,
  createCheerioRouter,
  createPlaywrightRouter, enqueueLinks, EnqueueLinksOptions,
  PlaywrightCrawler,
  PlaywrightCrawlingContext, Router,
  RouterHandler
} from 'crawlee';
import { Data, saveToDb } from '../services/storage.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { CheerioAPI } from 'cheerio';
import { LinksOptions, selectNewLinks } from '../utils.js';

interface Scraper {
  crawl(): Promise<void>;
}

type Options = { maxRequestsPerCrawl: number, maxRequestsPerMinute: number }

export function defaultConfig(name: string) {
  return new Configuration({
    persistStateIntervalMillis: 5_000,
    purgeOnStart: true,
    defaultKeyValueStoreId: name,
    defaultDatasetId: name
  });
}

export function defaultOptions() {
  return {
    maxRequestsPerCrawl: 1000,
    maxRequestsPerMinute: 300
  };
}

export abstract class BaseScraper implements Scraper {
  protected abstract router: RouterHandler<PlaywrightCrawlingContext> | RouterHandler<CheerioCrawlingContext>;
  protected abstract crawler: CheerioCrawler | PlaywrightCrawler;

  protected constructor(
    private readonly name: string,
    private readonly urls: string[],
    protected readonly options?: Options,
    protected readonly config?: Configuration
  ) {
    this.urls = urls;
    this.name = name;
    if (!this.options) {
      this.options = defaultOptions();
    }
    if (!this.config) {
      this.config = defaultConfig(this.name);
    }
  }

  abstract addDefaultHandler(...args: Parameters<typeof this.router.addDefaultHandler>): void;

  abstract addHandler(...args: Parameters<typeof this.router.addHandler>): void;

  async crawl() {
    await this.crawler.run(this.urls);
  }

  async save(data: Data) {
    await saveToDb(this.name, data);
  }


}

export class CheerioScraper extends BaseScraper {
  protected override crawler: CheerioCrawler;
  protected override router: RouterHandler<CheerioCrawlingContext>;

  constructor(name: string, urls: string[], options?: Options, config?: Configuration) {
    super(name, urls, options, config);
    this.router = createCheerioRouter();
    this.crawler = new CheerioCrawler({ ...this.options, requestHandler: this.router }, this.config);
  }

  async enqueuNewLinks($: CheerioAPI, options: LinksOptions) {
    const q = await this.crawler.getRequestQueue()
    const urls = await selectNewLinks($, options)
    await enqueueLinks({label: options.label, urls: urls, requestQueue: q})
  }

  override addDefaultHandler(...args: Parameters<typeof this.router.addDefaultHandler>) {
    this.router.addDefaultHandler(...args)
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

  constructor(name: string, urls: string[], options?: Options, config?: Configuration) {
    super(name, urls, options, config);
    this.router = createPlaywrightRouter();
    this.crawler = new PlaywrightCrawler({ ...this.options, requestHandler: this.router }, config);
  }



  override addHandler(...args: Parameters<typeof this.router.addHandler>) {
    const label = args[0];
    const handler = args[1];
    this.router.addHandler(label, handler);
  }

  override addDefaultHandler(...args: Parameters<typeof this.router.addDefaultHandler>) {
    this.router.addDefaultHandler(...args)
  }
}