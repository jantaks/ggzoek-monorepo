import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const anthropic = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'] // This is the default and can be omitted
});

enum Model {
  OPUS = 'claude-3-opus-20240229', //GOLD
  SONNET = 'claude-3-sonnet-20240229', //SILVER
  HAIKU = 'claude-3-haiku-20240307' //BRONZE
}

async function sendRequest(prompt: string) {
  const message = await anthropic.messages.create({
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
    model: Model.HAIKU
  });
  const result = message.content[0].text;
  const json = result.substring(result.indexOf('{'), result.lastIndexOf('}') + 1);
  return json;
}

export default sendRequest;
