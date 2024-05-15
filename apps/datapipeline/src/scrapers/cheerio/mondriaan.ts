import { CheerioCrawler, createCheerioRouter, PlaywrightCrawler } from 'crawlee';
import { defaultConfig, defaultOptions } from '../../scrape.js';
import { cleanText } from '../../utils.js';
import { storage } from '../../services/storage.js';


const url = 'https://www.werkenbijmondriaan.nl/vacatures'

const router = createCheerioRouter();
const NAME = 'mondriaan';
const options = defaultOptions(NAME)
const config = defaultConfig(NAME)
const crawler = new CheerioCrawler({ ...options, requestHandler: router }, config)

export function crawlMondriaan() {
  return crawler.run([url])
}

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
  log.info('enqueueing new URLs')
  await enqueueLinks({
    globs: ['https://www.werkenbijmondriaan.nl/vacatures/**'],
    label: 'detail',
  });
  await enqueueLinks({
    baseUrl: url,
    selector: 'li.pager__item a',
  });
});

router.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form, footer').remove();
  $('.footer, .skip-link-container, .offcanvas, .cta').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await storage.saveData(NAME, { title: title, body: text, request: request });
  storage.saveToDb('Mondriaan', {title: title, body: text, request: request})
});