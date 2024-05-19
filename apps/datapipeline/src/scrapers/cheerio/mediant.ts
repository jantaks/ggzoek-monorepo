import { cleanText, selectNewLinks } from '../../utils.js';
import { CheerioAPI } from 'cheerio';
import { CheerioScraper } from '../crawlers.js';

function buildUrl() {
    const baseUrl = 'https://www.werkenbijaltrecht.nl/vacatures/?function=';
    const professions = ['anios', 'psychiater', 'gz-psycholoog', 'neuropsycholoog', 'orthopedagoog', 'klinisch-psycholoog', 'psycholoog', 'psychotherapeut'];
    return baseUrl + encodeURIComponent(professions.join(','));
}

const s = new CheerioScraper('Mediant', ['https://werkenbijmediant.nl/vacatures'])

s.router.addDefaultHandler(async ({enqueueLinks, $}) => {
    const urls = await selectNewLinks($ as CheerioAPI,
      {
          baseUrl: 'https://werkenbijmediant.nl',
          selector: '.vacancy-index-item-title'
      })
    await enqueueLinks({
        urls: urls,
        label: 'detail'
    });
});

s.router.addHandler('detail', async ({request, $, log}) => {
    const title = $('h1').text();
    $('script, style, noscript, iframe, header, nav').remove();
    $('.vacancy-detail-sidebar, .vacancy-details.cta, .modal').remove();
    let text = $('.container_vacancy-detail').text();
    text = cleanText(text)
    log.info(`${title}`, {url: request.loadedUrl});
    await s.save({title: title, body: text, request: request})
});

export const Mediant = s