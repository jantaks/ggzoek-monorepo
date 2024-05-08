import { createCheerioRouter } from 'crawlee';
import { localstorage } from '../services/localstorage.js';
import { cleanText } from '../utils.js';
import { start } from 'node:repl';

const router = createCheerioRouter();

const baseUrl = 'https://www.ggz-nhn.nl';

const selectUrl = 'https://www.ggz-nhn.nl/vacatures_get_json?type=function&fvalue=';

const functies = {
  'Agoog': '34547',
  'Arts': '58593',
  'Ervaringsdeskundige': '34555',
  'Flexwerk': '63733',
  'Management': '34559',
  'Ondersteunende diensten': '55985',
  'Opleidingen': '58601',
  'Psychiater': '34543',
  'Psycholoog': '34545',
  'Sociaal psychiatrisch verpleegkundige': '58595',
  'Stage': '68329',
  'Systeemtherapeut': '97729',
  'Verpleegkundig specialist': '58597',
  'Verpleegkundige': '34549',
  'Vrijwilliger': '72137'
} as Record<string, string>

type Response = {
  details: {
    nr: string // "/website/werkenbij/Beheer/Vacatures/Psychiater-GGZ-team-Alkmaar-Centrum.html"
    titel: string // "Psychiater - GGZ team Alkmaar Centrum "
    locatie: string //"Alkmaar e.o.
    sluitdatum: string //"16-6-2024"
    appetizer: string //"Ben jij op zoek naar een nieuwe uitdagende positie als psychiater? Ons GGZ-team in Alkmaar ...
    uren: string //"Vast contract, onbepaalde tijd"
    org_onderdeel: string
    var: string //"Psychiater"
  }[]

}

router.addDefaultHandler(async ({ enqueueLinks }) => {
  for (const functie of ['Psychiater', 'Psycholoog', 'Verpleegkundige', 'Verpleegkundig specialist']) {
    const url = selectUrl + functies[functie];
    const response = await fetch(url).then(res => res.json()) as Response;
    const urls = response.details.map(detail => baseUrl + detail.nr);
    await enqueueLinks({ urls: urls, label: 'detail' });
  }
});


router.addHandler('detail', async ({ request, $, log }) => {
  const title = $('h1').text();
  $('script, style, noscript, iframe, header, nav').remove();
  let text = $('body').text();
  text = cleanText(text);
  log.info(`${title}`, { url: request.loadedUrl });
  await localstorage.saveData('ggz-nhn', { title: title, body: text, request: request });
});

export const ggznhnRouter = router;
