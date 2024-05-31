import { cleanText } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';
import { log } from '@ggzoek/logging/src/logger.js';

const s = new CheerioScraper('De Viersprong', ['https://www.werkenbijdeviersprong.nl/vacatures/']);

s.addDefaultHandler(async ({ $ }) => {
  await s.enqueueNewLinks($ as CheerioAPI, {
    baseUrl: 'https://www.werkenbijdeviersprong.nl',
    selector: '.plain',
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, $ }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav').remove();
  $('.post-sidebar').remove();
  $('.button').remove();
  $("h2:contains('Meer informatie')").parent().nextAll().addBack().remove();
  let text = $('main').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  s.save({ title: title, body: text, request: request });
});

export const Viersprong = s;
