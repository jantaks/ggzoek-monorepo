import { cleanText } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';
import { log } from '@ggzoek/logging/src/logger.js';

const s = new CheerioScraper('Karakter', [
  'https://werkenbij.karakter.com/vacatures/behandelaren',
  'https://werkenbij.karakter.com/vacatures/management-en-ondersteuning'
]);

s.addDefaultHandler(async ({ enqueueLinks, $ }) => {
  await s.enqueueNewLinks($ as CheerioAPI, {
    baseUrl: 'https://werkenbij.karakter.com/',
    globs: ['**/vacatures/**'],
    selector: '.headline__link',
    label: 'detail'
  });
  await enqueueLinks({
    baseUrl: 'https://werkenbij.karakter.com',
    selector: '.pagination__item'
  });
});

s.addHandler('detail', async ({ request, $ }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav').remove();
  $('.button').remove();
  $('.footer').remove();
  $('.hero').remove();
  $('a').remove();
  $("h2:contains('Meer informatie')").parent().nextAll().addBack().remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  s.save({ title: title, body: text, request: request });
});

export const Karakter = s;
