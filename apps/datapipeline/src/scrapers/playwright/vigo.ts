import { acceptCookies, cleanText } from '../../utils.js';
import * as cheerio from 'cheerio';
import { DEFAULT_OPTIONS, PlaywrightScraper } from '../crawlers.js';
import { Page } from 'playwright';

const url = 'https://werkenbijvigogroep.recruitee.com/';
const options = { ...DEFAULT_OPTIONS, maxRequestsPerMinute: 10 };
const s = new PlaywrightScraper('Vincent van Gogh GGZ', [url], options);

s.addDefaultHandler(async ({ page }) => {
  page.setDefaultTimeout(5000);
  await acceptCookies(page);
  const btnLocator = (page: Page) => page.getByText('Toon meer vacatures');
  await s.expand(page, btnLocator, {
    baseUrl: url,
    globs: ['**/o/*'],
    label: 'detail'
  });
});

s.addHandler('detail', async ({ request, page, log }) => {
  const bodyHtml = await page.content();
  const $ = cheerio.load(bodyHtml);
  const title = $('h1').text();
  const targetDiv = $('div[role="dialog"]');
  if (targetDiv.length) {
    targetDiv.remove();
  }
  $("div[data-scroll-point|='section-offer-headline']").remove();
  $('div[data-scroll-point="section-navigation"]').remove();
  $('script, style, noscript, iframe, header, footer, form').remove();
  $('.rnBreadcrumb, .elementSticky, .rowRelated, #CybotCookiebotDialog, .rnCarousel').remove();
  $('strong:contains("Solliciteren")').nextAll().addBack().remove();
  $('a[data-reach-skip-link]').remove();
  $('button').remove();
  const panels = $("div[role='tabpanel']");
  panels.each((i, el) => {
    if (i > 0) $(el).remove();
  });
  let text = $('#offer-section').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  s.save({ title: title, request: request, body: text });
});

export const VIGO = s;
