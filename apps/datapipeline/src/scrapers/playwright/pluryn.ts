import { createPlaywrightRouter, PlaywrightCrawler, sleep } from 'crawlee';
import { storage } from '../../services/storage.js';
import { acceptCookies, cleanText, removeParent, selectNewLinks } from '../../utils.js';
import * as cheerio from 'cheerio';
import { defaultConfig, defaultOptions } from '../../scrape.js';


const url = 'https://www.pluryn.nl/werken-bij/vacature?filter=&address=&distance=10000';

const router = createPlaywrightRouter();
const NAME = 'Pluryn';
const options = defaultOptions(NAME);
const config = defaultConfig(NAME);
const crawler = new PlaywrightCrawler({ ...options, requestHandler: router }, config);

export async function crawlPluryn() {
  crawler.run([url]);
}

router.addDefaultHandler(async ({ enqueueLinks, log, page }) => {
  page.setDefaultTimeout(5000);
  // await page.goto(url);
  await acceptCookies(page);
  let pageCount = 1
  let more = true;
  while (more) {
    try {
      log.info(`Page ${pageCount}. Clicking more jobs button`);
      await page.getByText('Meer vacatures').click({ timeout: 2000 });
      // const req = await page.waitForRequest('**/*', { timeout: 2000 });
      await page.waitForLoadState('networkidle');
      await sleep(500)
      more = await page.getByText('Meer vacatures').isVisible({timeout: 2000});
      const bodyHtml = await page.content();
      const $: cheerio.CheerioAPI = cheerio.load(bodyHtml);
      const links = $('a.panel-vacancy')
      log.info(`Found ${links.length} links on page ${pageCount}`);
      pageCount++
    } catch (error) {
      log.error(`Failed to click the button: loaded all jobs. ${error}`);
      break;
    }
  }
  const bodyHtml = await page.content();
  const $: cheerio.CheerioAPI = cheerio.load(bodyHtml);
  const urls = await selectNewLinks($, {
    baseUrl: 'https://www.pluryn.nl',
    selector: ".panel-vacancy",
  });
  await enqueueLinks({
    urls: urls,
    label: 'detail'
  });
});


router.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header').remove();
  $('#vacancy-cta-title, .btn, .mod-breadcrumb, .sidebar-container, .vacancy-footer, .mod-footer').remove()
  var elementWithText = $('h2:contains("Dit is Pluryn")').first();
  removeParent(elementWithText);
  elementWithText = $('h3:contains("Neem contact op met onze recruiters")').first();
  removeParent(elementWithText);
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await storage.saveData('pluryn', { title: title, request: request, body: text });
  storage.saveToDb('Pluryn', {title: title, body: text, request: request})
});
