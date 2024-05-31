import { acceptCookies, cleanText } from '../../utils.js';
import * as cheerio from 'cheerio';
import { PlaywrightScraper } from '../crawlers.js';
import { Page } from 'playwright';

const url = 'https://mentalcaregroup.nl/vacatures/';

const s = new PlaywrightScraper('Nl Mental Care Group', [url]);

s.addDefaultHandler(async ({ page }) => {
  await acceptCookies(page);
  const btnLocator = (page: Page) => page.locator('a.load_more_jobs');
  await s.expand(page, btnLocator, {
    globs: ['**/vacature/**'],
    baseUrl: 'https://mentalcaregroup.nl/',
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header').remove();
  $("h5:contains('enthousiast')").nextAll().addBack().remove();
  $('.btn').remove();
  $("span:contains('Deel deze vacature')").nextAll().addBack().remove();
  // $('article.article div:last-of-type').remove();
  let text = $('article').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, request: request, body: text });
});

export const MentalCareGroup = s;
