import type { AIProviderAdapter, GenerateOptions } from './types';
import { mockProvider } from './mockProvider';
import type { ProviderConfig } from '../types';

// ─── Registry ────────────────────────────────────────────────────────────────

const adapterRegistry: Map<string, AIProviderAdapter> = new Map([
  ['mock', mockProvider],
]);

/**
 * Build and register a provider adapter from a saved config.
 * Extend this function to support new providers.
 */
export function buildAdapter(config: ProviderConfig): AIProviderAdapter {
  switch (config.provider) {
    case 'mock':
      return mockProvider;

    case 'ollama':
      return buildOllamaAdapter(config);

    case 'openai':
      return buildOpenAIAdapter(config);

    case 'gemini':
      return buildGeminiAdapter(config);

    case 'claude':
      return buildClaudeAdapter(config);

    default:
      console.warn(`Unknown provider type "${config.provider}", falling back to mock.`);
      return mockProvider;
  }
}

/** Get the active adapter from a list of configs, falling back to mock. */
export function getActiveAdapter(configs: ProviderConfig[]): AIProviderAdapter {
  const enabled = configs.find(c => c.enabled);
  if (!enabled) return mockProvider;
  const cached = adapterRegistry.get(enabled.id);
  if (cached) return cached;
  const adapter = buildAdapter(enabled);
  adapterRegistry.set(enabled.id, adapter);
  return adapter;
}

// ─── Ollama Adapter ──────────────────────────────────────────────────────────

function buildOllamaAdapter(config: ProviderConfig): AIProviderAdapter {
  const baseUrl = config.baseUrl ?? 'http://localhost:11434';
  const model = config.model ?? 'llama3';

  const post = async (prompt: string, options?: GenerateOptions): Promise<string> => {
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options?.model ?? model,
        prompt,
        stream: false,
        options: { temperature: options?.temperature ?? config.temperature ?? 0.7 },
      }),
    });
    if (!res.ok) throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.response ?? '';
  };

  return {
    id: config.id,
    name: config.label,
    isAvailable: () => true, // availability checked at call time
    generateText: (p, o) => post(p, o),
    summarize: (text, o) => post(`Summarize the following concisely:\n\n${text}`, o),
    analyzeCrisis: ({ event, context, region }, o) =>
      post(`Analyze this crisis:\nEvent: ${event}\nContext: ${context}\nRegion: ${region ?? 'Global'}\n\nProvide structured impact analysis.`, o),
    extractRisks: (analysis, o) => post(`Extract and categorize all risks from:\n\n${analysis}`, o),
    extractOpportunities: (analysis, o) => post(`Identify opportunities emerging from:\n\n${analysis}`, o),
    generateTactics: ({ scenario, opportunities, constraints }, o) =>
      post(`Generate tactical response plan.\nScenario: ${scenario}\nOpportunities: ${opportunities}\nConstraints: ${constraints ?? 'None'}`, o),
    generateFinancePlan: ({ scenario, risks, profile }, o) =>
      post(`Generate crisis financial plan.\nScenario: ${scenario}\nRisks: ${risks}\nProfile: ${profile ?? 'General'}`, o),
    synthesizeNodes: (nodes, o) =>
      post(`Synthesize insights across these research nodes:\n\n${nodes.join('\n---\n')}`, o),
  };
}

// ─── OpenAI Adapter ──────────────────────────────────────────────────────────

function buildOpenAIAdapter(config: ProviderConfig): AIProviderAdapter {
  const baseUrl = config.baseUrl ?? 'https://api.openai.com/v1';
  const model = config.model ?? 'gpt-4o';

  const chat = async (prompt: string, options?: GenerateOptions): Promise<string> => {
    if (!config.apiKey) throw new Error('OpenAI API key not configured.');
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model ?? model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? config.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI error: ${res.status} — ${err}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
  };

  return {
    id: config.id,
    name: config.label,
    isAvailable: () => !!config.apiKey,
    generateText: chat,
    summarize: (text, o) => chat(`Summarize concisely:\n\n${text}`, o),
    analyzeCrisis: ({ event, context, region }, o) =>
      chat(`Analyze crisis.\nEvent: ${event}\nContext: ${context}\nRegion: ${region ?? 'Global'}`, o),
    extractRisks: (a, o) => chat(`Extract risks from:\n\n${a}`, o),
    extractOpportunities: (a, o) => chat(`Identify opportunities from:\n\n${a}`, o),
    generateTactics: ({ scenario, opportunities, constraints }, o) =>
      chat(`Tactical plan.\nScenario: ${scenario}\nOpportunities: ${opportunities}\nConstraints: ${constraints ?? 'None'}`, o),
    generateFinancePlan: ({ scenario, risks, profile }, o) =>
      chat(`Crisis finance plan.\nScenario: ${scenario}\nRisks: ${risks}\nProfile: ${profile ?? 'General'}`, o),
    synthesizeNodes: (nodes, o) => chat(`Synthesize nodes:\n\n${nodes.join('\n---\n')}`, o),
  };
}

