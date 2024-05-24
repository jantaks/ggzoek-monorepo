import { cleanText } from '../../utils.js';
import { PlaywrightScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';


const s = new PlaywrightScraper("GGZ WNB", [
  'https://werkenbij.ggzwnb.nl/'
])

s.addDefaultHandler(async ({ parseWithCheerio, page, request, log }) => {
  await page.waitForLoadState('networkidle')
  log.info('page loaded: ' + request.loadedUrl)
  const $ = await parseWithCheerio();
  await s.enqueuNewLinks($ as CheerioAPI, {
    baseUrl: 'https://werkenbij.ggzwnb.nl/',
    selector: '.vtlink',
    label: 'detail'
  })
});

s.addHandler('detail', async ({ request, log, parseWithCheerio }) => {
  const $ = await parseWithCheerio();
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form').remove();
  $('.weblogin').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const GGZWNB = s