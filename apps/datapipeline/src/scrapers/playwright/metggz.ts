import { acceptCookies, cleanText, cleanTitle } from '../../utils.js';
import { PlaywrightScraper } from '../crawlers.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { Page } from 'playwright';

const s = new PlaywrightScraper('Met GGZ', ['https://www.metggz.nl/werken-bij-met-ggz/vacatures']);

s.addDefaultHandler(async ({ page, request }) => {
  await acceptCookies(page);
  log.info(`${request.loadedUrl}`);
  const buttonLocator = (page: Page) => page.locator('li.active + li > a.page');
  await s.paginate(page, buttonLocator, {
    baseUrl: 'https://www.metggz.nl/',
    globs: ['**/vacature-details/*'],
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, parseWithCheerio, log }) => {
  const $ = await parseWithCheerio();
  const title = cleanTitle($('h1').first().text()).replace('Werken bij GGz Breburg', '');
  $('script, style, noscript, iframe, header, nav').remove();
  $('.button').remove();
  $('.btn').remove();
  $('.footer').remove();
  $('.hero').remove();
  $("p>strong:contains('solliciteren')").parent().nextAll().addBack().remove();
  $('a').remove();
  let text = $('.main__article').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const METGGZ = s;
