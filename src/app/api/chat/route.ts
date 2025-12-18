import { NextRequest } from 'next/server';
import { streamChatCompletion, ChatMessage } from '@/lib/openai';
import { celebrities } from '@/lib/celebrities';

export async function POST(req: NextRequest) {
  try {
    const { celebrityId, userMessage, conversationHistory, apiKey, baseUrl } = await req.json();

    // Find celebrity
    const celebrity = celebrities.find(c => c.id === celebrityId);
    if (!celebrity) {
      return new Response('Celebrity not found', { status: 404 });
    }

    // Build messages array
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: celebrity.systemPrompt,
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user',
        content: userMessage,
      },
    ];

    // Validate API key (from request or environment)
    const finalApiKey = apiKey || process.env.OPENAI_API_KEY;
    if (!finalApiKey) {
      return new Response('API key not configured. Please set your OpenAI API key in settings.', { status: 401 });
    }

    // Create readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamChatCompletion(messages, 0.7, finalApiKey, baseUrl)) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
