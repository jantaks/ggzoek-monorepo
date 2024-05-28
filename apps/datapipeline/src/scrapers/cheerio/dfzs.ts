import { cleanText } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';
import { log } from '@ggzoek/logging/src/logger.js';

const s = new CheerioScraper('De Forensische Zorgspecialisten', [
  'https://werkenbijdfzs.nl/vacatures/'
]);

const baseUrl = 'https://werkenbijdfzs.nl/vacatures/';

s.addDefaultHandler(async ({ enqueueLinks, $ }) => {
  await s.enqueuNewLinks($ as CheerioAPI, {
    baseUrl: 'https://werkenbijdfzs.nl',
    globs: ['**/vacatures/**'],
    label: 'detail'
  });
  await enqueueLinks({
    baseUrl: baseUrl,
    selector: 'nav>a',
    globs: ['**/vacatures/p:*']
  });
});

s.addHandler('detail', async ({ request, $ }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav').remove();

  $('#header-top').remove();
  $('.button').remove();
  $('.cup-of-coffee-content').remove();
  const sections = $('section');
  const remove = [2, 3, 4, 5, 6];
  remove.forEach((i) => {
    if (sections[i]) {
      $(sections[i]).remove();
    }
  });

  let text = $('main').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  s.save({ title: title, body: text, request: request });
});

export const DFZS = s;
