import { createOpenAI } from '@ai-sdk/openai';
import { wrapLanguageModel } from 'ai';

export const openai = createOpenAI({
  baseURL: "https://test-llm.baijia.com/v1/",
  apiKey: 'sk-P4Zn5hJ27nLIk4Tikv6ceQ',
});

export const customModel = (apiIdentifier: string) => {
  return wrapLanguageModel({
    model: openai(apiIdentifier),
    middleware: {},
  });
};

export const imageGenerationModel = openai.image('dall-e-3');
