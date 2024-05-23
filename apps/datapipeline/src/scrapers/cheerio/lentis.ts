import { cleanText, filterNewUrls } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { log } from '@ggzoek/logging/src/logger.js';

type SuccessResponse = {
  id: number,
  link: string,
}[]

type ErrorResponse = {
  code: string,
  message: string,
  data: {
    status: number,
  }
}

type Response = SuccessResponse| ErrorResponse

function isSuccessful(response: Response): response is SuccessResponse {
  return 'link' in response;
}

async function getUrls() {
  const apiJson = 'https://www.werkenbijlentis.nl/wp-json/wp/v2/vacancies?page=';
  let page = 1;
  let more = true;
  let resultUrls = [];
  while (more) {
    const response = await fetch(apiJson + page).then(res => res.json()) as Response;
    if (isSuccessful(response)) {
      const urls = response.map((detail) => detail.link);
      if (urls.length == 0) {
        console.log('no more pages, last page: ' + page);
        more = false;
      } else {
        page++;
        resultUrls.push(...urls);
      }
    }
    else {
      log.error(response, 'error response');
      more = false;
    }

  }
  return filterNewUrls(resultUrls);
}


const s = new CheerioScraper('Lentis', await getUrls());

s.addDefaultHandler( async ({ request, $, log }) => {
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
