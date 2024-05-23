
import { cleanText, filterNewUrls } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';

const urlTemplate = 'https://www.werkenbijggzbreburg.nl/umbraco/WebCit/VacaturesApi/GetVacatures?1715087522&q=&page={{page}}&vactype=9109&functie={{functie}}&doelgroep=&regio=';

const functies = ["verpleegkundigen", "psychologen", "Psychiater & basisartsen"]

type Response = {
  CurrentPage: number,
  TotalItems: number,
  Items: {
    Title: string
    Url: string
    [key: string]: string
  }[]
}

async function getUrls(){
  const urls = []
  for (const functie of functies) {
    let page = 1
    while (page > 0){
      const url = urlTemplate.replace('{{functie}}', functie).replace('{{page}}', page.toString());
      const response = await fetch(url).then(res => res.json()) as Response;
      if (response.Items.length == 0){
        break
      }
      urls.push(...response.Items.map((detail) => detail.Url));
      page ++
    }
  }
  return filterNewUrls(urls);
}

const s = new CheerioScraper("GGZ Breburg", await getUrls())

s.addDefaultHandler(async ({ request, $, log }) => {
  const title = cleanText($('h1').text());
  $('script, style, noscript, iframe, header, nav').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await s.save({ title: title, body: text, request: request });
});

export const Breburg = s;
