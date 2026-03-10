import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ProviderConfig, ProviderType } from '@/lib/crisis/types';
import { Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

const PROVIDER_INFO: Record<ProviderType, { label: string; icon: string; notes: string; hasBaseUrl: boolean; hasApiKey: boolean }> = {
  mock: {
    label: 'Mock AI (Demo)',
    icon: '🤖',
    notes: 'Built-in mock responses for testing. No API key required.',
    hasBaseUrl: false,
    hasApiKey: false,
  },
  ollama: {
    label: 'Ollama (Local)',
    icon: '🦙',
    notes: 'Runs local LLMs. Start Ollama at localhost:11434 before use.',
    hasBaseUrl: true,
    hasApiKey: false,
  },
  openai: {
    label: 'OpenAI',
    icon: '🟢',
    notes: 'Uses the OpenAI Chat Completions API. Requires an API key.',
    hasBaseUrl: false,
    hasApiKey: true,
  },
  gemini: {
    label: 'Google Gemini',
    icon: '💎',
    notes: 'Uses Gemini API. Requires a Google AI Studio API key.',
    hasBaseUrl: false,
    hasApiKey: true,
  },
  claude: {
    label: 'Claude (Anthropic)',
    icon: '🧠',
    notes: 'Direct API calls require a proxy to avoid CORS. Set baseUrl to your backend proxy.',
    hasBaseUrl: true,
    hasApiKey: true,
  },
};

interface Props {
  open: boolean;
  onClose: () => void;
  configs: ProviderConfig[];
  onSave: (configs: ProviderConfig[]) => void;
}

export function ProviderConfigDialog({ open, onClose, configs, onSave }: Props) {
  const [localConfigs, setLocalConfigs] = useState<ProviderConfig[]>(() =>
    configs.map(c => ({ ...c }))
  );
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const updateConfig = (id: string, updates: Partial<ProviderConfig>) => {
    setLocalConfigs(cs => cs.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const setEnabled = (id: string) => {
    // Only one provider can be active at a time
    setLocalConfigs(cs => cs.map(c => ({ ...c, enabled: c.id === id })));
  };

  const handleSave = () => {
    onSave(localConfigs);
    onClose();
  };

  const toggleShowKey = (id: string) => {
    setShowKeys(s => ({ ...s, [id]: !s[id] }));
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>AI Provider Configuration</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Configure AI providers for crisis analysis. API keys are stored locally in your browser only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {localConfigs.map(config => {
            const info = PROVIDER_INFO[config.provider];
            return (
              <div
                key={config.id}
                className={cn(
                  'border rounded-xl p-3 space-y-3 transition-colors',
                  config.enabled
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border/50 bg-secondary/20'
                )}
              >
                {/* Header */}
                <div className="flex items-center gap-2">
                  <span className="text-xl">{info.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{info.label}</p>
                      {config.enabled && (
                        <span className="flex items-center gap-0.5 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                          <Check className="h-2.5 w-2.5" /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{info.notes}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={config.enabled ? 'default' : 'outline'}
                    className="h-7 text-xs shrink-0"
                    onClick={() => setEnabled(config.id)}
                  >
                    {config.enabled ? 'Active' : 'Set Active'}
                  </Button>
                </div>

                {/* Model */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Model</Label>
                    <Input
                      value={config.model}
                      onChange={e => updateConfig(config.id, { model: e.target.value })}
                      className="mt-1 h-7 text-xs"
                      placeholder="e.g. gpt-4o, llama3, gemini-1.5-pro"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Temperature</Label>
                    <Input
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={config.temperature ?? 0.7}
                      onChange={e => updateConfig(config.id, { temperature: parseFloat(e.target.value) })}
                      className="mt-1 h-7 text-xs"
                    />
                  </div>
                </div>

                {/* Base URL */}
                {info.hasBaseUrl && (
                  <div>
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Base URL</Label>
                    <Input
                      value={config.baseUrl ?? ''}
                      onChange={e => updateConfig(config.id, { baseUrl: e.target.value })}
                      className="mt-1 h-7 text-xs"
                      placeholder={config.provider === 'ollama' ? 'http://localhost:11434' : '/api/claude-proxy'}
                    />
                  </div>
                )}

                {/* API Key */}
                {info.hasApiKey && (
                  <div>
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">API Key</Label>
                    <div className="mt-1 relative">
                      <Input
                        type={showKeys[config.id] ? 'text' : 'password'}
                        value={config.apiKey ?? ''}
                        onChange={e => updateConfig(config.id, { apiKey: e.target.value })}
                        className="h-7 text-xs pr-8"
                        placeholder="sk-…"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey(config.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showKeys[config.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-1 flex items-center gap-1">
                      <AlertCircle className="h-2.5 w-2.5 shrink-0" />
                      Stored only in localStorage. Never sent to our servers.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSave}>Save Configuration</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
