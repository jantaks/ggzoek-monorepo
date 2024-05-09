import { createPlaywrightRouter, PlaywrightCrawler, sleep } from 'crawlee';
import { localstorage } from '../../services/localstorage.js';
import { acceptCookies, cleanText, removeParent } from '../../utils.js';
import * as cheerio from 'cheerio';
import { defaultConfig, defaultOptions } from '../../scrape.js';


const router = createPlaywrightRouter();
const URL = 'https://rivierduinen.recruitee.com/vacatures'
const NAME = 'rivierduinen'
const options = {...defaultOptions(NAME), maxRequestsPerMinute: 10}
const config = defaultConfig(NAME)
const crawler = new PlaywrightCrawler({ ... options, requestHandler: router}, config);

export function crawlRivierduinen() {
  return crawler.run([URL])
}

router.addDefaultHandler(async ({ enqueueLinks, log, page }) => {
  page.setDefaultTimeout(5000);
  await acceptCookies(page);

  let pageCounter = 1;
  while (pageCounter > 0  ) {
    try {
      log.info(`Next page: ${pageCounter}`);
      await page.getByText("Toon meer vacatures").click({ timeout: 2000 });
      await sleep(500)
      pageCounter++;
    } catch (error) {
      log.info(`No more pages. ${error}`);
      break;
    }
  }
  await enqueueLinks({
    globs: ['**/o/*'],
    label: 'detail'
  });
});


router.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, footer, form').remove();
  $('.rnBreadcrumb, .elementSticky, .rowRelated, #CybotCookiebotDialog, .rnCarousel').remove()
  var targetDiv = $('div[data-scroll-point="section-navigation"]');
  if (targetDiv.length) {
    targetDiv.remove();
  }
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await localstorage.saveData('rivierduinen', { title: title, request: request, body: text });
});

