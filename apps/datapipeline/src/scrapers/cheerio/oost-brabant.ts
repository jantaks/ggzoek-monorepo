import { cleanText } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';

const baseUrl = 'https://ggzoostbrabant.recruitee.com/';

const s = new CheerioScraper('GGZ Oost-Brabant', [baseUrl], { maxRequestsPerMinute: 20 });

s.addDefaultHandler(async ({ $ }) => {
  await s.enqueueNewLinks($ as CheerioAPI, {
    baseUrl: baseUrl,
    globs: ['/o/**'],
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const OostBrabant = s;
