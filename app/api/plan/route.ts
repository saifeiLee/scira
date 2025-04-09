import { getGroupConfig } from '@/app/actions';
import { createDataStreamResponse, streamText, convertToCoreMessages, tool, generateText } from 'ai';
import { openai } from '@/lib/ai';
import { z } from 'zod';

const ReasonThinkingPrompt = `
  ### Reason Thinking Tool:
    - Analyze the problems encountered by the user and identify implicit needs
    - Attend to the user's emotions
    - think step by step
`;

export async function POST(req: Request) {
    const { messages, model, group, user_id, timezone } = await req.json();
    const { tools: activeTools, systemPrompt, toolInstructions, responseGuidelines } = await getGroupConfig(group);

    console.log('Running with model: ', model.trim());
    console.log('Group: ', group);
    console.log('Timezone: ', timezone);
    if (group !== 'banxueya') {
        throw new Error('Invalid group');
    }
    return createDataStreamResponse({
        execute: async (dataStream) => {
            // 思考过程
            const thinkingToolResult = streamText({
                model: openai('gpt-4o'),
                messages: convertToCoreMessages(messages),
                temperature: 0,
                system: ReasonThinkingPrompt,
                toolChoice: 'required',
                tools: {
                    reason_thinking: tool({
                        description: 'Reason Thinking Tool',
                        parameters: z.object({
                            problem: z.string().describe('The problem encountered by the user'),
                            emotions: z.string().describe('The emotions of the user'),
                        }),
                        execute: async ({ problem, emotions }) => {
                            console.log('Problem: ', problem);
                            console.log('Emotions: ', emotions);
                            const { text: thinkingResult } = await generateText({
                                model: openai('gpt-4o'),
                                messages: convertToCoreMessages(messages),
                                system:
                                    ReasonThinkingPrompt +
                                    '\n\n' +
                                    `
                                Problem: ${problem}
                                Emotions: ${emotions}
                                `,
                                temperature: 1,
                            });
                            return {
                                thinkingResult,
                            };
                        },
                    }),
                },
            });
            thinkingToolResult.mergeIntoDataStream(dataStream);

            // 制定计划
            // const planResult = streamText({
        },
    });
}
