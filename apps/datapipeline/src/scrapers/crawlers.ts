import {
  CheerioCrawler,
  CheerioCrawlingContext,
  Configuration,
  createCheerioRouter,
  createPlaywrightRouter,
  PlaywrightCrawler,
  PlaywrightCrawlingContext,
  RouterHandler
} from 'crawlee';
import { Data, saveToDb } from '../services/storage.js';

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

  async crawl() {
    await this.crawler.run(this.urls);
  }

  async save(data: Data){
    await saveToDb(this.name, data)
  }
}

export class CheerioScraper extends BaseScraper {
  protected override crawler: CheerioCrawler;
  router: RouterHandler<CheerioCrawlingContext>;

  constructor(name: string, urls: string[], options?: Options, config?: Configuration) {
    super(name, urls, options, config);
    this.router = createCheerioRouter();
    this.crawler = new CheerioCrawler({ ...this.options, requestHandler: this.router }, this.config);
  }
}

export class PlaywrightScraper extends BaseScraper {
  protected override crawler: PlaywrightCrawler;
  router: RouterHandler<PlaywrightCrawlingContext>;

  constructor(name: string, urls: string[], options?: Options, config?: Configuration) {
    super(name, urls, options, config);
    this.router = createPlaywrightRouter();
    this.crawler = new PlaywrightCrawler({ ...this.options, requestHandler: this.router }, config);
  }
}