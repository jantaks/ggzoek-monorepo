import { acceptCookies, cleanText, cleanTitle } from '../../utils.js';
import { PlaywrightScraper } from '../crawlers.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { Page } from 'playwright';

const s = new PlaywrightScraper('Molemann', ['https://www.molemann.nl/werken-bij-molemann']);

s.addDefaultHandler(async ({ page, request }) => {
  await acceptCookies(page);
  log.info(`${request.loadedUrl}`);
  const buttonLocator = (page: Page) => page.locator('a[rel="next"]');
  await s.paginate(page, buttonLocator, {
    baseUrl: 'https://www.molemann.nl',
    selector: 'a:contains("Lees meer")',
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
  $('.region-antihero').remove();
  $("p:contains('Wil je eerst meer informatie')").nextAll().addBack().remove();
  $('a').remove();
  let text = $('main').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Molemann = s;
