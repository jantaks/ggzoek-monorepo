import {  sleep } from 'crawlee';
import { acceptCookies, cleanText } from '../../utils.js';
import * as cheerio from 'cheerio';
import {  PlaywrightScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';


const s = new PlaywrightScraper('Rivierduinen', ['https://rivierduinen.recruitee.com/vacatures'], {maxRequestsPerMinute: 10});
export const Rivierduinen = s;

s.addDefaultHandler(async ({ parseWithCheerio, log, page }) => {
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
  const $ = await parseWithCheerio();
  await s.enqueuNewLinks($ as CheerioAPI, {
    baseUrl: "https://rivierduinen.recruitee.com",
    globs: ['**/o/*'],
    label: 'detail'
  });
});


s.addHandler('detail', async ({ request, page, log }) => {
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
  s.save({ title: title, request: request, body: text });
});

