import { cleanText, getCheerioFromPage, selectNewLinks } from '../../utils.js';
import { PlaywrightScraper } from '../crawlers.js';


const urls = [
  'https://werkenbij.ggzwnb.nl/'
]

const s = new PlaywrightScraper("GGZ WNB", urls)
export const GGZWNB = s

s.router.addDefaultHandler(async ({ enqueueLinks, page, request, log }) => {
  await page.waitForLoadState('networkidle')
  log.info('page loaded: ' + request.loadedUrl)
  const $ = await getCheerioFromPage(page)
  const urls = await selectNewLinks($, {
    baseUrl: 'https://werkenbij.ggzwnb.nl/',
    selector: '.vtlink'
  })
  await enqueueLinks({
    urls: urls,
    label: 'detail',
  });
});

s.router.addHandler('detail', async ({ request, page, log }) => {
  const $ = await getCheerioFromPage(page)
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form').remove();
  $('.weblogin').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

