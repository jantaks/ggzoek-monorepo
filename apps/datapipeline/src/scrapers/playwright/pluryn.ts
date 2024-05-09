import { createPlaywrightRouter, sleep } from 'crawlee';
import { localstorage } from '../../services/localstorage.js';
import { acceptCookies, cleanText, removeParent } from '../../utils.js';
import * as cheerio from 'cheerio';

export const router = createPlaywrightRouter();

const url = 'https://www.pluryn.nl/werken-bij/vacature?filter=&address=&distance=10000';


router.addDefaultHandler(async ({ enqueueLinks, log, page }) => {
  page.setDefaultTimeout(5000);
  // await page.goto(url);
  await acceptCookies(page);

  let more = true;
  while (more) {
    try {
      log.info(`Clicking more jobs button`);
      await page.getByText('Meer vacatures').click({ timeout: 2000 });
      // const req = await page.waitForRequest('**/*', { timeout: 2000 });
      await page.waitForLoadState('networkidle');
      more = await page.getByText('Meer vacatures').isVisible();
    } catch (error) {
      log.error(`Failed to click the button: loaded all jobs. ${error}`);
      break;
    }
  }
  await enqueueLinks({
    globs: ['https://www.pluryn.nl/werken-bij/vacature/**'],
    label: 'detail'
  });
});


router.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header').remove();
  $('#vacancy-cta-title, .btn, .mod-breadcrumb, .sidebar-container, .vacancy-footer, .mod-footer').remove()
  var elementWithText = $('h2:contains("Dit is Pluryn")').first();
  removeParent(elementWithText);
  elementWithText = $('h3:contains("Neem contact op met onze recruiters")').first();
  removeParent(elementWithText);
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await localstorage.saveData('pluryn', { title: title, request: request, body: text });
});

export const plurynRouter = router;