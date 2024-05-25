import { sleep } from 'crawlee';

import { acceptCookies, cleanText, getCheerioFromPage } from '../../utils.js';
import * as cheerio from 'cheerio';
import { PlaywrightScraper } from '../crawlers.js';

const url = 'https://www.werkenbijlentis.nl/alle-vacatures/?q='
const s = new PlaywrightScraper('Lentis', [url])

s.addDefaultHandler(async ({ log, page }) => {
  page.setDefaultTimeout(5000);
  await acceptCookies(page);

  let pageCounter = 1;
  while (pageCounter > 0  ) {
    try {
      log.info(`Next page: ${pageCounter}`);
      await page.locator('a').getByText("Volgende").click({ timeout: 2000 });
      await sleep(500)
      const $ = await getCheerioFromPage(page)
      await s.enqueuNewLinks($, {
        baseUrl: 'https://www.werkenbijlentis.nl/',
        globs: ['**/alle-vacatures/vacature*'],
        label: 'detail'
      })
      pageCounter++;
    } catch (error) {
      log.info(`No more pages. ${error}`);
      break;
    }
  }

});


s.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav').remove();
  $('.pt-goto-links').remove();
  $('.pt-apply-card').remove();
  $('#experience').remove();
  $('.pt-share-functions-block').remove();
  $('.pt-apply-proces').remove();
  $('.pt-related-vacancies').remove();

  let content = $('.entry-content').text();

  content = cleanText(content);
  log.info(`${title}`, { url: request.loadedUrl });
  s.save({ title: title, body: content, request: request });
});

export const Lentis = s;

