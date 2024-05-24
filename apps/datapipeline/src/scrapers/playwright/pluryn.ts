import { sleep } from 'crawlee';
import { acceptCookies, cleanText, removeParent, selectNewLinks } from '../../utils.js';
import * as cheerio from 'cheerio';
import { PlaywrightScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';


const s = new PlaywrightScraper('Pluryn', ['https://www.pluryn.nl/werken-bij/vacature?filter=&address=&distance=10000'])
export const Pluryn = s

s.addDefaultHandler(async ({ log, page, parseWithCheerio }) => {
  page.setDefaultTimeout(5000);
  await acceptCookies(page);
  let pageCount = 1
  let more = true;
  while (more) {
    try {
      log.info(`Page ${pageCount}. Clicking more jobs button`);
      await page.getByText('Meer vacatures').click({ timeout: 2000 });
      await page.waitForLoadState('networkidle');
      await sleep(1000)
      more = await page.getByText('Meer vacatures').isVisible({timeout: 2000});
      pageCount++
    } catch (error) {
      log.error(`Failed to click the button: loaded all jobs. ${error}`);
      break;
    }
  }
  const $ = await parseWithCheerio()
  await s.enqueuNewLinks($ as CheerioAPI, {
    baseUrl: 'https://www.pluryn.nl',
    selector: ".panel-vacancy",
    label: 'detail'
  });
});


s.addHandler('detail', async ({ request, page, log }) => {
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
  await s.save({ title: title, request: request, body: text });
});
