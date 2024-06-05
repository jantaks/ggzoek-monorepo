import OpenAI from 'openai';
import dotenv from 'dotenv';
import 'dotenv/config';
import { log } from '@ggzoek/logging/src/logger.js';
import { ChatCompletion } from 'openai/resources/index';
import { OpenAIModels } from './summarizeNew.js';
import { SelectVacature } from '../../../../packages/ggz-drizzle/drizzle/schema.js';
import fs from 'fs';
import { synonyms } from '../synonyms.js';

dotenv.config();

const model: OpenAIModels = 'gpt-4o-2024-05-13';

const openai = new OpenAI();

type IOCost = { input: number; output: number };
type ModelCost = Record<OpenAIModels, IOCost>;

const modelCosts: ModelCost = {
  'gpt-4o': { input: 5 / 1000, output: 15 / 1000 },
  'gpt-4o-2024-05-13': { input: 5 / 1000, output: 15 / 1000 },
  'gpt-3.5-turbo': { input: 0.5 / 1000, output: 1.5 / 1000 }
} as const;

export const summarize = async (vacature: SelectVacature) => {
  let completion: ChatCompletion | undefined = undefined;
  try {
    completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: vacature.body! }
      ],
      response_format: { type: 'text' },
      model: model
    });
  } catch (error) {
    log.error(error);
    return '';
  }
  log.info(completion);
  appendToFile({
    prompt: systemPrompt,
    modelName: model,
    response: completion.choices[0].message.content,
    totalCost: cost(model, completion),
    vacatureUrl: vacature.url,
    vacatureId: vacature.urlHash
  });
  return completion.choices[0].message.content;
};

function cost(model: OpenAIModels, completion: ChatCompletion) {
  const { input, output } = modelCosts[model];
  if (completion.usage) {
    return (
      (input / 1000) * completion.usage.prompt_tokens +
      (output / 1000) * completion.usage.completion_tokens
    );
  }
  return 0;
}

function appendToFile(data: {
  prompt: string;
  vacatureUrl: string;
  vacatureId: string;
  response: string | null;
  modelName: string;
  totalCost: number;
}) {
  // append data to a markdown file. Headers: vacatureUrl, modelName, totalCost, prompt, response
  const fileName = 'responses.md';
  const part_1 = `### ${data.vacatureUrl} \n`;
  const part_1a = `#### ID:  ${data.vacatureId} \n`;
  const part_2 = `#### Model: ${data.modelName} \n`;
  const part_3 = `#### Total Cost: ${data.totalCost} \n`;
  const part_4 = `#### Prompt: \n ${data.prompt} \n`;
  const part_5 = `#### Response: \n ${data.response} \n`;
  const dataToAppend = part_1 + part_1a + part_2 + part_3 + part_4 + part_5;
  fs.appendFileSync(fileName, dataToAppend);
}

const behandelmethoden = Object.keys(synonyms.behandelmethoden);
const stoornissen = [
  'Depressieve stoornissen',
  'Bipolaire en gerelateerde stoornissen',
  'Angststoornissen',
  'Obsessieve-compulsieve en gerelateerde stoornissen',
  'Trauma- en stressorgerelateerde stoornissen',
  'Schizofreniespectrum en andere psychotische stoornissen',
  'Eetstoornissen',
  'Neurocognitieve stoornissen',
  'Neurodevelopmental stoornissen',
  'Persoonlijkheidsstoornissen',
  'Somatische symptoomstoornis en verwante stoornissen',
  'Disruptieve, impulsbeheersings- en gedragsstoornissen',
  'Verslavingsstoornissen',
  'Genderdysforie',
  'Parafiele stoornissen',
  'Slaap-waakstoornissen',
  'Dissociatieve stoornissen',
  'Stoornissen in de controle over impulsen',
  'Eliminatiestoornissen',
  'Voedings- en eetstoornissen'
];

