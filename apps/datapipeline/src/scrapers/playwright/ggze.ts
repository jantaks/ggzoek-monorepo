import { CheerioCrawler, createCheerioRouter, createPlaywrightRouter, PlaywrightCrawler, sleep } from 'crawlee';
import { storage } from '../../services/storage.js';
import { cleanText } from '../../utils.js';
import { defaultConfig, defaultOptions } from '../../scrape.js';
import * as cheerio from 'cheerio';


const urls = [
  'https://www.werkenbijggze.nl/portal-werkenbij/psychologen',
  'https://www.werkenbijggze.nl/portal-werkenbij/psychiaters-en-artsen',
  'https://www.werkenbijggze.nl/portal-werkenbij/verpleegkundigen-en-agogische-functies'
]

const router = createPlaywrightRouter();
const NAME = 'GGZE'
const options = defaultOptions(NAME)
const config = defaultConfig(NAME)
const crawler = new PlaywrightCrawler({ ...options, requestHandler: router }, config)

export function crawlGGZE() {
  return crawler.run(urls)
}

router.addDefaultHandler(async ({ enqueueLinks, page, request, log }) => {
  await page.waitForLoadState('networkidle')
  log.info('page loaded: ' + request.loadedUrl)
  await enqueueLinks({
    globs: ['**/*'],
    label: 'detail',
    selector: '.vtlink',
  });
});

router.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form').remove();
  $('.weblogin').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await storage.saveData(NAME, { title: title, body: text, request: request });
  storage.saveToDb('GGZ Eindhoven', {title: title, body: text, request: request})
});

