import {createCheerioRouter} from 'crawlee';
import {localstorage} from "../services/localstorage.js";
import {cleanText} from "../utils.js";

const router = createCheerioRouter();

router.addDefaultHandler(async ({enqueueLinks, log}) => {
    log.info('enqueueing new URLs')
    await enqueueLinks({
        globs: ['https://www.werkenbijggzfriesland.nl/vacatures/**'],
        label: 'detail',
    });
});

router.addHandler('detail', async ({request, $, log}) => {
    const title = $('.underH1').text();
    $('script, style, noscript, iframe, header, nav').remove();
    let text = $('#vacancyPage').text();
    text = cleanText(text)
    log.info(`${title}`, {url: request.loadedUrl});
    await localstorage.saveData("GGZ_FRIESLAND", {title: title, body: text, request: request})
});

export const GGZFrieslandrouter = router;