import { cleanText, filterNewUrls } from '../../utils.js';
import { CheerioScraper } from '../crawlers.js';


const s = new CheerioScraper('Ingeest', await getURLs());

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
  return await filterNewUrls(urls)
}

s.addDefaultHandler(async ({ $, request, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav, form, footer').remove();
  $('.apply-box').remove();
  let text = $('.entry__content').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  s.save({ title: title, body: text, request: request });
});

export const Ingeest = s;