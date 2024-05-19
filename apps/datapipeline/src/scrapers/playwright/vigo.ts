import { createPlaywrightRouter, PlaywrightCrawler, sleep } from 'crawlee';
import { storage } from '../../services/storage.js';
import { acceptCookies, cleanText, getCheerioFromPage, removeParent, selectNewLinks } from '../../utils.js';
import * as cheerio from 'cheerio';
import { defaultConfig, defaultOptions, PlaywrightScraper } from '../crawlers.js';

const url = 'https://werkenbijvigogroep.recruitee.com/'
const options = {...defaultOptions(), maxRequestsPerMinute: 10}
const s = new PlaywrightScraper('Vincent van Gogh GGZ', [url], options)

s.router.addDefaultHandler(async ({ enqueueLinks, log, page }) => {
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
  const $ = await getCheerioFromPage(page)
  const urls = await selectNewLinks($, {
    baseUrl: url,
    globs: ['**/o/*']
  })
  await enqueueLinks({
    urls: urls,
    label: 'detail'
  });
});


s.router.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, footer, form').remove();
  $('.rnBreadcrumb, .elementSticky, .rowRelated, #CybotCookiebotDialog, .rnCarousel').remove()
  const targetDiv = $('div[role="dialog"]');
  if (targetDiv.length) {
    targetDiv.remove();
  }
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  s.save({ title: title, request: request, body: text });
});

export const VIGO = s;

