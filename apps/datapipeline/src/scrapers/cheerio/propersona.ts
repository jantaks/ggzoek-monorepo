import { createCheerioRouter } from 'crawlee';
import { localstorage } from '../../services/localstorage.js';
import { cleanText } from '../../utils.js';

const router = createCheerioRouter();

const url ='https://www.werkenbijpropersona.nl/vacature-overzicht/'

router.addDefaultHandler(async ({ enqueueLinks }) => {
    await enqueueLinks({
      globs: ['https://www.werkenbijpropersona.nl/vacature/**'],
      label: 'detail',
    });
    await enqueueLinks({
      baseUrl: url,
      selector: 'a.page-link',
    });
});


router.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form').remove();
  $('#sollicitatie-proces, .gerelateerde_vacatures, .collegas_aan_het_woord, #footer').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await localstorage.saveData('propersona', { title: title, body: text, request: request });
});

export const propersonaRouter = router;
