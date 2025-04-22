import { getGroupConfig } from '@/app/actions';
import { createDataStreamResponse, streamText, convertToCoreMessages, tool, generateText } from 'ai';
import { openai } from '@/lib/ai';
import { z } from 'zod';
import { GaokaoData } from './data';

const ReasonThinkingToolPrompt = `
  ### Reason Thinking Tool
    You are reasoning thinking content generator. Output your thinking process about user's input.
    You should:
    - Analyze the problems encountered by the user and identify implicit needs
    - Attend to the user's emotions
    - Output in users' language
`;

const OutputThinkingPrompt = `
输出思考过程，思考如何回答用户。你输出会用于指导我如何回答用户。
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
            const lastMessage = messages[messages.length - 1];
            console.log('lastMessage: ', lastMessage);
            const shouldThink = lastMessage.content != ''
            let convertedMessages = convertToCoreMessages(messages)

            if (shouldThink) {
                // 思考过程 (可以服务于学情深沟)
                const thinkingToolResult = streamText({
                    model: openai('gpt-4o'),
                    messages: convertToCoreMessages(messages),
                    temperature: 0,
                    system: ReasonThinkingToolPrompt,
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
                                        OutputThinkingPrompt +
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
                convertedMessages = [...convertedMessages, ...(await thinkingToolResult.response).messages]
            }
            

            // 工具调用
            const toolsResult = streamText({
                model: openai('gpt-4o'),
                messages: convertedMessages,
                temperature: 1,
                toolChoice: 'auto',
                system: systemPrompt,
                tools: {
                    ask_user_info: tool({
                        description: '向学生询问个人信息',
                        parameters: z.object({
                            announcement: z
                                .string()
                                .describe(
                                    'Announcement to the user, describe what you want to ask and what is it for.',
                                ),
                        }),
                    }),
                    search_province_grade_details: tool({
                        description: '根据省份和年级搜索相关信息',
                        parameters: z.object({
                            province: z.string().describe('省份'),
                            grade: z.string().describe('年级'),
                            subject: z.string().describe('科目'),
                        }),
                        execute: async ({ province, grade, subject }) => {
                            console.log('省份: ', province);
                            console.log('年级: ', grade);
                            console.log('科目: ', subject);
                            // 这里应该给出规划结果
                            return {
                                result: GaokaoData['北京'],
                            };
                        },
                    }),
                },
            });

            toolsResult.mergeIntoDataStream(dataStream);
            // 输出回复
            const response = streamText({
                model: openai('gpt-4o'),
                system: responseGuidelines,
                messages: [...convertToCoreMessages(messages), ...(await toolsResult.response).messages],
                onFinish(event) {
                    console.log('Fin reason[2]: ', event.finishReason);
                    console.log('Reasoning[2]: ', event.reasoning);
                    console.log('reasoning details[2]: ', event.reasoningDetails);
                    console.log('Steps[2] ', event.steps);
                    console.log('Messages[2]: ', event.response.messages);
                },
            });
            return response.mergeIntoDataStream(dataStream);

            // 制定计划
            // const planResult = streamText({
        },
    });
}
