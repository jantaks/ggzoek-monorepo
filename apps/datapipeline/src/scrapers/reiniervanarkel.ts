import {createPlaywrightRouter} from 'crawlee';
import {localstorage} from "../services/localstorage.js";
import { acceptCookies, cleanText } from '../utils.js';
import * as cheerio from "cheerio";
export const router = createPlaywrightRouter();


router.addDefaultHandler(async ({enqueueLinks, log, page}) => {
    page.setDefaultTimeout(5000)
    const jobs = ["gz-psycholoog ", "psychiater ", "anios ", "klinisch psycholoog ", "orthopedagoog ", "verpleegkundig specialist " ]
    for (const job of jobs) {
        try {
            await page.goto('https://www.reinierwerktenleert.nl/vacatures/');
            acceptCookies(page)
            log.info(`Getting jobs for ${job}`);
            await page.getByRole('button', {name: 'Functie'}).click();
            await page.getByRole("listitem").getByText(new RegExp(job, 'i')).click()
            await page.getByText(/pas filter toe/i).click();
            while (true){
                await enqueueLinks({
                    globs: ['https://www.reinierwerktenleert.nl/vacature/**'],
                    label: 'detail',
                });
                if (!await page.getByText(/volgende/i).isVisible()) {
                    break;
                }
                await page.getByText(/volgende/i).click();
            }
            await page.getByText(/reset filters/i).click();
        }
        catch (error) {
            log.error(`Error getting jobs for ${job}: ${error}`);
        }

    }
});


router.addHandler('detail', async ({request, page, log}) => {
    const bodyHtml = await page.content()
    const $ = cheerio.load( bodyHtml);
    const title = $('h1').text();
    $('script, style, noscript, iframe, header').remove();
    let text = $('body').text();
    text = cleanText(text)
    text = text.split('Meer weten en solliciteren')[0]
    log.info(`${title}`, {url: request.loadedUrl});
    await localstorage.saveData("RVA", {title: title, request: request, body: text})
});

export const rvaRouter = router