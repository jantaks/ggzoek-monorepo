import { CheerioCrawler, createCheerioRouter, PlaywrightCrawler } from 'crawlee';
import { defaultConfig, defaultOptions } from '../../scrape.js';
import { cleanText } from '../../utils.js';
import { storage } from '../../services/storage.js';


const url = 'https://www.werkenbijmondriaan.nl/vacatures'

const router = createCheerioRouter();
const NAME = 'ingeest';
const options = defaultOptions(NAME)
const config = defaultConfig(NAME)
const crawler = new CheerioCrawler({ ...options, requestHandler: router }, config)

export async function crawlIngeest() {
  const urls = await getURLs()
  crawler.run(urls)
}

type Response = {
  id: number,
  link: string
}

async function getURLs(){
  let more = true;
  let offset = 0;
  let urls: string[]  = []
  while (more){
    const data: Response[] = await fetch(`https://werkenbij.ggzingeest.nl/wp-json/wp/v2/jobs?per_page=100&offset=${offset}`).then(res => res.json())
    if (data.length == 0){
      more = false;
    }
    else{
      urls = urls.concat(data.map((detail) => detail.link));
      offset += 100;
    }
  }
  return urls
}

router.addDefaultHandler(async ({ $, request, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form, footer').remove();
  $('.apply-box').remove();
  let text = $('.entry__content').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await storage.saveData(NAME, { title: title, body: text, request: request });
  storage.saveToDb('GGZ Ingeest', {title: title, body: text, request: request})
});
