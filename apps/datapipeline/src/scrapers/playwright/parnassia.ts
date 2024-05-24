import { sleep } from 'crawlee';
import * as cheerio from 'cheerio';
import { acceptCookies, cleanText } from '../../utils.js';
import {  PlaywrightScraper } from '../crawlers.js';

const s = new PlaywrightScraper('Parnassia', ['https://werkenbijparnassiagroep.nl/home'], {requestHandlerTimeoutSecs: 180});
export const Parnassia = s;


s.addDefaultHandler(async ({ page, log }) => {
  await page.getByRole('button', { name: 'Accepteren' }).click();
  sleep(500);
  await page.waitForLoadState('networkidle');
  let more = true;
  let pageNo = 1;
  while (more && pageNo < 1000) {
    const moreButton = page.locator('.css_button.ui_jobs_more').locator('visible=true').first();
    more = await moreButton.count() > 0;
    if (!more) break;
    log.info(`Loading more vacatures: ${pageNo}`);
    await moreButton.click({timeout: 2000});
    await page.waitForLoadState('networkidle');
    await sleep(1000);
    const vacatureCount = await page.locator('.css_jobsCell').count();
    log.info(`Meer vacatures geladen: ${vacatureCount} vacatures`);
    pageNo++;
  }
  const bodyHtml = await page.content();
  const $: cheerio.CheerioAPI = cheerio.load(bodyHtml);
  await s.enqueuNewLinks($, {
    baseUrl: 'https://werkenbijparnassiagroep.nl',
    globs: ['/ad/**'],
    label: 'detail'
  });
});

s.addHandler('detail', async ({ page, log, request }) => {
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
