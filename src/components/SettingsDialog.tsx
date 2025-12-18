'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettingsStore } from '@/lib/store';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { apiSettings, setApiSettings } = useSettingsStore();
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setApiKey(apiSettings.apiKey);
    setBaseUrl(apiSettings.baseUrl || 'https://api.openai.com/v1');
  }, [apiSettings]);

  const handleSave = () => {
    setApiSettings({
      apiKey: apiKey.trim(),
      baseUrl: baseUrl.trim() || 'https://api.openai.com/v1',
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onOpenChange(false);
    }, 1500);
  };

  const handleClear = () => {
    setApiKey('');
    setBaseUrl('https://api.openai.com/v1');
    setApiSettings({
      apiKey: '',
      baseUrl: 'https://api.openai.com/v1',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>API Configuration</DialogTitle>
          <DialogDescription>
            Configure your OpenAI API credentials to use the application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseUrl">Base URL (Optional)</Label>
            <Input
              id="baseUrl"
              type="text"
              placeholder="https://api.openai.com/v1"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Use custom OpenAI-compatible endpoint. Leave default for OpenAI.
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-semibold mb-1">Security Note:</p>
                <p>
                  Your API key is stored in your browser's local storage. Never share your
                  API key. Anyone with access to your key can use your OpenAI credits.
                </p>
              </div>
            </div>
          </div>

          {saved && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex gap-2 items-center">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-800 font-medium">
                  Settings saved successfully!
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button onClick={handleSave} disabled={!apiKey.trim()}>
            Save Settings
          </Button>
        </DialogFooter>

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p className="mb-2">Don't have an API key?</p>
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Get your API key from OpenAI →
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
