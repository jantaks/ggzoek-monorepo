import { cleanText } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';
import { log } from '@ggzoek/logging/src/logger.js';

const s = new CheerioScraper('De Hoop', ['https://dehoop.org/vacatures/']);

s.addDefaultHandler(async ({ $ }) => {
  await s.enqueueNewLinks($ as CheerioAPI, {
    baseUrl: 'https://dehoop.org/',
    globs: ['**/vacatures/**'],
    selector: '.archive__link',
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, $ }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, footer').remove();
  $("strong:contains('meer informatie')").parent().nextAll().addBack().remove();
  $("h2:contains('Vragen')").nextAll().addBack().remove();
  $('.vacature-cta--info').remove();
  $('.vacature-cta--button').remove();
  $('.social-share').remove();
  $('.togglebox-icon').remove();
  $('.block--vacancy-alert').remove();
  $('.vacature-process').remove();
  let text = $('.main__inner').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const DeHoop = s;
