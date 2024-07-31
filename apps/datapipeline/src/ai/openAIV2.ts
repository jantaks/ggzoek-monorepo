import OpenAI from 'openai';
import dotenv from 'dotenv';
import 'dotenv/config';
import { ChatCompletion } from 'openai/resources/index';
import { OpenAIModels } from './summarizeNew.js';
import { SelectVacature } from '../../../../packages/ggz-drizzle/src/schema.js';
import fs from 'fs';
import { synonyms } from '../pipeline/4_augment/synonyms.js';

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

export const summarize = async (vacature: SelectVacature, summaryBatchId = 0) => {
  let completion: ChatCompletion | null = null;
  if (!vacature.body) {
    throw new Error('No body in vacature. Can not summarize.');
  }
  try {
    console.log('Sending prompt for: ', vacature.url);
    completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: vacature.body }
      ],
      response_format: { type: 'text' },
      model: model
    });
  } catch (error) {
    throw new Error(`Error summarizing vacature: ${error}`);
  }
  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No content in completion');
  }
  const { summarySection, vacature: updatedVacature } = processResponse(content);
  return {
    ...vacature,
    ...updatedVacature,
    summary: summarySection,
    summaryModel: model,
    summaryCost: String(cost(model, completion)),
    summaryTimestamp: new Date(),
    summaryBatchId: summaryBatchId + 1
  } as SelectVacature;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function appendToFile(data: {
  fileName: string;
  prompt: string;
  vacatureUrl: string;
  vacatureId: string;
  response: string | null;
  modelName: string;
  totalCost: number;
}) {
  // append data to a markdown file. Headers: vacatureUrl, modelName, totalCost, prompt, response
  const part_1 = `### ${data.vacatureUrl} \n`;
  const part_1a = `#### ID:  ${data.vacatureId} \n`;
  const part_2 = `#### Model: ${data.modelName} \n`;
  const part_3 = `#### Total Cost: ${data.totalCost} \n`;
  const part_4 = `#### Prompt: \n ${data.prompt} \n`;
  const part_5 = `#### Response: \n ${data.response} \n`;
  const dataToAppend = part_1 + part_1a + part_2 + part_3 + part_4 + part_5;
  fs.appendFileSync(data.fileName, dataToAppend);
}

export function processResponse(response: string) {
  function clean(json: string) {
    return json.replace(/\n/g, '').replace(/.*?({.*}).*/, '$1');
  }

  let jsonSection: string;
  let summarySection: string;
  const sections = response.split('```');
  if (sections.length < 2) {
    // splitting on ``` failed, try capturing the json with a regex based on {}
    const match = response.match(/(.*?)(\{.*})/s);
    if (!match || match.length < 3) {
      throw new Error(`Could not parse response: ${response}`);
    }
    summarySection = match[1];

    jsonSection = match[2];
  } else {
    summarySection = sections[0];
    jsonSection = sections[1];
  }
  // remove newlines and everything before the first { and after the last }
  const cleanedJson = clean(jsonSection);
  // parse the json
  let vacature: SelectVacature;
  try {
    vacature = JSON.parse(cleanedJson) as SelectVacature;
  } catch {
    throw new Error('Could not parse JSON: ' + cleanedJson);
  }

  // round number fields
  for (const key in vacature) {
    const typedKey = key as keyof typeof vacature;
    if (typeof vacature[typedKey] === 'number') {
      (vacature[typedKey] as number) = Math.round(vacature[typedKey]);
    }
  }
  //remove any line from summarySection that contains "JSON"
  summarySection = summarySection.replace(/.*JSON.*/g, '');
  return { summarySection, vacature };
}

const behandelmethoden = Object.keys(synonyms.behandelmethoden_ai.mappings);
const stoornissen = Object.keys(synonyms.stoornissen_ai.mappings);

