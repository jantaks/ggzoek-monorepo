import { Vacature } from './types.js';
import { log } from '@ggzoek/logging/src/logger.js';
import fs from 'fs';

export const template = `
Je bent een recruitment AI, gespecialiseerd in banen in de Geestelijke GezondheidsZorg (GGZ).
Je taak is om gestructureerd data uit vacature teksten te halen. Maak een JSON en gebruik onderstaande velden, volg de instructies nauwgezet. Bij een keuzelijst mag je alleen uit geboden keuzes kiezen!!! Dus niet "Psychotische stoornis" maar "Psychose" ook al wordt in de tekst alleen gesproken over "Psychotische stoornis". Numbers mogen alleen hele getallen zijn, dus geen strings!!!

"title": string  // Een titel voor de vacature. Maximaal 5 woorden
"instelling": string  // De instelling en/of organisatie / bedrijf waar de vacature betrekking op heeft
"organisatieOnderdeel": string  // het onderdeel of de afdeling binnen de organisatie
"beroepen": array of strings  // Welk beroep oefent de kandidaat uit? Kies alleen uit: [Klinisch Psycholoog, GZ-Psycholoog, Psychiater, Kinder/Jeugd Psychiater, Verpleegkundig Specialist, Verpleegkundige, Sociaal Psychiatrisch Verpleegkundige, Psychomotorisch Therapeut, Vaktherapeut, Maatschappelijk Werker, Ervaringsdeskundige, Psycholoog, Orthopedagoog, Arts, Verpleegkundig Specialist, Verpleegkundige, Sociaal Psychiatrisch Verpleegkundige, Psychomotorisch Therapeut, Vaktherapeut, Maatschappelijk Werker, Ervaringsdeskundige, Psycholoog, Orthopedagoog, Arts, Overig] 
"stoornissen": array of strings  // Welke (max. 3) stoornissen zal de kandidaat het meest tegenkomen in zijn functie? Bijvoorbeeld ADHD, Autisme, Persoonlijkheidsstoornissen, Angststoornissen, Depressie, Trauma, Psychose, Verslaving, Eetstoornissen, Bipolaire stoornis, Overig. 
"behandelmethoden": array of strings  // Welke behandelmethoden worden het meest toegepast (maximaal 3)? Alleen de volgende keuzes zijn geldig: [Cognitieve Gedragstherapie, Schematherapie, EMDR, Systeemtherapie, Oplossingsgerichte therapie, ACT, MBT, IPT, CGT, PMT, ECT, Vaktherapie, Farmacotherapie, Overig]
"minSalaris": number  // minimum salaris
"maxSalaris": number  // maximum salaris
"minUren": number  // minimum aantal uren per week
"maxUren": number  // maximum aantal uren per week
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
"summary": string  // Een samenvatting van de vacature (maximaal 750 woorden). Geef informatie die kandidaten een goed beeld geeft van de inhoudelijke werkzaamheden, bijvoorbeeld:
- Wat is de meest voorkomende casuistiek?
- Welke behandelingmethoden worden het meest gebruikt. 
- Hoe ziet het team eruit?
- Ontwikkelinsmogelijkheden voor de kandidaat. 
Spreek in de actieve vorm. Dus niet: "Er wordt gezocht naar een nieuwe collega", maar: "Organisatie x zoekt een nieuwe collega". 
Niet: "Humor en relativeringsvermogen zijn gewenste eigenschappen". Maar: "De kandidaat heeft humor en relativeringsvermogen.
Schrijf in de 3e persoon. 
Dus niet: "je doet beoordelingen" maar "De kandidaat doet beoordelingen". Gebruik korte zinnen met maximaal 2 comma's per zin.

Schrijf op een feitelijke manier, zonder overdrijving. Gebruik korte zinnen. Gebruik een actieve vorm. Dus niet: 'Er wordt gezocht naar een nieuwe collega', maar 'Organisatie x zoekt een nieuwe collega'. 
Schrijf niet: "je zult de boodschappen doen" maar "Je doet de boodschappen". Geen algemene waarheden of dingen die altijd gelden voor deze functie. Vermijd superlatieven en beperk bijvoeglijke naamwoorden. Maximaal 2 comma's per zin. Vermeld indien mogelijk de doelgroepen / type clienten. Vermeld de behandelmethoden. Gebruik de naam van de werkgever ipv 'wij'. Dus 'Parnassia biedt' ipv 'Wij bieden'. 
Vermeld in de samenvatting geen gegevens die ook al in een van bovenstaande velden staan.
[JSON_INPUT]
{user_input}
`;

export function buildPrompt(vacature: Vacature) {
  if (!vacature.body) {
    throw new Error('Vacature body is missing');
  }
  let prompt = template.replace('{user_input}', vacature.body);
  let wordCount = prompt.split(' ').length;
  log.info(`Word count for prompt: ${wordCount} (${vacature.url})`);
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  fs.writeFileSync(`promptlog/${timestamp}.txt`, prompt);
  return prompt;
}