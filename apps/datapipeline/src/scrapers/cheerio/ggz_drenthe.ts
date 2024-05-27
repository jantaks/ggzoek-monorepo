
import { cleanText} from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';
import { log } from '@ggzoek/logging/src/logger.js';

const s = new CheerioScraper('GGZ Drenthe', ['https://ggzdrenthe.nl/werken-bij/vacatures']);

const baseUrl = 'https://ggzdrenthe.nl/';

s.addDefaultHandler(async ({ $ }) => {
    await s.enqueuNewLinks($ as CheerioAPI, {
      baseUrl: baseUrl,
      globs: ['**/vacatures/**'],
      label: 'detail',
    })
});


s.addHandler('detail', async ({ request, $}) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav').remove();
  $('.slick-cards, #navbar, .footer, .breadcrumbs').remove();
  $('#navbar').remove()
  $('.breadcrumbs, .vacancy-job-apply, .social-share').remove();
  let text = $('.layout').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  s.save({ title: title, body: text, request: request });
});

export const Drenthe = s
