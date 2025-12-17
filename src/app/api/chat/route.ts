import { NextRequest } from 'next/server';
import { streamChatCompletion, ChatMessage } from '@/lib/openai';
import { celebrities } from '@/lib/celebrities';

export async function POST(req: NextRequest) {
  try {
    const { celebrityId, userMessage, conversationHistory } = await req.json();

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

    // Create readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamChatCompletion(messages)) {
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
