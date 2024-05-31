import { cleanText } from '../../utils.js';
import { PlaywrightScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';
import { log } from '@ggzoek/logging/src/logger.js';

const s = new PlaywrightScraper('Iriszorg', ['https://werkenbij.iriszorg.nl/alle-vacatures']);

s.addDefaultHandler(async ({ page, parseWithCheerio }) => {
  await page.waitForLoadState('networkidle');
  const $ = await parseWithCheerio();
  await s.enqueueNewLinks($ as CheerioAPI, {
    baseUrl: 'https://werkenbij.iriszorg.nl/',
    selector: '.vtlink',
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, parseWithCheerio }) => {
  const $ = await parseWithCheerio();
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form, button').remove();
  $('.weblogin').remove();
  $("div.part:contains('Wil je meer weten')").remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Iriszorg = s;
