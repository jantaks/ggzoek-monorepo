import { acceptCookies, cleanText } from '../../utils.js';
import * as cheerio from 'cheerio';
import { PlaywrightScraper } from '../crawlers.js';
import { Page } from 'playwright';

const url = 'https://www.werkenbijlentis.nl/alle-vacatures/?q=';
const s = new PlaywrightScraper('Lentis', [url]);

s.addDefaultHandler(async ({ page }) => {
  page.setDefaultTimeout(5000);
  await acceptCookies(page);
  const buttonLocator = (page: Page) => page.locator('a').getByText('Volgende');
  await s.paginate(page, buttonLocator, {
    baseUrl: 'https://www.werkenbijlentis.nl/',
    globs: ['**/alle-vacatures/vacature*'],
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, a').remove();
  $('.pt-goto-links').remove();
  $('.pt-apply-card').remove();
  $('#experience').remove();
  $('.pt-share-functions-block').remove();
  $('.pt-apply-proces').remove();
  $('.pt-block-vacancies').remove();
  $('.pt-site-footer').remove();
  $('.pt-fixed-footer').remove();
  $('.pt-btn').remove();
  $('.pt-block-story').remove();
  $('.pt-related-vacancies').remove();
  $('#cmplz-cookiebanner-container').remove();
  $("h2:contains('Enthousiast')").nextUntil('h2').addBack().remove();
  $("h2:contains('sollicitatieproces')").nextUntil('h2').addBack().remove();
  $("h5:contains('Snel naar')").next().addBack().remove();

  const content_A = $('.pt-vacancy-content').text();
  const content_B = $('.pt-main').text();

  const content = cleanText(content_A + content_B);
  log.info(`${title}`, { url: request.loadedUrl });
  s.save({ title: title, body: content, request: request });
});

export const Lentis = s;
