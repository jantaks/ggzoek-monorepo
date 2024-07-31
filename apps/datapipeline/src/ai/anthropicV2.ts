import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';
import { AnthropicModels } from './summarizeNew.js';
import { SelectVacature } from '../../../../packages/ggz-drizzle/src/schema.js';
import Message = Anthropic.Message;

const anthropic = new Anthropic({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  apiKey: process.env['ANTHROPIC_API_KEY'] // This is the default and can be omitted
});

type IOCost = { input: number; output: number };
type ModelCost = Record<AnthropicModels, IOCost>;

const modelCosts: ModelCost = {
  'claude-3-opus-20240229': { input: 15 / 1000, output: 75 / 1000 },
  'claude-3-sonnet-20240229': { input: 3 / 1000, output: 15 / 1000 },
  'claude-3-haiku-20240307': { input: 0.25 / 1000, output: 1.25 / 1000 }
} as const;

const model: AnthropicModels = 'claude-3-haiku-20240307';

export const summarize = async (vacature: SelectVacature) => {
  const message = await anthropic.messages.create({
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: vacature.body! }],
    model: model
  });
  return { cost: cost(model, message), content: message.content[0].text };
};

function cost(model: AnthropicModels, message: Message) {
  const { input, output } = modelCosts[model];
  return (
    (input / 1000) * message.usage.input_tokens + (output / 1000) * message.usage.output_tokens
  );
}

const systemPrompt = `
Je bent een recruitment AI, gespecialiseerd in banen in de Geestelijke GezondheidsZorg (GGZ). Je taak is om een samenvatting te maken van 450 - 550 woorden van vacatureteksten voor bijvoorbeeld Psychiaters en GZ-Psychologen.  

De samenvatting bestaat uit 450 tot 550  woorden en bevat informatie die kandidaten een goed beeld geeft van de inhoudelijke werkzaamheden en de bijzonderheden van deze specifieke vacature, zoals onder andere:
- Wat is de meest voorkomende casuistiek / ziektebeelden?
- Wat zijn de belangrijkste doelgroepen / type clienten?
- Welke behandelmethoden worden het meest gebruikt? 
- Hoe groot is het team?
- Wat is de samenstelling van het team?
- Wat is de missie / visie van de organisatie?
- Wat zijn de kernwaarden van de organisatie?
- Wat zijn bijzondere arbeidsvoorwaarden?
- Is er ruimte voor wetenschappelijk onderzoek?
- Wat zijn de werktijden, moet de kandidaat ook avonden of weekenden werken? 
- Is er sprake van (bereikbaarheids) diensten? Worden deze vergoed en hoe?
- Welke mogelijkheden zijn er voor studie en ontwikkeling?

De samenvatting heeft een zakelijke, professionele stijl:

- Schrijf in een actieve vorm. Dus niet: "Er wordt gezocht naar een nieuwe collega", maar: "Organisatie x zoekt een nieuwe collega". Niet: "Humor en relativeringsvermogen zijn gewenste eigenschappen". Maar: "De kandidaat heeft humor en relativeringsvermogen.
- Schrijf in de 3e persoon. Dus niet: "je doet beoordelingen" maar "De kandidaat doet beoordelingen".
- Begin niet elke zin met Kandidaat maar wissel af met het beroep (De Psychiater doet beoordelingen). 
- Schrijf op een feitelijke manier, zonder overdrijving. 
- Gebruik korte zinnen, bijvoorkeur maximaal 2 comma's per zin. 
- Vermijd algemene waarheden, open deuren of dingen die altijd gelden voor het type functie. 
- Vermijd superlatieven en beperk bijvoeglijke naamwoorden. 
- Gebruik de naam van de werkgever ipv 'wij'. Dus 'Werkgever X biedt' ipv 'Wij bieden'.
`;
