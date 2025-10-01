'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { stream } from 'genkit/stream';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const ChatHistorySchema = z.array(ChatMessageSchema);
export type ChatHistory = z.infer<typeof ChatHistorySchema>;

export async function chat(history: ChatHistory) {
  const llm = ai.getModel('googleai/gemini-2.5-flash');

  return stream(async (write) => {
    const { stream } = await llm.generate({
      history: history.map((msg) => ({ role: msg.role, content: [{ text: msg.content }] })),
      prompt: 'You are a helpful assistant for ReliefLink, a disaster relief platform. Answer the user\'s questions about the platform, disaster relief, or how to get help. Be concise and friendly.',
    });

    for await (const chunk of stream) {
      write(chunk.text);
    }
  });
}
