import { createPlaywrightRouter, sleep } from 'crawlee';
import { storage } from '../../services/storage.js';
import { acceptCookies, cleanText } from '../../utils.js';
import * as cheerio from 'cheerio';
import { PlaywrightScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';
import { log } from '@ggzoek/logging/src/logger.js';
import { errors } from 'playwright';


const url = 'https://www.werkenbijyulius.nl/vacatures/';

const s = new PlaywrightScraper('Yulius', [url]);


s.addDefaultHandler(async ({ parseWithCheerio, page }) => {
  await acceptCookies(page);
  while (true) {
    try {
      log.info(`Clicking more jobs button`);
      await page.getByText('Laad meer').click({ timeout: 2000 });
      await page.waitForRequest('**/*', { timeout: 2000 });
      await sleep(1000)
    } catch (error: unknown) {
      if (error instanceof errors.TimeoutError && error.message.includes('page.waitForRequest')) {
        log.info('No more jobs to load');
        break;
      }
      else {
        log.error(`Error occured in ${s.name}`);
        break;
      }
    }
  }
  await s.enqueuNewLinks(await parseWithCheerio() as CheerioAPI, {
    globs: ['**/vacature/**'],
    baseUrl: 'https://www.werkenbijyulius.nl',
    label: 'detail'
  });
});


s.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header').remove();
  $('.vacature-content-sidebar, .vacature-content-sidebar, #footer, .sollicitatie_proces, .btn, .btn-container, .vergelijkbare_vacatures, .extra_vacature_info').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, request: request, body: text });
});

export const Yulius = s;