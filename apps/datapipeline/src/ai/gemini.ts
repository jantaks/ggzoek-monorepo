import { Vacature } from './types.js';
import { buildPrompt, template } from './promptTemplates.js';
import { GoogleGenerativeAI, RequestOptions } from '@google/generative-ai';
import { getAll, getVacature } from '@ggzoek/ggz-drizzle/src/vacatureRepo.js';
import { log } from '@ggzoek/logging/src/logger.js';

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const requestOptions: RequestOptions = {apiVersion: "v1beta"}

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest"});

type ApiUsage = {
  tokensIn: number
  tokensOut: number
  cost: number
}

type SummaryResult = {
  summary: string
  usage: ApiUsage
}

export async function summarize(vacature: Vacature) {
  if (!vacature.body) {
    throw new Error('Vacature body is missing');
  }
  const prompt = buildPrompt(vacature);
  // For text-only input, use the gemini-pro model
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  console.log(result);
}

const vacature = await getVacature('9a4b8302078df1bebbc226f0b1b2749da9efb67d7e32ec0ecdcc1ea0bb351226') as Vacature;
const result = summarize(vacature);
log.info(result, vacature.url)