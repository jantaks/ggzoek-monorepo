import { cleanText } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';
import { log } from '@ggzoek/logging/src/logger.js';

const s = new CheerioScraper('Accare', ['https://www.accare.nl/werken-bij/vacature-overzicht']);

s.addDefaultHandler(async ({ $ }) => {
  await s.enqueueNewLinks($ as CheerioAPI, {
    baseUrl: 'https://www.accare.nl/',
    globs: ['**/vacature-overzicht/**'],
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, $ }) => {
  const title = $('h1.heading').text();
  $('.breadcrumbs').remove();
  $('.button').remove();
  $("h2:contains('Meer informatie')").nextAll().addBack().remove();
  $("h2:contains('meer weten')").nextAll().addBack().remove();
  $("h2:contains('enthousiast')").nextAll().addBack().remove();
  $("h2:contains('Solliciteren')").nextAll().addBack().remove();
  $("h2:contains('Spreekt dit je aan?')").nextAll().addBack().remove();
  $("h2:contains('Interesse?')").nextAll().addBack().remove();
  let text = $('article').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Accare = s;
