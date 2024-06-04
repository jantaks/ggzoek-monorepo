import OpenAI from 'openai';
import dotenv from 'dotenv';
import 'dotenv/config';
import { log } from '@ggzoek/logging/src/logger.js';
import { ChatCompletion } from 'openai/resources/index';
import { OpenAIModels } from './summarizeNew.js';
import { SelectVacature } from '../../../../packages/ggz-drizzle/drizzle/schema.js';
import fs from 'fs';

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

De samenvatting bestaat bevat informatie die kandidaten een goed beeld geeft van de inhoudelijke werkzaamheden en de bijzonderheden van deze specifieke vacature. 
Deel de samenvatting op in de volgende 3 paragrafen: 
1. Functieomschrijving:
Beschrijf de belangrijkste taken en verantwoordelijkheden van de functie. Geef bijvoorbeeld en indien mogelijk antwoord op de volgende vragen: 
- Welke ziektebeelden en stoornissen worden het meest behandeld. B.v. eetstoornissen, psychoses, depressie, persoonlijkheidsstoornissen, etc.
- Wat zijn de belangrijkste doelgroepen / type clienten?
- Welke behandelmethodieken en -vormen worden het meest gebruikt? B.v. EMDR, CGT, systeemtherapie, medicatie, etc.
- Wat zijn de belangrijkste taken
2. Team en organisatie:
Beschrijf de samenstelling van het team en de organisatie. Geef bijvoorbeeld en indien mogelijk antwoord op de volgende vragen:
- Hoe groot is het team?
- Wat is de samenstelling van het team, welke disciplines zijn vertegenwoordigd?
- Wat is de missie / visie van de organisatie?
- Wat zijn de kernwaarden van de organisatie?
3. Arbeidsvoorwaarden:
Beschrijf de belangrijkste arbeidsvoorwaarden. Geef bijvoorbeeld antwoord op de volgende vragen:
- Wat is het minimum en maximum salaris?
- Hoeveel uren moet er gewerkt worden
- Wat zijn eventuele bijzondere (niet standaard) arbeidsvoorwaarden?
- Wat zijn de werktijden, moet de kandidaat ook avonden of weekenden werken? 
- Is er sprake van (bereikbaarheids) diensten? Worden deze vergoed en hoe?
- Welke mogelijkheden zijn er voor studie en persoonlijke ontwikkeling? Wat is het eventuele budget?
- Is er ruimte voor (wetenschappelijk) onderzoek?
- Is er een mogelijkheid tot thuiswerken, hybride weken of flexibele werktijden?
`;