// ─── Gemini Adapter ──────────────────────────────────────────────────────────

function buildGeminiAdapter(config: ProviderConfig): AIProviderAdapter {
  const model = config.model ?? 'gemini-1.5-pro';

  const generate = async (prompt: string, options?: GenerateOptions): Promise<string> => {
    if (!config.apiKey) throw new Error('Gemini API key not configured.');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${options?.model ?? model}:generateContent?key=${config.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options?.temperature ?? config.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? 2000,
        },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini error: ${res.status} — ${err}`);
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  };

  return {
    id: config.id,
    name: config.label,
    isAvailable: () => !!config.apiKey,
    generateText: generate,
    summarize: (text, o) => generate(`Summarize:\n\n${text}`, o),
    analyzeCrisis: ({ event, context, region }, o) =>
      generate(`Analyze crisis. Event: ${event}. Context: ${context}. Region: ${region ?? 'Global'}`, o),
    extractRisks: (a, o) => generate(`Extract risks:\n\n${a}`, o),
    extractOpportunities: (a, o) => generate(`Opportunities:\n\n${a}`, o),
    generateTactics: ({ scenario, opportunities, constraints }, o) =>
      generate(`Tactics. Scenario: ${scenario}. Opportunities: ${opportunities}. Constraints: ${constraints ?? 'None'}`, o),
    generateFinancePlan: ({ scenario, risks, profile }, o) =>
      generate(`Finance plan. Scenario: ${scenario}. Risks: ${risks}. Profile: ${profile ?? 'General'}`, o),
    synthesizeNodes: (nodes, o) => generate(`Synthesize:\n\n${nodes.join('\n---\n')}`, o),
  };
}

// ─── Claude (Anthropic) Adapter ───────────────────────────────────────────────

function buildClaudeAdapter(config: ProviderConfig): AIProviderAdapter {
  const model = config.model ?? 'claude-sonnet-4-6';

  const message = async (prompt: string, options?: GenerateOptions): Promise<string> => {
    if (!config.apiKey) throw new Error('Anthropic API key not configured.');
    // Note: Direct browser calls to Anthropic API require CORS headers or a proxy.
    // Recommended: route through your own backend endpoint.
    const baseUrl = config.baseUrl ?? '/api/claude-proxy';
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: options?.model ?? model,
        max_tokens: options?.maxTokens ?? 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Claude error: ${res.status} — ${err}`);
    }
    const data = await res.json();
    return data.content?.[0]?.text ?? '';
  };

  return {
    id: config.id,
    name: config.label,
    isAvailable: () => !!config.apiKey,
    generateText: message,
    summarize: (text, o) => message(`Summarize concisely:\n\n${text}`, o),
    analyzeCrisis: ({ event, context, region }, o) =>
      message(`Analyze crisis.\nEvent: ${event}\nContext: ${context}\nRegion: ${region ?? 'Global'}`, o),
    extractRisks: (a, o) => message(`Extract and categorize risks:\n\n${a}`, o),
    extractOpportunities: (a, o) => message(`Identify opportunities:\n\n${a}`, o),
    generateTactics: ({ scenario, opportunities, constraints }, o) =>
      message(`Tactical plan.\nScenario: ${scenario}\nOpportunities: ${opportunities}\nConstraints: ${constraints ?? 'None'}`, o),
    generateFinancePlan: ({ scenario, risks, profile }, o) =>
      message(`Crisis finance plan.\nScenario: ${scenario}\nRisks: ${risks}\nProfile: ${profile ?? 'General'}`, o),
    synthesizeNodes: (nodes, o) => message(`Synthesize nodes:\n\n${nodes.join('\n---\n')}`, o),
  };
}

export type { AIProviderAdapter, GenerateOptions };
