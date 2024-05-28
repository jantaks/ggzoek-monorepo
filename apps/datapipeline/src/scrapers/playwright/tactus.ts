import { acceptCookies, cleanText } from '../../utils.js';
import { PlaywrightScraper } from '../crawlers.js';
import { Page } from 'playwright';

const s = new PlaywrightScraper('Tactus verslavingszorg', ['https://www.tactus.nl/vacatures/']);

const baseUrl = 'https://www.tactus.nl';

s.addDefaultHandler(async ({ page }) => {
  await acceptCookies(page);
  const btnLocator = (page: Page) => page.locator('a').getByText('Volgende');
  await s.paginate(page, btnLocator, {
    globs: ['https://www.tactus.nl/vacatures/**'],
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, parseWithCheerio }) => {
  const $ = await parseWithCheerio();
  const title = $('h1').first().text();
  $('script, style, noscript, iframe, header, nav, footer, button').remove();
  $('div#cookie-law-info-bar').remove();
  $('.vacancy--reply-body').remove();
  $('.page-wave').remove();
  $('.footer').remove();
  $('.button-back').remove();
  $('#js-navbar').remove();
  $('h3>strong:contains("Interesse")').parent().nextAll().addBack().remove();
  $('h3>strong:contains("Dat klinkt")').parent().nextAll().addBack().remove();

  let text = $('main').text();
  text = cleanText(text);
  s.logger.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Tactus = s;
