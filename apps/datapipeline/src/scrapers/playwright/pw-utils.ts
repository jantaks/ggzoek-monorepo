import { Locator, Page } from 'playwright';
import { getCheerioFromPage, LinksOptions } from '../../utils.js';
import { sleep } from 'crawlee';
import { log } from '@ggzoek/logging/src/logger.js';
import { CheerioAPI } from 'cheerio';

type Paginator = (
  selector: string,
  enqueuer: ($: CheerioAPI, options: LinksOptions) => Promise<void>,
  options: LinksOptions
)
  => (page: Page) => Promise<void>

export const createPaginator:Paginator = (selector, enqueuer, options) => {
  return async (page) => {
    let pageCounter = 1;
    while (pageCounter > 0) {
      try {
        await sleep(2000)
        const $ = await getCheerioFromPage(page)
        await enqueuer($, options);
        log.info(`Next page: ${pageCounter}`);
        await page.locator(selector).click({ timeout: 2000 });
        await sleep(500)
        pageCounter++;
      } catch (error) {
        log.info(`No more pages. ${error}`);
        break;
      }
    }
  }
}