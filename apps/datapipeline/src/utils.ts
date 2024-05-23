import crypto from 'crypto';
import 'dotenv/config';
import { Page } from 'playwright';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import { minimatch } from 'minimatch';
import { log } from '@ggzoek/logging/src/logger.js';
import repo from '../../../packages/ggz-drizzle/src/repo.js';
import { sleep } from 'crawlee';


export async function getCheerioFromPage(page: Page) {
  const bodyHtml = await page.content();
  return cheerio.load(bodyHtml);
}


export function cleanText(text: string) {
  let cleanedText = text.replace(/\t/g, ''); // Remove all tabs
  cleanedText = cleanedText.replace(/\n\s*\n/g, '\n'); // Replace \n followed by any number of whitespaces and another \n with a single \n// Remove all double or more newlines
  cleanedText = cleanedText.replace(/  +/g, ' ');// Replace double or more spaces with a single space// Replace double or more newlines with a single newline
  return cleanedText;
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export function createHash(body: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(body);
  return hash.digest('hex');
}

export function randomItems<T>(items: T[], count: number) {
  const result = [];
  const copyItems = [...items]; // Create a copy of the original array
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * copyItems.length);
    result.push(copyItems[randomIndex]);
    copyItems.splice(randomIndex, 1); // Remove the selected item from the copy array
  }
  return result;
}


export async function acceptCookies(page: Page) {
  const cookieButtonLabels = ['Alles toestaan', 'Cookies toestaan', 'Alle cookies toestaan', 'Accepteren', 'Ik ga akkoord'];
  let cookieButtonFound = false;
  for (const label of cookieButtonLabels) {
    try {
      const matches =  page.getByText(label);
      for (const match of await matches.all()) {
        await match.click({timeout: 1000});
        log.info(`Clicked cookie button with label "${label}"`);
        cookieButtonFound = true;
        await sleep(1000);
      }
      // break; Maybe we should not break here, but try all buttons
    } catch (error) {
      // Do nothing
    }
  }
  if (!cookieButtonFound) {
    log.warn(`No cookie buttons found on ${page.url()}`);
  }
}

export function removeParent(elementWithText: cheerio.Cheerio<cheerio.Element>, parentSelector: string = 'div') {
  const parentDiv = elementWithText.closest(parentSelector);
  if (parentDiv.length) {
    parentDiv.remove();
  }
}

export type LinksOptions = {
  baseUrl?: string
  globs?: string[]
  selector?: string
  label?: string
}

export function selectLinks($: CheerioAPI, options: LinksOptions) {
  let urls = [];

  if (options.selector) {
    const selectedUrls = $(`a${options.selector}`).map((_, el) => $(el).attr('href')).get();
    urls.push(...selectedUrls);
  } else {
    const allUrls = $('a').map((_, el) => $(el).attr('href')).get();
    urls.push(...allUrls);
  }

  if (options.globs) {
    urls = urls.filter(url => options.globs && options.globs.some((glob) => minimatch(url, glob)));
  }

  if (options.baseUrl) {
    urls = urls.map(url => {
      if (url.startsWith(options.baseUrl!)){
        return url
      }
      if (options.baseUrl?.endsWith('/')) options.baseUrl = options.baseUrl.slice(0, -1);
      if (url.startsWith('/')) url = url.slice(1);
      return options.baseUrl + '/' + url;
    });
  }

  urls = Array.from(new Set(urls));
  if (urls.length === 0) {
    log.warn(options, 'No urls found');
  }
  return urls;
}

//Removes urls that have been scraoer in the (optionally) provided timeperiod. Default is 48 hours.
export async function filterNewUrls(urls: string[], timeperiod=48) {
  const skipUrls = await repo.getAllUrlsScrapedWithinHours(timeperiod);
  const filteredUrls = urls.filter(url => !skipUrls.includes(url));
  log.info(`Found ${urls.length} urls. Selected ${filteredUrls.length} urls that have not been scraped in the last 48 hours`);
  log.debug(filteredUrls, 'Selected urls:');
  return filteredUrls;
}

/**
 * Selects only new links that have not been scraped in the last 48 hours
 * @param $
 * @param options
 */
export async function selectNewLinks($: CheerioAPI, options: LinksOptions) {
  const urls = selectLinks($, options);
  return await filterNewUrls(urls);
}


