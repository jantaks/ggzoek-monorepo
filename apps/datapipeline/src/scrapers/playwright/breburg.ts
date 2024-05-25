import { acceptCookies, cleanText, cleanTitle, getCheerioFromPage } from '../../utils.js';
import { PlaywrightScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';
import { log } from '@ggzoek/logging/src/logger.js';
import { sleep } from 'crawlee';

const s = new PlaywrightScraper('GGZ Breburg', ['https://www.werkenbijggzbreburg.nl/vacatures/']);

s.addDefaultHandler(async ({ page,  request }) => {
  await acceptCookies(page);
  log.info(`${request.loadedUrl}`)
  let pageCounter = 1;
  while (pageCounter < 10  ) {
    try {
      await sleep(2000)
      const $ = await getCheerioFromPage(page)
      await s.enqueuNewLinks($ as CheerioAPI,{
        baseUrl: 'https://www.werkenbijggzbreburg.nl/',
        globs: ['**/vacatures/*'],
        label: 'detail'
      } )
      log.info(`Next page: ${pageCounter}`);
      await page.locator('a.paging-next').click({ timeout: 2000 });
      await sleep(500)
      pageCounter++;
    } catch (error) {
      log.info(`No more pages. ${error}`);
      break;
    }
  }
});

s.addHandler('detail', async ({ request, parseWithCheerio, log }) => {
  const $ = await parseWithCheerio()
  const title = cleanTitle($('title').text()).replace('Werken bij GGz Breburg', '');
  $('script, style, noscript, iframe, header, nav').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Breburg = s;
