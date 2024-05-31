import { cleanText } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';

const url = 'https://www.werkenbijmondriaan.nl/vacatures';

const s = new CheerioScraper('Mondriaan', [url]);

s.addDefaultHandler(async ({ enqueueLinks, log, $ }) => {
  log.info('enqueueing new URLs');
  await s.enqueueNewLinks($ as CheerioAPI, {
    baseUrl: 'https://www.werkenbijmondriaan.nl',
    globs: ['**/vacatures/**'],
    label: 'detail'
  });
  await enqueueLinks({
    baseUrl: url,
    selector: 'li.pager__item a'
  });
});

s.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form, footer').remove();
  $('.footer, .skip-link-container, .offcanvas, .cta').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Mondriaan = s;
