import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApiSettings {
  apiKey: string;
  baseUrl: string;
}

interface SettingsStore {
  apiSettings: ApiSettings;
  setApiSettings: (settings: Partial<ApiSettings>) => void;
  hasApiKey: () => boolean;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      apiSettings: {
        apiKey: '',
        baseUrl: 'https://api.openai.com/v1',
      },
      setApiSettings: (settings) =>
        set((state) => ({
          apiSettings: { ...state.apiSettings, ...settings },
        })),
      hasApiKey: () => {
        const { apiSettings } = get();
        return apiSettings.apiKey.trim().length > 0;
      },
    }),
    {
      name: 'celebrity-chat-settings',
    }
  )
);