const systemPrompt = `
Je bent een recruitment AI, gespecialiseerd in banen in de Geestelijke GezondheidsZorg (GGZ). Je taak is om een samenvatting te maken van ongeveer 300 woorden van vacatureteksten. 
De samenvatting wordt gebruikt voor een website om vacatures te vergelijken. Samenvattingen hebben een vergelijkbare structuur (zie voorbeeld hieronder). 
De lezer is een hoogopgeleide GGZ professional die geïnteresseerd is in de vakinhoudelijke aspecten van de vacature en de onderscheidende kenmerken. Beschrijf daarom indien mogelijk 
de specifieke stoornissen en behandelmethoden die in de vacaturetekst worden genoemd. Daarnaast wil de lezer waarschijnlijk meer weten over
de context (team, organisatie, cultuur) waar hij of zij te werken komt.

De samenvatting heeft een zakelijke, professionele stijl.:

- Schrijf in een actieve vorm. Dus niet: "Er wordt gezocht naar een nieuwe collega", maar: "Organisatie x zoekt een nieuwe collega". Niet: "Humor en relativeringsvermogen zijn gewenste eigenschappen". Maar: "De kandidaat heeft humor en relativeringsvermogen.
- Schrijf in de 3e persoon. Dus niet: "je doet beoordelingen" maar "De kandidaat doet beoordelingen".
- Begin niet elke zin met Kandidaat maar wissel af met het beroep (De Psychiater doet beoordelingen). 
- Schrijf op een feitelijke manier, zonder overdrijving. 
- Gebruik korte zinnen, bij voorkeur maximaal 2 comma's per zin. 
- Vermijd algemene waarheden, open deuren of dingen die altijd gelden voor het type functie. 
- Vermijd superlatieven en beperk bijvoeglijke naamwoorden. 
- Gebruik de naam van de werkgever ipv 'wij'. Dus 'Werkgever X biedt' ipv 'Wij bieden'.
- Maak geen opsomming van kenmerken zoals salaris, cao, locatie etc. Deze informatie wordt in een JSON bestand opgenomen zoals hieronder beschreven.
- Noem alleen arbeidsvoorwaarden die onderscheidend zijn of die de vacature extra aantrekkelijk maken. Standaard voorwaarden worden in de JSON opgenomen. 
- Contactgegevens, zoals telefoonnummers of e-mailadressen, worden niet genoemd. 
- Vermeld niets over de sollicitatieprocedure.

De lezer van de samenvatting is waarschijnlijk een hoogopgeleide GGZ professional. 
Hij of zij wil meer informatie over de vakinhoudelijke aspecten van de vacature en de onderscheidende kenmerken.
Voor standaard arbeidsvoorwaarden wordt verwezen naar de URL van de originele vacature, deze maken daarom geen onderdeel uit van de samenvatting. 

Maak, naast de samenvatting een JSON met de volgende velden: 

"salarisMin": number | null  // minimum salaris. Alleen als expliciet vermeld in de tekst
"salarisMax": number | null  // maximum salaris. Alleen als expliciet vermeld in de tekst
"urenMin": number  // minimum aantal uren per week. Alleen als expliciet vermeld in de tekst
"urenMax": number  // maximum aantal uren per week. Alleen als expliciet vermeld in de tekst
"ai_title": string  // Een titel voor de vacature. Maximaal 7 woorden
"instelling": string  // De hoofd / -moeder organisatie waar de vacature betrekking op heeft
"sub-instelling": string  // De sub / dochter organisatie waar de vacature betrekking op heeft. Alleen als expliciet vermeld in de tekst
"organisatieOnderdeel": string  // het onderdeel of de afdeling binnen de organisatie. Alleen als expliciet vermeld in de tekst
"stoornissen_ai": array of strings  // Welke stoornissen worden in de tekst expliciet genoemd? Kies uit onderstaande lijst. 
"behandelmethoden_ai": array of strings  // Welke behandelmethoden worden expliciet genoemd (maximaal 3). Kies uit onderstaande lijst? 
"locaties": array of strings  // in welke plaatsen of regios is de vacature
"locatieDetails": string  // bijvoorbeeld de naam van de wijk, de straat of het gebouw
"CAO": string  // Onder welke Collectieve Arbeids Overeenkomst (CAO) is de functie ingedeeld. Bijvoorbeeld "AMS", "CAO GGZ", "CAO VVT", CAO Ziekenhuizen", CAO Gehandicaptenzorg", "CAO Jeugdzorg". 
"minSchaal": string | null  // in welke minimale schaal of functiewaarderingsgroep (FWG) binnen de CAO is de vacature ingedeeld. Alleen als expliciet vermeld in de tekst
"maxSchaal": string | null  // in welke maximale schaal of functiewaarderingsgroep (FWG) binnen de CAO is de vacature ingedeeld. Alleen als expliciet vermeld in de tekst
"contract": string  | null // Kies uit een van de volgende opties: [Onbepaalde tijd, Bepaalde tijd, Oproepkracht, Overig]. Alleen als expliciet vermeld in de tekst
"eindejaarsuitkering": string | null  // Ja, Nee of onbekend. Alleen als expliciet vermeld in de tekst
"reiskostenvergoeding": string  // Ja, Nee of onbekend. Alleen als expliciet vermeld in de tekst. 
"werkvorm": string  // Op locatie, thuis, hybride of onbekend
"opleidingsbudget": string  // Ja, Nee of onbekend
"opleidingsbudgetSize": number  // Hoogte van het opleidingsbudget. 0 indiend onbekend

Keuzemogelijkheden: 
Behandelmethoden: ${behandelmethoden.join(', ')}
Stoornissen: ${stoornissen.join(', ')}

Geef het antwoord in MarkDown formaat, zonder headers,  met de Json in een code block (drie backticks). 
`;
