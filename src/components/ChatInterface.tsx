'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSettingsStore } from '@/lib/store';
import SettingsDialog from './SettingsDialog';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  celebrity: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

export default function ChatInterface({ celebrity }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { apiSettings, hasApiKey } = useSettingsStore();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Check if API key is configured
    if (!hasApiKey()) {
      setSettingsOpen(true);
      alert('Please configure your OpenAI API key in settings first.');
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          celebrityId: celebrity.id,
          userMessage: input,
          conversationHistory: messages,
          apiKey: apiSettings.apiKey,
          baseUrl: apiSettings.baseUrl,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullMessage = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullMessage += chunk;
        setStreamingMessage(fullMessage);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullMessage }]);
      setStreamingMessage('');
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Failed to send message. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={celebrity.imageUrl} alt={celebrity.name} />
            <AvatarFallback>{celebrity.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold">{celebrity.name}</h2>
            <p className="text-sm text-gray-500">
              {isLoading ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSettingsOpen(true)}
          title="API Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-gray-50">
        <div ref={scrollRef} className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              <p className="text-lg">Start a conversation with {celebrity.name}</p>
              <p className="text-sm mt-2">Try asking about their work, experiences, or views!</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <ReactMarkdown className="prose prose-sm max-w-none">
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Streaming message */}
          {streamingMessage && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-white text-gray-900 border">
                <ReactMarkdown className="prose prose-sm max-w-none">
                  {streamingMessage}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${celebrity.name}...`}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
