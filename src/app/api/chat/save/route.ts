import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { celebrityId, messages } = await req.json();

    // Find or create user
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      create: {
        email: session.user.email,
        name: session.user.name || null,
        image: session.user.image || null,
      },
      update: {},
    });

    // Create chat session
    const chatSession = await prisma.chatSession.create({
      data: {
        userId: user.id,
        celebrityId,
        messageCount: messages.length,
        messages: {
          create: messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
            tokens: msg.tokens || null,
          })),
        },
      },
    });

    return NextResponse.json({ sessionId: chatSession.id });
  } catch (error) {
    console.error('Save chat error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
