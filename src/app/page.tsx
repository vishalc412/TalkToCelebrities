'use client';

import { useState } from 'react';
import CelebrityGrid from '@/components/CelebrityGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import SettingsDialog from '@/components/SettingsDialog';

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header with Settings */}
      <div className="container mx-auto px-4 pt-8">
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => setSettingsOpen(true)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            API Settings
          </Button>
        </div>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Talk to Celebrities
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have authentic conversations with legendary personalities.
            Experience their unique speaking style, wisdom, and perspective.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="#celebrities">
              <Button size="lg">Start Chatting</Button>
            </Link>
          </div>
        </div>

        {/* Celebrity Grid */}
        <div id="celebrities">
          <h2 className="text-3xl font-bold text-center mb-8">
            Choose Your Celebrity
          </h2>
          <CelebrityGrid />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Powered by AI • For entertainment and educational purposes</p>
        </div>
      </footer>
    </div>
  );
}
