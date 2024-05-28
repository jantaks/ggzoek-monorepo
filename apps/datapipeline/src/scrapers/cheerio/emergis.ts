import { cleanText, selectNewLinks } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';

const baseUrl = 'https://werkenbijemergis.nl/vacatures';

const s = new CheerioScraper('Emergis', [baseUrl]);

s.addDefaultHandler(async ({ enqueueLinks, $ }) => {
  const urls = await selectNewLinks($ as CheerioAPI, {
    baseUrl: 'https://werkenbijemergis.nl',
    selector: '.teaser__link',
    globs: ['**/vacatures/**']
  });

  await enqueueLinks({
    urls: urls,
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form').remove();
  $('.site-navbar, .site-header, .site-footer, .ta-cookies, .block-share-page, .btn').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Emergis = s;
