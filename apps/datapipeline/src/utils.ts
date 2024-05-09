import crypto from 'crypto';
import winston from 'winston';
import 'dotenv/config';
import { Page } from 'playwright';
import * as cheerio from 'cheerio';

export function cleanText(text: string) {
    let cleanedText = text.replace(/\t/g, ''); // Remove all tabs
    cleanedText = cleanedText.replace(/\n\s*\n/g, '\n'); // Replace \n followed by any number of whitespaces and another \n with a single \n// Remove all double or more newlines
    cleanedText = cleanedText.replace(/  +/g, ' ');// Replace double or more spaces with a single space// Replace double or more newlines with a single newline
    return cleanedText
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
    for(let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * copyItems.length);
        result.push(copyItems[randomIndex]);
        copyItems.splice(randomIndex, 1); // Remove the selected item from the copy array
    }
    return result;
}

export const log = winston.createLogger({
    level: process.env.LOG_LEVEL,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf((info) => {
            const { timestamp, level, message, ...args } = info;
            const ts = timestamp.slice(0, 19).replace('T', ' ');
            const prettyArgs = JSON.stringify(args, null, 2);
            return `${ts} [${level}]: ${message} ${prettyArgs}`;
        })
    ),
    transports: [new winston.transports.Console()]
});

export async function acceptCookies(page: Page) {
    const cookieButtonLabels = ['Alles toestaan', 'Cookies toestaan', 'Alle cookies toestaan', 'Accepteren', 'Ik ga akkoord'];
    for (const label of cookieButtonLabels) {
        try {
            await page.click(`text=${label}`, {timeout: 500});
            console.log(`Clicked cookie button with label "${label}"`);
            break;
        } catch (error) {
            console.log(`No cookie button found with label "${label}"`);
        }
    }
}

export function removeParent(elementWithText: cheerio.Cheerio<cheerio.Element>, parentSelector: string = 'div') {
    var parentDiv = elementWithText.closest(parentSelector);
    if (parentDiv.length) {
        parentDiv.remove();
    }
}