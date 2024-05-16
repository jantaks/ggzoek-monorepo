import { sleep } from 'crawlee';
import * as cheerio from 'cheerio';
import { acceptCookies, cleanText,  selectNewLinks } from '../../utils.js';
import {  PlaywrightScraper } from '../crawlers.js';

const s = new PlaywrightScraper('Parnassia', ['https://werkenbijparnassiagroep.nl/home']);
export const Parnassia = s;


s.router.addDefaultHandler(async ({ enqueueLinks, page, log }) => {
  await acceptCookies(page);
  sleep(500);
  await page.waitForLoadState('networkidle');
  let more = true;
  let pageNo = 1;
  while (more && pageNo < 1000) {
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

s.router.addHandler('detail', async ({ page, log, request }) => {
  const title = await page.title();
  const bodyHtml = await page.content();
  const $: cheerio.CheerioAPI = cheerio.load(bodyHtml);
  $('script, style').remove();
  let text = $('main').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({
    title: title,
    body: text,
    request: request
  });
});
