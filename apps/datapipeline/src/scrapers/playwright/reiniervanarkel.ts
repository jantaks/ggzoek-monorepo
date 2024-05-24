import {createPlaywrightRouter} from 'crawlee';
import {storage} from "../../services/storage.js";
import { acceptCookies, cleanText } from '../../utils.js';
import * as cheerio from "cheerio";
import { PlaywrightScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';

const s = new PlaywrightScraper('Reinier van Arkel', ['https://www.reinierwerktenleert.nl/vacatures/']);


s.addDefaultHandler(async ({enqueueLinks, parseWithCheerio}) => {
   const $ = await parseWithCheerio()
    await s.enqueuNewLinks($ as CheerioAPI, {
        globs: ['**/vacature/**'],
        label: 'detail',
        selector: '.card-link'
    })
    await enqueueLinks({
        selector: '.page-numbers',

    })
});


s.addHandler('detail', async ({request, page, log}) => {
    const bodyHtml = await page.content()
    const $ = cheerio.load( bodyHtml);
    const title = $('h1').text();
    $('script, style, noscript, iframe, header').remove();
    let text = $('body').text();
    text = cleanText(text)
    text = text.split('Meer weten en solliciteren')[0]
    log.info(`${title}`, {url: request.loadedUrl});
    await storage.saveData("RVA", {title: title, request: request, body: text})
    storage.saveToDb('Reinier van Arkel Groep', {title: title, body: text, request: request})
});

export const RVA = s