import { cleanText } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';

const s = new CheerioScraper('GGZ Friesland', ['https://werkenbijggzfriesland.nl/vacatures']);

s.addDefaultHandler(async ({ $ }) => {
  await s.enqueueNewLinks($ as CheerioAPI, {
    label: 'detail',
    baseUrl: 'https://www.werkenbijggzfriesland.nl',
    globs: ['**/vacatures/*']
  });
});

s.addHandler('detail', async ({ request, $, log }) => {
  const title = $('.underH1').text();
  $('script, style, noscript, iframe, header, nav').remove();
  let text = $('#vacancyPage').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  s.save({ title: title, body: text, request: request });
});

export const GGZFriesland = s;
