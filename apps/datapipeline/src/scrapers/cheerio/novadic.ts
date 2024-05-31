import { cleanText } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';
import { log } from '@ggzoek/logging/src/logger.js';

const s = new CheerioScraper('Novadic Kentron', ['https://werkenbij.novadic-kentron.nl/']);

s.addDefaultHandler(async ({ $ }) => {
  await s.enqueueNewLinks($ as CheerioAPI, {
    baseUrl: 'https://werkenbij.novadic-kentron.nl/',
    globs: ['**/vacatures/**'],
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, $ }) => {
  const title = $('h1').text();
  $('header').remove();
  $('table').remove();
  $('a').remove();
  $('form').remove();
  $('#solliciteren-formulier').remove();
  $("p>strong:contains('Vragen')").parent().nextAll().addBack().remove();
  $("p>strong:contains('Meer informatie')").parent().nextAll().addBack().remove();
  let text = $('.single-vacatures-content').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Novadic = s;
