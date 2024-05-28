import { acceptCookies, cleanText } from '../../utils.js';
import { PlaywrightScraper } from '../crawlers.js';
import { Page } from 'playwright';

const s = new PlaywrightScraper('De Forensische Zorgspecialisten', [
  'https://werkenbijdfzs.nl/vacatures/'
]);

const baseUrl = 'https://werkenbijdfzs.nl';

s.addDefaultHandler(async ({ page }) => {
  await acceptCookies(page);
  const btnLocator = (page: Page) => page.locator('a.active + a');
  await s.paginate(page, btnLocator, {
    baseUrl: baseUrl,
    globs: ['**/vacatures/**'],
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, parseWithCheerio }) => {
  const $ = await parseWithCheerio();
  const title = $('h1').first().text();
  $('script, style, noscript, iframe, header, nav').remove();

  $('#header-top').remove();
  $('.button').remove();
  $('.cup-of-coffee-content').remove();
  const sections = $('section');
  const remove = [2, 3, 4, 5, 6];
  remove.forEach((i) => {
    if (sections[i]) {
      $(sections[i]).remove();
    }
  });

  let text = $('main').text();
  text = cleanText(text);
  s.logger.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const DFZS = s;
