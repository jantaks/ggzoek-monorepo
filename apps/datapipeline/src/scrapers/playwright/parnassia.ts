import { createPlaywrightRouter, PlaywrightCrawler, sleep } from 'crawlee';
import { storage } from '../../services/storage.js';
import * as cheerio from 'cheerio';
import { acceptCookies, cleanText, logger, selectNewLinks } from '../../utils.js';
import { defaultConfig, defaultOptions } from '../../scrape.js';

const router = createPlaywrightRouter();
const NAME = 'parnassia';
const options = defaultOptions(NAME);
const config = defaultConfig(NAME);
const crawler = new PlaywrightCrawler({ ...options, requestHandler: router }, config);

const urls = ['https://werkenbijparnassiagroep.nl/home'];

export async function crawlParnassia() {
  crawler.run(urls);
}

router.addDefaultHandler(async ({ enqueueLinks, page, log }) => {
  await acceptCookies(page);
  sleep(500)
  await page.waitForLoadState('networkidle');
  let more = true;
  let pageNo = 1
  while (more && pageNo < 2) {
    const moreButton = await page.locator('.css_button.ui_jobs_more').locator('visible=true').first();
    more = await moreButton.count() > 0;
    if (!more) break;
    await moreButton.click();
    await page.waitForLoadState('networkidle');
    await sleep(1000);
    const vacatureCount = await page.locator('.css_jobsCell').count();
    log.info(`Meer vacatures geladen: ${vacatureCount} vacatures`);
    pageNo++;
  }
  const bodyHtml = await page.content();
  const $: cheerio.CheerioAPI = cheerio.load(bodyHtml);
  const urls = await selectNewLinks($, {
    baseUrl: 'https://werkenbijparnassiagroep.nl',
    globs: ['/ad/**']
  });

  log.info(`enqueueing new URLs: ${urls.length}`);
  await enqueueLinks({
    urls: urls,
    label: 'detail'
  });
});

router.addHandler('detail', async ({ page, log, request }) => {
  const title = await page.title();
  const bodyHtml = await page.content();
  const $: cheerio.CheerioAPI = cheerio.load(bodyHtml);
  $('script, style').remove();
  let text = $('main').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await storage.saveData('PARNASSIA', {
    title: title,
    body: text,
    request: request
  });
  storage.saveToDb('Parnassia', {title: title, body: text, request: request})
});
