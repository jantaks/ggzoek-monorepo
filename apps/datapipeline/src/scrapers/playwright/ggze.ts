import { cleanText, getCheerioFromPage } from '../../utils.js';
import { PlaywrightScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';

const urls = [
  'https://www.werkenbijggze.nl/portal-werkenbij/psychologen',
  'https://www.werkenbijggze.nl/portal-werkenbij/psychiaters-en-artsen',
  'https://www.werkenbijggze.nl/portal-werkenbij/verpleegkundigen-en-agogische-functies'
];

const s = new PlaywrightScraper('GGzE', urls);
export const GGZE = s;

s.addDefaultHandler(async ({ page, request, log, parseWithCheerio }) => {
  await page.waitForLoadState('networkidle');
  log.info('page loaded: ' + request.loadedUrl);
  const $ = await parseWithCheerio();
  await s.enqueueNewLinks($ as CheerioAPI, {
    baseUrl: 'https://www.werkenbijggze.nl',
    selector: '.vtlink',
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, page, log }) => {
  const $ = await getCheerioFromPage(page);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form').remove();
  $('.weblogin').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});
