import { sleep } from 'crawlee';
import { acceptCookies, cleanText } from '../../utils.js';
import * as cheerio from 'cheerio';
import { PlaywrightScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';
import { Page } from 'playwright';



const url = 'https://www.werkenbijggzcentraal.nl/vacatures'

const s = new PlaywrightScraper('GGZ Centraal', [url]);


s.addDefaultHandler(async ({ page }) => {
  page.setDefaultTimeout(5000);
  await acceptCookies(page);
  const buttonLocator = (page: Page) => page.locator('a.rnNext');
  await s.paginate(page, buttonLocator, {
    baseUrl: 'https://www.werkenbijggzcentraal.nl',
    globs: ['**/vacatures/*/**'],
    label: 'detail'
  })
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