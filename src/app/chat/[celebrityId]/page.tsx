import { notFound } from 'next/navigation';
import { celebrities } from '@/lib/celebrities';
import ChatInterface from '@/components/ChatInterface';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ChatPage({
  params,
}: {
  params: { celebrityId: string };
}) {
  const celebrity = celebrities.find(c => c.id === params.celebrityId);

  if (!celebrity) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Celebrities
        </Link>

        <ChatInterface
          celebrity={{
            id: celebrity.id,
            name: celebrity.name,
            imageUrl: celebrity.imageUrl,
          }}
        />
      </div>
    </div>
  );
}
