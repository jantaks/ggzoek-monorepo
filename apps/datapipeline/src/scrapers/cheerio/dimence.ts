import { createCheerioRouter } from 'crawlee';
import { storage } from '../../services/storage.js';
import { cleanText } from '../../utils.js';
import { start } from 'node:repl';

const router = createCheerioRouter();

const baseUrl = 'https://www.werkenbijdimence.nl/vacatures';

router.addDefaultHandler(async ({ enqueueLinks }) => {
    await enqueueLinks({
      globs: ['https://www.werkenbijdimence.nl/vacatures/**'],
      label: 'detail',
    });
    await enqueueLinks({
      baseUrl: baseUrl,
      selector: '.pagination a',
    });
});


router.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await storage.saveData('dimence', { title: title, body: text, request: request });
  storage.saveToDb('Dimence', {title: title, body: text, request: request})
});

export const dimenceRouter = router;
