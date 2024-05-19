import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';
import { buildPrompt } from './promptTemplates.js';
import { Vacature } from './types.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { completionsResultSchema } from '@ggzoek/ggz-drizzle/drizzle/schema.js';
import Message = Anthropic.Message;

const anthropic = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'] // This is the default and can be omitted
});

enum Model {
  OPUS = 'claude-3-opus-20240229', //GOLD
  SONNET = 'claude-3-sonnet-20240229', //SILVER
  HAIKU = 'claude-3-haiku-20240307', //BRONZE
}

export async function summarize(vacature: Vacature) {
  log.info(`Requesting completion for ${vacature.url} with Anthropic`);
  const prompt = buildPrompt(vacature);
  const message = await anthropic.messages.create({
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
    model: Model.SONNET
  });
  const result = message.content[0].text
  const json = result.substring(result.indexOf('{'), result.lastIndexOf('}') + 1);
  return json
}

export function procesRawCompletionResult(json: string, vacature: Vacature) {
  let maybeVacature = JSON.parse(json) as Vacature;
  maybeVacature.url = vacature.url;
  maybeVacature.urlHash = vacature.urlHash;
  return completionsResultSchema.parse(maybeVacature)
}