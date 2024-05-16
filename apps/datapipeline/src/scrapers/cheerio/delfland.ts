import { CheerioCrawler, createCheerioRouter, sleep } from 'crawlee';
import { storage } from '../../services/storage.js';
import { cleanText } from '../../utils.js';
import { defaultConfig, defaultOptions } from '../crawlers.js';



type Response = {
 pagedList: {
    items: {
      url: string
    }[]
 }
}

async function getURLs(){
  const baseUrl = 'https://www.werkenbijggzdelfland.nl/'
  const data: Response = await fetch(`https://www.werkenbijggzdelfland.nl/Entity/GetVacancies?aantal=1000&id=1090&isMobile=false&culture=nl-NL&compact=false&related=false`).then(res => res.json())
  return data.pagedList.items.map((detail) => baseUrl + detail.url)
}

const router = createCheerioRouter();
const NAME = 'delfland'
const options = defaultOptions()
const config = defaultConfig(NAME)
const crawler = new CheerioCrawler({ ...options, requestHandler: router }, config)

export async function crawlDelfland() {
  crawler.run(await getURLs())
}

router.addDefaultHandler(async ({ $, request, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form, footer').remove();
  $('.vacancyintro__buttons').remove();
  let text = $('.block__vacancyintro').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await storage.saveData(NAME, { title: title, body: text, request: request });
  storage.saveToDb('GGZ Delfland', {title: title, body: text, request: request})
});

