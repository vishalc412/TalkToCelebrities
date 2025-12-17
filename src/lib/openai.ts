import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function* streamChatCompletion(
  messages: ChatMessage[],
  temperature: number = 0.7
) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature,
    max_tokens: 500,
    top_p: 0.9,
    frequency_penalty: 0.3,
    presence_penalty: 0.3,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      yield content;
    }
  }
}

export async function getChatCompletion(
  messages: ChatMessage[],
  temperature: number = 0.7
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature,
    max_tokens: 500,
    top_p: 0.9,
    frequency_penalty: 0.3,
    presence_penalty: 0.3,
  });

  return response.choices[0]?.message?.content || '';
}
