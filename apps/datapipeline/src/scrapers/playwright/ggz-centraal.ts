import { sleep } from 'crawlee';
import { acceptCookies, cleanText } from '../../utils.js';
import * as cheerio from 'cheerio';
import { PlaywrightScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';



const url = 'https://www.werkenbijggzcentraal.nl/vacatures'

const s = new PlaywrightScraper('GGZ Centraal', [url]);


s.addDefaultHandler(async ({ parseWithCheerio, log, page }) => {
  page.setDefaultTimeout(5000);
  // await page.goto(url);
  await acceptCookies(page);

  let pageCounter = 1;
  while (pageCounter > 0) {
    try {
      log.info(`Next page: ${pageCounter}`);
      await page.locator('a.rnNext').click({ timeout: 2000 });
      await sleep(1000)
      await page.waitForLoadState('networkidle');
      await page.waitForLoadState('domcontentloaded');
      const $ = await parseWithCheerio();
      await s.enqueuNewLinks($ as CheerioAPI, {
        baseUrl: 'https://www.werkenbijggzcentraal.nl',
        globs: ['**/vacatures/*/**'],
        label: 'detail'
      });
      pageCounter++;
    } catch (error) {
      log.info(`No more pages. ${error}`);
      break;
    }
  }
});


s.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, footer, form').remove();
  $('.custom-css-section-footer').remove()
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, request: request, body: text });
});

export const GGZCentraal = s;