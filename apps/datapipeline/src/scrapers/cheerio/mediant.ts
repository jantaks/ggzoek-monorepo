import { cleanText, selectNewLinks } from '../../utils.js';
import { CheerioAPI } from 'cheerio';
import { CheerioScraper } from '../crawlers.js';

const s = new CheerioScraper('Mediant', ['https://werkenbijmediant.nl/vacatures']);

s.addDefaultHandler(async ({ $ }) => {
  await s.enqueuNewLinks($ as CheerioAPI,
    {
      baseUrl: 'https://werkenbijmediant.nl',
      selector: '.vacancy-index-item-title',
      label: 'detail'
    });
});

s.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav').remove();
  $('.vacancy-detail-sidebar, .vacancy-details.cta, .modal').remove();
  let text = $('.container_vacancy-detail').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Mediant = s;