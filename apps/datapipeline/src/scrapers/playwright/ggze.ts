import { cleanText, getCheerioFromPage, selectNewLinks } from '../../utils.js';
import { PlaywrightScraper } from '../crawlers.js';


const urls = [
  'https://www.werkenbijggze.nl/portal-werkenbij/psychologen',
  'https://www.werkenbijggze.nl/portal-werkenbij/psychiaters-en-artsen',
  'https://www.werkenbijggze.nl/portal-werkenbij/verpleegkundigen-en-agogische-functies'
]

const s = new PlaywrightScraper("GGzE", urls)
export const GGZE = s

s.router.addDefaultHandler(async ({ enqueueLinks, page, request, log }) => {
  await page.waitForLoadState('networkidle')
  log.info('page loaded: ' + request.loadedUrl)
  const $ = await getCheerioFromPage(page)
  const urls = await selectNewLinks($, {
    baseUrl: 'https://www.werkenbijggze.nl',
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

