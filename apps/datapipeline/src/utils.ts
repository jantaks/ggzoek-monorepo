import crypto from 'crypto';
import 'dotenv/config';
import { Page } from 'playwright';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import { minimatch } from 'minimatch';
import { log } from '@ggzoek/logging/src/logger.js';
import vacatures from '../../../packages/ggz-drizzle/src/vacatures.js';
import { sleep } from 'crawlee';

export async function getCheerioFromPage(page: Page) {
  const bodyHtml = await page.content();
  return cheerio.load(bodyHtml);
}

export function cleanText(text: string) {
  let cleanedText = text.replace(/\t/g, ''); // Remove all tabs
  cleanedText = cleanedText.replace(/\n\s*\n/g, '\n'); // Replace \n followed by any number of whitespaces and another \n with a single \n// Remove all double or more newlines
  cleanedText = cleanedText.replace(/  +/g, ' '); // Replace double or more spaces with a single space// Replace double or more newlines with a single newline
  return cleanedText;
}

export function cleanTitle(text: string) {
  let cleanedText = text.replace(/\t/g, ''); // Remove all tabs
  cleanedText = cleanedText.trim();
  cleanedText = cleanedText.replace(/\n/g, ''); // Replace \n followed by any number of whitespaces and another \n with a single \n// Remove all double or more newlines
  cleanedText = cleanedText.replace(/\r/g, ''); // Replace \n followed by any number of whitespaces and another \n with a single \n// Remove all double or more newlines
  cleanedText = cleanedText.replace(/  +/g, ' '); // Replace double or more spaces with a single space// Replace double or more newlines with a single newline
  return cleanedText;
}

export function formatDate(date: Date | string | number | null) {
  if (!date) return undefined;

  function isDate(date: Date | string | number): date is Date {
    return date instanceof Date;
  }

  if (!isDate(date)) {
    date = new Date(date);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  if (isNaN(year)) {
    return undefined;
  }

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
  const cookieButtonLabels = [
    'Alles toestaan',
    'Cookies toestaan',
    'Alle cookies toestaan',
    'Accepteren',
    'Ik ga akkoord'
  ];
  let cookieButtonFound = false;
  for (const label of cookieButtonLabels) {
    try {
      const matches = page.getByText(label);
      for (const match of await matches.all()) {
        await match.click({ timeout: 1000 });
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

export function removeParent(
  elementWithText: cheerio.Cheerio<cheerio.Element>,
  parentSelector: string = 'div'
) {
  const parentDiv = elementWithText.closest(parentSelector);
  if (parentDiv.length) {
    parentDiv.remove();
  }
}

export type LinksOptions = Readonly<{
  urls?: string[];
  baseUrl?: string;
  globs?: string[];
  selector?: string;
  label?: string;
}>;

export function combineUrl(urlFragment: string, baseUrl: string) {
  if (urlFragment.startsWith(baseUrl!)) {
    return urlFragment;
  }
  if (baseUrl.endsWith(urlFragment)) {
    return baseUrl;
  }
  if (baseUrl?.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
  if (urlFragment.startsWith('/')) urlFragment = urlFragment.slice(1);
  return baseUrl + '/' + urlFragment;
}

export function getTimePeriod() {
  let period: number | undefined = parseFloat(process.env.TIMEPERIOD as string) || undefined;
  if (!period) {
    log.debug('No TIMEPERIOD set, defaulting to 48 hours');
    period = 48;
  }
  return period;
}

export function selectLinks($: CheerioAPI, options: LinksOptions) {
  let urls = [];

  if (options.selector) {
    if (!options.selector.startsWith('.')) {
      const selectedUrls = $(options.selector)
        .map((_, el) => $(el).attr('href'))
        .get();
      urls.push(...selectedUrls);
    } else {
      const selectedUrls = $(`a${options.selector}`)
        .map((_, el) => $(el).attr('href'))
        .get();
      urls.push(...selectedUrls);
    }
  } else {
    const allUrls = $('a')
      .map((_, el) => $(el).attr('href'))
      .get();
    urls.push(...allUrls);
  }

  if (options.globs) {
    urls = urls.filter(
      (url) => options.globs && options.globs.some((glob) => minimatch(url, glob))
    );
  }

  if (options.baseUrl) {
    const baseUrl = options.baseUrl;
    urls = urls.map((url) => {
      return combineUrl(url, baseUrl);
    });
  }

  urls = Array.from(new Set(urls));
  if (urls.length === 0) {
    log.warn(`No urls found ${JSON.stringify(options)}`);
  }
  return urls;
}

//Removes urls that have been scraoer in the (optionally) provided timeperiod.
export async function filterNewUrls(urls: string[]) {
  const period = getTimePeriod();
  const skipUrls = await vacatures.getAllUrlsScrapedWithinHours(period);
  const filteredUrls = urls.filter((url) => !skipUrls.includes(url));
  log.info(
    `Found ${urls.length} urls. Selected ${filteredUrls.length} urls that have not been scraped in the last ${period} hours`
  );
  log.debug(`Selected urls: ${JSON.stringify(filteredUrls)}`);
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

export function equalArrays(array1: any[], array2: any[]) {
  if (!array1 || !array2) return false;
  return array1.length === array2.length && array1.every((value) => array2.includes(value));
}
