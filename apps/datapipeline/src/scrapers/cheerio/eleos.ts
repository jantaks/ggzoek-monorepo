import { cleanText } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';
import { log } from '@ggzoek/logging/src/logger.js';

const s = new CheerioScraper('Eleos', ['https://www.werkenbijeleos.nl/vacatures/']);

s.addDefaultHandler(async ({ $, enqueueLinks }) => {
  await s.enqueueNewLinks($ as CheerioAPI, {
    baseUrl: 'https://www.werkenbijeleos.nl',
    globs: ['**/vacatures/**'],
    selector: 'a:has(div.job-list__title)',
    label: 'detail'
  });
  await enqueueLinks({
    baseUrl: 'https://www.werkenbijeleos.nl',
    selector: '.page'
  });
});

s.addHandler('detail', async ({ request, $ }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, footer').remove();
  $("strong:contains('meer informatie')").parent().nextAll().addBack().remove();
  $("h4:contains('Deel deze vacature')").nextAll().addBack().remove();
  let text = $('.page-main').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Eleos = s;
