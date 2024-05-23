import { cleanText, filterNewUrls } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { log as logger } from '@ggzoek/logging/src/logger.js';

type Response = {
  pagedList: {
    items: {
      url: string
    }[]
  }
}

async function getURLs() {
  const baseUrl = 'https://www.werkenbijggzdelfland.nl/';
  const data: Response = await fetch(`https://www.werkenbijggzdelfland.nl/Entity/GetVacancies?aantal=1000&id=1090&isMobile=false&culture=nl-NL&compact=false&related=false`).then(res => res.json());
  const urls = data.pagedList.items.map((detail) => baseUrl + detail.url);
  return filterNewUrls(urls);
}

const s = new CheerioScraper('Delfland', await getURLs());

s.addDefaultHandler(async ({ $, request }) => {
  const title = cleanText($('h1').text());
  $('script, style, noscript, iframe, header, nav, form, footer').remove();
  $('.vacancyintro__buttons').remove();
  let text = $('.block__vacancyintro').text();
  text = cleanText(text);
  logger.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Delfland = s;

