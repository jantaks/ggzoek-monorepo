import { createCheerioRouter } from 'crawlee';
import { storage } from '../../services/storage.js';
import { cleanText } from '../../utils.js';
import { start } from 'node:repl';

const router = createCheerioRouter();

const apiJson = 'https://www.werkenbijlentis.nl/wp-json/wp/v2/vacancies?page=';

type Response = {
  id: number,
  link: string,
}

router.addDefaultHandler(async ({ enqueueLinks }) => {
  let page = 1;
  let more = true;
  while (more == true) {
    const response = await fetch(apiJson + page).then(res => res.json()) as Response[];
    const urls = response.map((detail) => detail.link);
    if (urls.length == 0) {
      console.log('no more pages, last page: ' + page)
      more = false
    }
    else {
      page++;
      enqueueLinks({ urls: urls, label: 'detail' });
    }
  }

});

router.addHandler('detail', async ({ request, $, log }) => {
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
  await storage.saveData('lentis', { title: title, body: content, request: request });
  storage.saveToDb('Lentis', {title: title, body: content, request: request})
});

export const lentisRouter = router;
