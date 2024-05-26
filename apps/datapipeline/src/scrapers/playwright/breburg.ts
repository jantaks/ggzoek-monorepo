import { acceptCookies, cleanText, cleanTitle } from '../../utils.js';
import { PlaywrightScraper } from '../crawlers.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { Page } from 'playwright';

const s = new PlaywrightScraper('GGZ Breburg', ['https://www.werkenbijggzbreburg.nl/vacatures/']);

s.addDefaultHandler(async ({ page,  request }) => {
  await acceptCookies(page);
  log.info(`${request.loadedUrl}`)
  const buttonLocator = (page: Page) => page.locator('a.paging-next');
  await s.paginate(page, buttonLocator, {
    baseUrl: 'https://www.werkenbijggzbreburg.nl/',
    globs: ['**/vacatures/*'],
    label: 'detail'
  })
});

s.addHandler('detail', async ({ request, parseWithCheerio, log }) => {
  const $ = await parseWithCheerio()
  const title = cleanTitle($('title').text()).replace('Werken bij GGz Breburg', '');
  $('script, style, noscript, iframe, header, nav').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Breburg = s;
