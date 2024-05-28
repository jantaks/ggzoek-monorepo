import { acceptCookies, cleanText } from '../../utils.js';
import * as cheerio from 'cheerio';
import { PlaywrightScraper } from '../crawlers.js';
import { Page } from 'playwright';

const url = 'https://www.werkenbijyulius.nl/vacatures/';

const s = new PlaywrightScraper('Yulius', [url]);

s.addDefaultHandler(async ({ page }) => {
  await acceptCookies(page);
  const btnLocator = (page: Page) => page.getByText('Laad meer');
  await s.expand(page, btnLocator, {
    globs: ['**/vacature/**'],
    baseUrl: 'https://www.werkenbijyulius.nl',
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header').remove();
  $(
    '.vacature-content-sidebar, .vacature-content-sidebar, #footer, .sollicitatie_proces, .btn, .btn-container, .vergelijkbare_vacatures, .extra_vacature_info'
  ).remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, request: request, body: text });
});

export const Yulius = s;
