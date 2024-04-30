import {createCheerioRouter} from 'crawlee';
import {localstorage} from "../services/localstorage.js";
import {cleanText} from "../utils.js";

const router = createCheerioRouter();

router.addDefaultHandler(async ({crawler}) => {
    const baseUrl = 'https://www.werkenbijaltrecht.nl/vacatures/?function=';
    const professions = ['anios', 'psychiater', 'gz-psycholoog', 'neuropsycholoog', 'orthopedagoog', 'klinisch-psycholoog', 'psycholoog', 'psychotherapeut'];
    let url = baseUrl + encodeURIComponent(professions.join(','));
    await crawler.requestQueue?.addRequest({url: url, label: 'start'})
});


router.addHandler('start', async ({enqueueLinks}) => {
    await enqueueLinks({
        globs: ['https://www.werkenbijaltrecht.nl/vacatures/**'],
        label: 'detail',
        selector: '.vacancy-card'
    });
});


router.addHandler('detail', async ({request, $, log}) => {
    const title = $('h1').text();
    $('script, style, noscript, iframe, header, nav').remove();
    let text = $('body').text() +"REMOVE";
    text = cleanText(text)
    log.info(`${title}`, {url: request.loadedUrl});
    await localstorage.saveData("ALTRECHT", {title: title, body: text, request: request})
});

export const altrechtRouter = router;