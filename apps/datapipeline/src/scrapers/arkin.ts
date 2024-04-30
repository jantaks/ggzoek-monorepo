import {createPlaywrightRouter, sleep} from 'crawlee';
import * as cheerio from 'cheerio';
import {localstorage} from "../services/localstorage.js";
import {cleanText} from "../utils.js";

const router = createPlaywrightRouter();

router.addDefaultHandler(async ({page, enqueueLinks}) => {
    await page.getByText(/Psychologen/i).click();
    await page.getByText(/Psychiaters en artsen/i).click();
    await sleep(1000)
    await enqueueLinks({
        globs: ['https://werkenbijarkin.nl/vacatures/**'],
        label: 'detail',
    });
});

router.addHandler('detail', async ({request, page, log}) => {
    const bodyHtml = await page.content()
    const $ = cheerio.load(bodyHtml);
    const title = $('h1').text();
    $('script, style, noscript, iframe, header, nav').remove();
    $('.headerwrapper').remove();
    $('.recruiter-info').remove();
    let text = $('body').text();
    text = cleanText(text)
    text = text.split('Meer weten over deze vacature?')[0]
    log.info(`${title}`, {url: request.loadedUrl});
    await localstorage.saveData("ARKIN", {title: title, request: request, body: text})
});

export const arkinRouter = router;