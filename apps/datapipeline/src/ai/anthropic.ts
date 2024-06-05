import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';
import { AnthropicModels, CompletionResult } from './summarizeNew.js';
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

const sender =
  (model: AnthropicModels) =>
  async (prompt: string): Promise<CompletionResult> => {
    const message = await anthropic.messages.create({
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
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

export default sender;
