import { cleanText } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';

const url = 'https://werkenbijggnet.nl/vacatures/alle';

const s = new CheerioScraper('GGNet', [url]);

s.addDefaultHandler(async ({ $ }) => {
  await s.enqueueNewLinks($ as CheerioAPI, {
    baseUrl: 'https://werkenbijggnet.nl/',
    globs: ['**/vacatures/*'],
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form, footer').remove();
  $('.footer, .skip').remove();
  $('.print\\:hide').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const GGNet = s;
