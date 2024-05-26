import { sleep } from 'crawlee';
import * as cheerio from 'cheerio';
import { cleanText } from '../../utils.js';
import {  PlaywrightScraper } from '../crawlers.js';
import { Page } from 'playwright';

const s = new PlaywrightScraper('Parnassia', ['https://werkenbijparnassiagroep.nl/home'], {requestHandlerTimeoutSecs: 180});
export const Parnassia = s;


s.addDefaultHandler(async ({ page }) => {
  try{
    await page.getByRole('button', { name: 'Accepteren' }).click({timeout: 2000});
  }
  catch(e){
    console.log('No cookies to accept')
  }
  await sleep(2000);
  await page.waitForLoadState('networkidle');
  const buttonLocator = (page: Page)=>page.locator('.css_button.ui_jobs_more').locator('visible=true')
  await s.expand(page, buttonLocator, {
    baseUrl: 'https://werkenbijparnassiagroep.nl',
    globs: ['/ad/**'],
    label: 'detail'
  })
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
