import { createCheerioRouter } from 'crawlee';
import { localstorage } from '../../services/localstorage.js';
import { cleanText } from '../../utils.js';
import { start } from 'node:repl';

const router = createCheerioRouter();

const baseUrl = 'https://ggzoostbrabant.recruitee.com/';

router.addDefaultHandler(async ({ enqueueLinks }) => {
    await enqueueLinks({
      globs: ['https://ggzoostbrabant.recruitee.com/o/**'],
      label: 'detail',
    });
});


router.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await localstorage.saveData('ggz-oost-brabant', { title: title, body: text, request: request });
});

export const oostBrabantRouter = router;
