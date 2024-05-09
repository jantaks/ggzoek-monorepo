import {createPlaywrightRouter, sleep} from 'crawlee';
import {localstorage} from "../../services/localstorage.js";
import * as cheerio from "cheerio";
import { acceptCookies, cleanText, createHash } from '../../utils.js';

const router = createPlaywrightRouter();


router.addDefaultHandler(async ({enqueueLinks, page, log}) => {
    acceptCookies(page)
    log.info(`enqueueing new URLs`);
    await page.getByText('Functiecategorie').click();
    await page.getByRole('option', {name: 'Artsen & Medisch Specialisten'}).click();
    await page.getByRole('option', {name: 'Psychologen & Therapeuten'}).click()
    await page.waitForLoadState('networkidle');
    let button = page.locator(".css_button.ui_jobs_more");
    let i = 0;
    while (await button.isVisible() && i < 500) {
        try {
            await button.click({timeout: 1000});
            i++;
            await sleep(500);
            log.info(`Clicking more jobs button (${i}).`);
            await page.waitForLoadState('networkidle');
            button = await page.locator(".css_button.ui_jobs_more");
        } catch (error) {
            log.error(`Failed to click the button: loaded all jobs.`);
            break;
        }
    }
    await enqueueLinks({
        globs: ['https://werkenbijparnassiagroep.nl/ad/**'],
        label: 'detail'
    });
});

router.addHandler('detail', async ({page, log, request}) => {
    const title = await page.title();
    const bodyHtml = await page.content()
    const $: cheerio.CheerioAPI = cheerio.load(bodyHtml);
    $('script, style').remove();
    let text = $('main').text();
    text = cleanText(text);
    log.info(`${title}`, {url: request.loadedUrl});
    await localstorage.saveData("PARNASSIA", {
        title: title,
        body: text,
        request: request
    })
});


export const parnassiaRouter = router;