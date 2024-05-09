import { createPlaywrightRouter, sleep } from 'crawlee';
import { localstorage } from '../../services/localstorage.js';
import { acceptCookies, cleanText, removeParent } from '../../utils.js';
import * as cheerio from 'cheerio';

export const router = createPlaywrightRouter();

const url = 'https://www.werkenbijggzcentraal.nl/vacatures'


router.addDefaultHandler(async ({ enqueueLinks, log, page }) => {
  page.setDefaultTimeout(5000);
  // await page.goto(url);
  await acceptCookies(page);

  let pageCounter = 1;
  while (pageCounter > 0) {
    try {
      log.info(`Next page: ${pageCounter}`);
      await page.locator('a.rnNext').click({ timeout: 2000 });
      await sleep(1000)
      await page.waitForLoadState('networkidle');
      await page.waitForLoadState('domcontentloaded');
      await enqueueLinks({
        globs: ['https://www.werkenbijggzcentraal.nl/vacatures/*/**'],
        label: 'detail'
      });
      pageCounter++;
    } catch (error) {
      log.info(`No more pages. ${error}`);
      break;
    }
  }
});


router.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, footer, form').remove();
  $('.custom-css-section-footer').remove()
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await localstorage.saveData('ggz-centraal', { title: title, request: request, body: text });
});

export const ggzCentraalRouter = router;