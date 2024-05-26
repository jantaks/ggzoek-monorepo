
import { acceptCookies, cleanText } from '../../utils.js';
import * as cheerio from 'cheerio';
import { PlaywrightScraper } from '../crawlers.js';
import { Page } from 'playwright';

const url = 'https://www.werkenbijlentis.nl/alle-vacatures/?q='
const s = new PlaywrightScraper('Lentis', [url])

s.addDefaultHandler(async ({  page }) => {
  page.setDefaultTimeout(5000);
  await acceptCookies(page);
  const buttonLocator = (page: Page) => page.locator('a').getByText('Volgende');
  await s.paginate(page, buttonLocator, {
    baseUrl: 'https://www.werkenbijlentis.nl/',
    globs: ['**/alle-vacatures/vacature*'],
    label: 'detail'
  })
});


s.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav').remove();
  $('.pt-goto-links').remove();
  $('.pt-apply-card').remove();
  $('#experience').remove();
  $('.pt-share-functions-block').remove();
  $('.pt-apply-proces').remove();
  $('.pt-related-vacancies').remove();

  let content = $('.entry-content').text();

  content = cleanText(content);
  log.info(`${title}`, { url: request.loadedUrl });
  s.save({ title: title, body: content, request: request });
});

export const Lentis = s;

