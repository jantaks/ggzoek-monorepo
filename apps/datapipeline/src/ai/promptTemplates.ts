import { log } from '@ggzoek/logging/src/logger.js';
import fs from 'fs';
import { SelectVacature } from '../../../../packages/ggz-drizzle/drizzle/schema.js';

export const templateSummary = `
Je bent een recruitment AI, gespecialiseerd in banen in de Geestelijke GezondheidsZorg (GGZ).

Maak een samenvatting van de vacature van ongeveer 500 woorden. Geef informatie die kandidaten een goed beeld geeft van de inhoudelijke werkzaamheden en de bijzonderheden van deze specifieke vacature, bijvoorbeeld:
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

Schrijf op een zakelijke, professionele manier: 

- Schrijf in een actieve vorm. Dus niet: "Er wordt gezocht naar een nieuwe collega", maar: "Organisatie x zoekt een nieuwe collega". Niet: "Humor en relativeringsvermogen zijn gewenste eigenschappen". Maar: "De kandidaat heeft humor en relativeringsvermogen.
- Schrijf in de 3e persoon. Dus niet: "je doet beoordelingen" maar "De kandidaat doet beoordelingen".
- Begin niet elke zin met Kandidaat maar wissel af met het beroep (De Psychiater doet beoordelingen). 
- Schrijf op een feitelijke manier, zonder overdrijving. 
- Gebruik korte zinnen met masimaal 2 comma's per zin. 
- Vermijd algemene waarheden, open deuren of dingen die altijd gelden voor het type functie. 
- Vermijd superlatieven en beperk bijvoeglijke naamwoorden. 
- Gebruik de naam van de werkgever ipv 'wij'. Dus 'Parnassia biedt' ipv 'Wij bieden'. 

Hieronder volgt de vacaturetekst: 
{user_input}`;

export const templateJson = `
Je bent een recruitment AI, gespecialiseerd in banen in de Geestelijke GezondheidsZorg (GGZ).
Je taak is om gestructureerd data uit vacature teksten te halen. Maak een JSON en gebruik onderstaande velden, volg de instructies nauwgezet. 
Bij een keuzelijst mag je alleen uit geboden keuzes kiezen!!! Dus niet "Psychotische stoornis" maar "Psychose" ook al wordt in de tekst alleen gesproken over "Psychotische stoornis". Numbers mogen alleen hele getallen zijn, dus geen strings!!!

"salarisMin": number  // minimum salaris
"salarisMax": number  // maximum salaris
"urenMin": number  // minimum aantal uren per week
"urenMax": number  // maximum aantal uren per week
"title": string  // Een titel voor de vacature. Maximaal 5 woorden
"instelling": string  // De instelling en/of organisatie / bedrijf waar de vacature betrekking op heeft
"organisatieOnderdeel": string  // het onderdeel of de afdeling binnen de organisatie
"beroepen": array of strings  // Welk beroep oefent de kandidaat uit? Kies alleen uit: [Klinisch Psycholoog, GZ-Psycholoog, Psychiater, Kinder/Jeugd Psychiater, Verpleegkundig Specialist, Verpleegkundige, Sociaal Psychiatrisch Verpleegkundige, Psychomotorisch Therapeut, Vaktherapeut, Maatschappelijk Werker, Ervaringsdeskundige, Psycholoog, Orthopedagoog, Arts, Verpleegkundig Specialist, Verpleegkundige, Sociaal Psychiatrisch Verpleegkundige, Psychomotorisch Therapeut, Vaktherapeut, Maatschappelijk Werker, Ervaringsdeskundige, Psycholoog, Orthopedagoog, Arts, Overig] 
"stoornissen": array of strings  // Welke (max. 3) stoornissen zal de kandidaat het meest tegenkomen in zijn functie? Bijvoorbeeld ADHD, Autisme, Persoonlijkheidsstoornissen, Angststoornissen, Depressie, Trauma, Psychose, Verslaving, Eetstoornissen, Bipolaire stoornis, Overig. 
"behandelmethoden": array of strings  // Welke behandelmethoden worden het meest toegepast (maximaal 3)? Alleen de volgende keuzes zijn geldig: [Cognitieve Gedragstherapie, Schematherapie, EMDR, Systeemtherapie, Oplossingsgerichte therapie, ACT, MBT, IPT, CGT, PMT, ECT, Vaktherapie, Farmacotherapie, Overig]
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
Hieronder volgt de vacaturetekst: 
{user_input}
`;

function buildPrompt(vacature: SelectVacature, template: string) {
  if (!vacature.body) {
    throw new Error('Vacature body is missing');
  }
  const bodyWordCount = vacature.body.split(' ').length;
  const prompt = template.replace('{user_input}', vacature.body);
  const promptWordCount = prompt.split(' ').length;
  log.info(
    `Body word count: ${bodyWordCount}. Word count for prompt: ${promptWordCount} (${vacature.url})`
  );
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  fs.writeFileSync(`promptlog/${timestamp}.txt`, prompt);
  return prompt;
}

export function summarizePrompt(vacature: SelectVacature) {
  return buildPrompt(vacature, templateSummary);
}

export function extractDataPrompt(vacature: SelectVacature) {
  return buildPrompt(vacature, templateJson);
}
