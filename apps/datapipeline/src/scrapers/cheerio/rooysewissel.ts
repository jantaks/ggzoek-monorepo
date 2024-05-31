import { cleanText } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';
import { log } from '@ggzoek/logging/src/logger.js';

const s = new CheerioScraper('Rooyse Wissel', [
  'https://www.derooysewissel.nl/werken-bij/vacatures/'
]);

s.addDefaultHandler(async ({ $ }) => {
  await s.enqueueNewLinks($ as CheerioAPI, {
    baseUrl: 'https://www.derooysewissel.nl',
    selector: '.link-arrow-right',
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, $ }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, footer').remove();
  $('.button').remove();
  $('.cookieBar').remove();
  $('.back-btn').remove();
  $('.job-apply-form-section').remove();
  $("h5:contains('Meer weten')").nextUntil('h1, h2, h3, h4, h5').addBack().remove();
  $("h4:contains('Solliciteer')").nextUntil('h1, h2, h3, h4, h5').addBack().remove();
  $("h4:contains('Deel deze vacature')").nextAll().addBack().remove();
  let text = $('.main').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Rooysewissel = s;
