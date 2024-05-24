import { sleep} from 'crawlee';
import * as cheerio from 'cheerio';
import {cleanText} from "../../utils.js";
import { PlaywrightScraper } from '../crawlers.js';
import { CheerioAPI } from 'cheerio';

const s = new PlaywrightScraper('Arkin', ['https://werkenbijarkin.nl/vacatures/']);

s.addDefaultHandler(async ({page, parseWithCheerio}) => {
    await page.waitForLoadState('networkidle')
    const $ = await parseWithCheerio();
    await s.enqueuNewLinks($ as CheerioAPI, {
        globs: ['**/vacatures/**'],
        label: 'detail',
        selector: '.standard.vacature-hover'
    });
});

s.addHandler('detail', async ({request, page, log}) => {
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
    s.save({title: title, request: request, body: text})
});

export const ARKIN = s;