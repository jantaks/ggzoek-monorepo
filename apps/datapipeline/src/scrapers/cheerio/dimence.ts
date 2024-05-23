
import { cleanText} from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';
import { log } from '@ggzoek/logging/src/logger.js';

const s = new CheerioScraper('Dimence', ['https://www.werkenbijdimence.nl/vacatures']);

const baseUrl = 'https://www.werkenbijdimence.nl/vacatures';

s.addDefaultHandler(async ({ enqueueLinks, $ }) => {
    await s.enqueuNewLinks($ as CheerioAPI, {
      baseUrl: "https://www.werkenbijdimence.nl/",
      globs: ['**/vacatures/**'],
      label: 'detail',
    })
    await enqueueLinks({
      baseUrl: baseUrl,
      selector: '.pagination a',
    });
});


s.addHandler('detail', async ({ request, $}) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  s.save({ title: title, body: text, request: request });
});

export const Dimence = s
