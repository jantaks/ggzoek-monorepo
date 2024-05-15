import { CheerioCrawler, createCheerioRouter, PlaywrightCrawler } from 'crawlee';
import { defaultConfig, defaultOptions } from '../../scrape.js';
import { cleanText } from '../../utils.js';
import { storage } from '../../services/storage.js';


const url = 'https://werkenbijggnet.nl/vacatures/alle'

const router = createCheerioRouter();
const NAME = 'ggnet';
const options = defaultOptions(NAME)
const config = defaultConfig(NAME)
const crawler = new CheerioCrawler({ ...options, requestHandler: router }, config)

export function crawlGGNET() {
  return crawler.run([url])
}

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
  log.info('enqueueing new URLs')
  await enqueueLinks({
    globs: ['https://werkenbijggnet.nl/vacatures/**'],
    label: 'detail',
  });
});

router.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form, footer').remove();
  $('.footer, .skip').remove();
  $(".print\\:hide").remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await storage.saveData(NAME, { title: title, body: text, request: request });
  storage.saveToDb('GGNet', {title: title, body: text, request: request})
});