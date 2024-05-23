import { cleanText, selectNewLinks } from '../../utils.js';
import { CheerioAPI } from 'cheerio';
import { CheerioScraper } from '../crawlers.js';

function buildUrl() {
    const baseUrl = 'https://www.werkenbijaltrecht.nl/vacatures/?function=';
    const professions = ['anios', 'psychiater', 'gz-psycholoog', 'neuropsycholoog', 'orthopedagoog', 'klinisch-psycholoog', 'psycholoog', 'psychotherapeut'];
    return baseUrl + encodeURIComponent(professions.join(','));
}

const s = new CheerioScraper('Altrecht', [buildUrl()])

s.addDefaultHandler(async ({enqueueLinks, $}) => {
    const urls = await selectNewLinks($ as CheerioAPI,
      { selector: '.vacancy-card',
          globs: ['https://www.werkenbijaltrecht.nl/vacatures/**']
      })
    await enqueueLinks({
        urls: urls,
        label: 'detail'
    });
});

s.addHandler('detail', async ({request, $, log}) => {
    const title = $('h1').text();
    $('script, style, noscript, iframe, header, nav').remove();
    let text = $('body').text();
    text = cleanText(text)
    log.info(`${title}`, {url: request.loadedUrl});
    await s.save({title: title, body: text, request: request})
});

export const Altrecht = s