import { acceptCookies, cleanText, removeParent } from '../../utils.js';
import * as cheerio from 'cheerio';
import { PlaywrightScraper } from '../crawlers.js';
import { Page } from 'playwright';

const s = new PlaywrightScraper('Pluryn', [
  'https://www.pluryn.nl/werken-bij/vacature?filter=&address=&distance=10000'
]);
export const Pluryn = s;

s.addDefaultHandler(async ({ page }) => {
  page.setDefaultTimeout(5000);
  await acceptCookies(page);
  const buttonLocator = (page: Page) => page.getByText('Meer vacatures');
  await s.expand(page, buttonLocator, {
    baseUrl: 'https://www.pluryn.nl',
    selector: '.panel-vacancy',
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header').remove();
  $(
    '#vacancy-cta-title, .btn, .mod-breadcrumb, .sidebar-container, .vacancy-footer, .mod-footer'
  ).remove();
  let elementWithText = $('h2:contains("Dit is Pluryn")').first();
  removeParent(elementWithText);
  elementWithText = $('h3:contains("Neem contact op met onze recruiters")').first();
  removeParent(elementWithText);
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, request: request, body: text });
});
