import { createCheerioRouter } from 'crawlee';
import { storage } from '../../services/storage.js';
import { cleanText } from '../../utils.js';

const router = createCheerioRouter();

const baseUrl = 'https://werkenbijemergis.nl/vacatures';

router.addDefaultHandler(async ({ enqueueLinks }) => {
    await enqueueLinks({
      globs: ['https://werkenbijemergis.nl/vacatures/**'],
      label: 'detail',
      selector: '.teaser__link'
    });
});


router.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form').remove();
  $('.site-navbar, .site-header, .site-footer, .ta-cookies, .block-share-page, .btn').remove()
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await storage.saveData('emergis', { title: title, body: text, request: request });
  storage.saveToDb('Emergis', {title: title, body: text, request: request})
});

export const emergisRouter = router;
