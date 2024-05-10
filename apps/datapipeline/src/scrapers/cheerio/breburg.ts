import { createCheerioRouter } from 'crawlee';
import { localstorage } from '../../services/localstorage.js';
import { cleanText } from '../../utils.js';

const router = createCheerioRouter();

// const baseUrl = 'https://www.ggz-nhn.nl';

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

router.addDefaultHandler(async ({ enqueueLinks }) => {
  for (const functie of functies) {
    let page = 1
    while (page > 0){
      const url = urlTemplate.replace('{{functie}}', functie).replace('{{page}}', page.toString());
      const response = await fetch(url).then(res => res.json()) as Response;
      console.log(response)
      if (response.Items.length == 0){
        break
      }
      const urls = response.Items.map((detail) => detail.Url);
      enqueueLinks({ urls: urls, label: 'detail' });
      page ++
    }
  }
});


router.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await localstorage.saveData('breburg', { title: title, body: text, request: request });
});

export const breburgRouter = router;
