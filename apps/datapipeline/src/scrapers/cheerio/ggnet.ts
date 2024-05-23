import { CheerioCrawler, createCheerioRouter, PlaywrightCrawler } from 'crawlee';
import { cleanText, selectNewLinks } from '../../utils.js';
import { storage } from '../../services/storage.js';
import { CheerioScraper} from '../crawlers.js';
import { CheerioAPI } from 'cheerio';


const url = 'https://werkenbijggnet.nl/vacatures/alle'

const s = new CheerioScraper('GGNet', [url]);

s.addDefaultHandler(async ({ enqueueLinks, log, $ }) => {
  const urls = await selectNewLinks($ as CheerioAPI, {
    baseUrl: "https://werkenbijggnet.nl/",
    globs:['**/vacatures/*'],
  })
  log.info('enqueueing new URLs')
  await enqueueLinks({
    urls: urls,
    label: 'detail',
  });
});

s.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form, footer').remove();
  $('.footer, .skip').remove();
  $(".print\\:hide").remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const GGNet = s;