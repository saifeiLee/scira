import { createOpenAI } from '@ai-sdk/openai';
import { wrapLanguageModel } from 'ai';
console.log('process.env.OPENAI_API_BASE:', process.env.OPENAI_API_BASE);
console.log('process.env.OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
export const openai = createOpenAI({
  baseURL: process.env.OPENAI_API_BASE,
  apiKey: process.env.OPENAI_API_KEY,
});

export const customModel = (apiIdentifier: string) => {
  return wrapLanguageModel({
    model: openai(apiIdentifier),
    middleware: {},
  });
};

export const imageGenerationModel = openai.image('dall-e-3');
