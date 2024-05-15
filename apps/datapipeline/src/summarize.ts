import OpenAI from "openai";
import dotenv from "dotenv";
import {GoogleGenerativeAI} from "@google/generative-ai"
import {storage} from "./services/storage.js";
import 'dotenv/config'

const template = `
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

dotenv.config()

enum Model {
    GPT4o = "gpt-4o",
    GPT35TURBO = "gpt-3.5-turbo",
    GPT4 = "gpt-4-1106-preview",
}

type Pricing = {
    input: number,
    output: number,
}

type Cost = {
    input: number,
    output: number,
    total: number,
}

const pricingTable: Record<Model, Pricing> = {
    [Model.GPT35TURBO]: {
        input: 0.0005,
        output: 0.0015,
    },
    [Model.GPT4]: {
        input: 0.01,
        output: 0.03,
    },
}
function calculateCost(model: Model, completion: OpenAI.Chat.ChatCompletion): Cost | undefined {
    const pricing = pricingTable[model];
    if (completion.usage === undefined){
        return undefined
    }
    const input = pricing.input * completion.usage.prompt_tokens / 1000;
    const output = pricing.output * completion.usage.completion_tokens / 1000;
    return {
        input,
        output,
        total: input + output,
    }
}

const MODEL = Model.GPT4o;
const openai = new OpenAI();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

async function runGemini(vacature: Vacature) {
    if (!vacature.body){
        throw new Error("Vacature body is missing")
    }
    const prompt = template.replace("{user_input}", vacature.body);
    // For text-only input, use the gemini-pro model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
}

export async function summarizeVacatures(vacatures: Vacature[]){
    const tasks = vacatures.map(vacature => summarize(vacature));
    return await Promise.all(tasks);
}

export type Vacature = {
    organisatie: string;
    bodyHash?: string;
    url?: string;
    urlHash: string;
    title?: string,
    body?: string
    cost?: Cost
    summary?: string
    llmParams?: {
        template: string,
        cost: Cost,
        model: Model
    },
    synced: boolean
    [key: string]: any;

}

function buildPrompt(vacature: Vacature) {
    if (!vacature.body){
        throw new Error("Vacature body is missing")
    }
    return template.replace("{user_input}", vacature.body);
}

async function summarize(vacature: Vacature) {
    const prompt = buildPrompt(vacature);
    console.log(`Requesting completion for ${vacature.url}`)
    const completion = await openai.chat.completions.create({
        messages: [{role: "system", content: prompt}],
        model: MODEL,
        response_format: {"type": "json_object"}
    });
    let result = completion.choices[0].message.content;
    if (result){
        const resultJson = JSON.parse(result);
        const cost = calculateCost(MODEL, completion)
        return {
            ...vacature,
            ...resultJson,
            completionTimeStamp: new Date().toISOString(),
            has_summary: "true",
            llmParams: {template, cost, model: MODEL}} as Vacature;
    }
    return {} as Vacature;
}




