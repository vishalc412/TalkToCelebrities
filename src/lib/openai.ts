import OpenAI from 'openai';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Create OpenAI client with custom or default credentials
function createOpenAIClient(apiKey?: string, baseUrl?: string) {
  return new OpenAI({
    apiKey: apiKey || process.env.OPENAI_API_KEY,
    baseURL: baseUrl || undefined,
    dangerouslyAllowBrowser: false, // Server-side only
  });
}

export async function* streamChatCompletion(
  messages: ChatMessage[],
  temperature: number = 0.7,
  apiKey?: string,
  baseUrl?: string
) {
  const openai = createOpenAIClient(apiKey, baseUrl);

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
  temperature: number = 0.7,
  apiKey?: string,
  baseUrl?: string
): Promise<string> {
  const openai = createOpenAIClient(apiKey, baseUrl);

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
