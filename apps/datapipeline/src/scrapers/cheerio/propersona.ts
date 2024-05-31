import { cleanText } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';

const url = 'https://www.werkenbijpropersona.nl/vacature-overzicht/';

const s = new CheerioScraper('Propersona', [url]);

s.addDefaultHandler(async ({ enqueueLinks, $ }) => {
  await s.enqueueNewLinks($ as CheerioAPI, {
    globs: ['https://www.werkenbijpropersona.nl/vacature/**'],
    label: 'detail'
  });
  await enqueueLinks({
    baseUrl: url,
    selector: 'a.page-link'
  });
});

s.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form').remove();
  $('#sollicitatie-proces, .gerelateerde_vacatures, .collegas_aan_het_woord, #footer').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Propersona = s;