const systemPrompt = `
Je bent een recruitment AI, gespecialiseerd in banen in de Geestelijke GezondheidsZorg (GGZ). Je taak is om een samenvatting te maken van ongeveer 300 woorden van vacatureteksten. 
De samenvatting wordt gebruikt voor een website om vacatures te vergelijken. Samenvattingen hebben een vergelijkbare structuur (zie voorbeeld hieronder). 
Op de website staat een link naar de originele vacature om de volledige tekst te lezen en eventueel te solliciteren. Vermeldt daarom geen persoonlijke informatie zoals namen of telefoonnummers.

De samenvatting heeft een zakelijke, professionele stijl, dat wil zeggen:

- Schrijf in een actieve vorm. Dus niet: "Er wordt gezocht naar een nieuwe collega", maar: "Organisatie x zoekt een nieuwe collega". Niet: "Humor en relativeringsvermogen zijn gewenste eigenschappen". Maar: "De kandidaat heeft humor en relativeringsvermogen.
- Schrijf in de 3e persoon. Dus niet: "je doet beoordelingen" maar "De kandidaat doet beoordelingen".
- Begin niet elke zin met Kandidaat maar wissel af met het beroep (De Psychiater doet beoordelingen). 
- Schrijf op een feitelijke manier, zonder overdrijving. 
- Gebruik korte zinnen, bijvoorkeur maximaal 2 comma's per zin. 
- Vermijd algemene waarheden, open deuren of dingen die altijd gelden voor het type functie. 
- Vermijd superlatieven en beperk bijvoeglijke naamwoorden. 
- Gebruik de naam van de werkgever ipv 'wij'. Dus 'Werkgever X biedt' ipv 'Wij bieden'.

De lezer van de samenvatting is waarschijnlijk een hoogopgeleide GGZ professional. 
Hij of zij wil meer informatie over de vakinhoudelijke aspecten van de vacature en de onderscheidende kenmerken.
Voor standaard arbeidsvoorwaarden wordt verwezen naar de URL van de originele vacature, deze hoeven niet in de samenvatting te worden opgenomen.

Maak, naast de samenvatting een JSON met de volgende velden: 

"salarisMin": number  // minimum salaris
"salarisMax": number  // maximum salaris
"urenMin": number  // minimum aantal uren per week
"urenMax": number  // maximum aantal uren per week
"title": string  // Een titel voor de vacature. Maximaal 5 woorden
"instelling": string  // De instelling en/of organisatie / bedrijf waar de vacature betrekking op heeft
"organisatieOnderdeel": string  // het onderdeel of de afdeling binnen de organisatie
"beroepen": array of strings  // Welk beroep oefent de kandidaat uit? 
Kies alleen uit:  
"stoornissen": array of strings  // Welke stoornissen worden in de tekst expliciet genoemd? Kies uit onderstaande lijst. 
"behandelmethoden": array of strings  // Welke behandelmethoden worden expliciet genoemd (maximaal 3). Kies uit onderstaande lijst? 
"locaties": array of strings  // in welke plaatsen of regios is de vacature
"locatieDetails": string  // bijvoorbeeld de naam van de wijk, de straat of het gebouw
"CAO": string  // Type CAO
"FWG": string  // Functie waarderingsschaal
"minSchaal": string  // minimum schaal (FWG)
"maxSchaal": string  // maximum schaal (FWG)
"contract": string  // Kies uit een van de volgende opties: [Onbepaalde tijd, Bepaalde tijd, Oproepkracht, Overig]
"eindejaarsuitkering": string  // Ja, Nee of onbekend
"reiskostenvergoeding": string  // Ja, Nee of onbekend
"werkvorm": string  // Op locatie, thuis, hybride of onbekend
"opleidingsbudget": string  // Ja, Nee of onbekend
"opleidingsbudgetSize": number  // Hoogte van het opleidingsbudget. 0 indiend onbekend

Keuzemogelijkheden: 
Beroepen: [Klinisch Psycholoog, GZ-Psycholoog, Psychiater, Kinder/Jeugd Psychiater, Verpleegkundig Specialist, Verpleegkundige, Sociaal Psychiatrisch Verpleegkundige, Psychomotorisch Therapeut, Vaktherapeut, Maatschappelijk Werker, Ervaringsdeskundige, Psycholoog, Orthopedagoog, Arts, Verpleegkundig Specialist, Verpleegkundige, Sociaal Psychiatrisch Verpleegkundige, Psychomotorisch Therapeut, Vaktherapeut, Maatschappelijk Werker, Ervaringsdeskundige, Psycholoog, Orthopedagoog, Arts, Overig]
Behandelmethoden: ${behandelmethoden.join(', ')}
Stoornissen: ${stoornissen.join(', ')}
`;
