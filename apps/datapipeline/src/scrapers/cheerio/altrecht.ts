import { CheerioCrawler, createCheerioRouter } from 'crawlee';
import { storage } from '../../services/storage.js';
import { cleanText, logger, selectLinks, selectNewLinks } from '../../utils.js';
import { defaultConfig, defaultOptions } from '../../scrape.js';
import { CheerioAPI } from 'cheerio';


const NAME = 'Altrecht'
const router = createCheerioRouter();
const urlList = [buildUrl()]
const options = defaultOptions(NAME)
const config = defaultConfig(NAME)
const crawler = new CheerioCrawler({ ...options, requestHandler: router }, config);
const log = logger(NAME)

export function crawlAltrecht() {
    return crawler.run(urlList)
}

function buildUrl() {
    const baseUrl = 'https://www.werkenbijaltrecht.nl/vacatures/?function=';
    const professions = ['anios', 'psychiater', 'gz-psycholoog', 'neuropsycholoog', 'orthopedagoog', 'klinisch-psycholoog', 'psycholoog', 'psychotherapeut'];
    return baseUrl + encodeURIComponent(professions.join(','));
}



router.addDefaultHandler(async ({enqueueLinks, $}) => {
    const urls = await selectNewLinks($ as CheerioAPI,
      { selector: '.vacancy-card',
          globs: ['https://www.werkenbijaltrecht.nl/vacatures/**']
      })
    await enqueueLinks({
        urls: urls,
        label: 'detail'
    });
});

router.addHandler('detail', async ({request, $, log}) => {
    const title = $('h1').text();
    $('script, style, noscript, iframe, header, nav').remove();
    let text = $('body').text();
    text = cleanText(text)
    log.info(`${title}`, {url: request.loadedUrl});
    await storage.saveData("ALTRECHT", {title: title, body: text, request: request})
    storage.saveToDb('Altrecht', {title: title, body: text, request: request})
});
