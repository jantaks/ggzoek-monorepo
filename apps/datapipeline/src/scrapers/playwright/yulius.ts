import { createPlaywrightRouter, sleep } from 'crawlee';
import { localstorage } from '../../services/localstorage.js';
import { acceptCookies, cleanText } from '../../utils.js';
import * as cheerio from 'cheerio';

export const router = createPlaywrightRouter();

const url = 'https://www.werkenbijyulius.nl/vacatures/';


router.addDefaultHandler(async ({ enqueueLinks, log, page }) => {
  page.setDefaultTimeout(5000);
  // await page.goto(url);
  await acceptCookies(page);

  let more = true;
  while (more) {
    try {
      log.info(`Clicking more jobs button`);
      await page.getByText('Laad meer').click({ timeout: 1000 });
      const req = await page.waitForRequest('**/*', { timeout: 2000 });
      await page.waitForLoadState('networkidle');
      more = await page.getByText('Laad meer').isVisible();
    } catch (error) {
      log.error(`Failed to click the button: loaded all jobs. ${error}`);
      break;
    }
  }
  await enqueueLinks({
    globs: ['https://www.werkenbijyulius.nl/vacature/**'],
    label: 'detail'
  });
});


router.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header').remove();
  $('.vacature-content-sidebar, .vacature-content-sidebar, #footer, .sollicitatie_proces, .btn, .btn-container, .vergelijkbare_vacatures, .extra_vacature_info').remove()
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await localstorage.saveData('Yulius', { title: title, request: request, body: text });
});

export const yuliusRouter = router;