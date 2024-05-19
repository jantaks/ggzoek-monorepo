import { cleanText, selectNewLinks } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';

const url = 'https://www.werkenbijihub.nl/vacatures';

const s = new CheerioScraper('iHub', [url]);

s.router.addDefaultHandler(async ({ enqueueLinks, $ }) => {
  const urls = await selectNewLinks($ as CheerioAPI, {
    baseUrl: url,
    selector: ".card--vacature"
  });
  await enqueueLinks({
    urls: urls,
    label: 'detail'
  });
  await enqueueLinks({
    selector: ".pagination__page",
  })
});


s.router.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form').remove();
  $('#sollicitatie-proces, .gerelateerde_vacatures, .collegas_aan_het_woord, #footer').remove();
  let text = $('.content__blokken').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  s.save({ title: title, body: text, request: request });
});

export const IHUB = s;
