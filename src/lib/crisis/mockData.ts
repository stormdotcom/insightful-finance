import type { BoardNode, BoardEdge, Workspace, ProviderConfig, NewsItem } from './types';

// ─── Default Provider Configs ────────────────────────────────────────────────

export const DEFAULT_PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    id: 'provider-mock',
    provider: 'mock',
    label: 'Mock AI (Demo)',
    model: 'mock-v1',
    enabled: true,
    localOnly: true,
  },
  {
    id: 'provider-ollama',
    provider: 'ollama',
    label: 'Ollama (Local)',
    baseUrl: 'http://localhost:11434',
    model: 'llama3',
    temperature: 0.7,
    enabled: false,
    localOnly: true,
  },
  {
    id: 'provider-openai',
    provider: 'openai',
    label: 'OpenAI',
    model: 'gpt-4o',
    temperature: 0.7,
    enabled: false,
  },
  {
    id: 'provider-gemini',
    provider: 'gemini',
    label: 'Google Gemini',
    model: 'gemini-1.5-pro',
    temperature: 0.7,
    enabled: false,
  },
  {
    id: 'provider-claude',
    provider: 'claude',
    label: 'Claude (Anthropic)',
    model: 'claude-sonnet-4-6',
    baseUrl: '/api/claude-proxy',
    temperature: 0.7,
    enabled: false,
  },
];

// ─── Demo Scenario Seed Data ─────────────────────────────────────────────────
// Scenario: Iran–US Geopolitical Tension

const now = () => new Date().toISOString();

export const DEMO_NODES: BoardNode[] = [
  {
    id: 'node-1',
    type: 'scenario',
    title: 'Iran–US Geopolitical Tension',
    content:
      'Escalating military and diplomatic tensions between Iran and the United States. Includes naval confrontations in the Strait of Hormuz and diplomatic breakdowns. ~21 million barrels/day transit the strait — any blockade would trigger a global energy crisis.',
    tags: ['geopolitics', 'iran', 'us', 'middle-east'],
    position: { x: 340, y: 80 },
    metadata: { status: 'active', priority: 'critical', confidence: 'high', region: 'Middle East' },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'node-2',
    type: 'news',
    title: 'Strait of Hormuz Tensions Escalate',
    content:
      'Iranian naval forces increased presence in the Strait of Hormuz following US aircraft carrier deployment. Oil tanker traffic reported disrupted with delays of 3–5 days.',
    tags: ['hormuz', 'oil', 'navy'],
    position: { x: 60, y: 260 },
    source: {
      url: 'https://example.com/news/hormuz',
      name: 'Reuters (Mock)',
      type: 'news',
      publishedAt: '2026-03-10',
    },
    metadata: { status: 'active', confidence: 'high' },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'node-3',
    type: 'analysis',
    title: 'Crude Oil Supply Concern',
    content:
      'Brent crude rose 8% in the past week on supply disruption fears. Analysts estimate a full Hormuz blockade would push Brent to $130–150/barrel within 30 days. India imports ~85% of crude — direct macro risk.',
    tags: ['crude', 'brent', 'oil-price', 'india'],
    position: { x: 340, y: 280 },
    metadata: { status: 'active', confidence: 'high', priority: 'critical' },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'node-4',
    type: 'risk',
    title: 'Fuel & LPG Price Surge',
    content:
      'Domestic petrol, diesel, and LPG prices expected to rise 10–20% within 2–4 weeks of sustained oil price increase. Government subsidy buffer is limited post-2023 rationalization. Household monthly fuel cost could rise ₹800–₹1,500.',
    tags: ['lpg', 'fuel', 'inflation', 'household'],
    position: { x: 620, y: 260 },
    metadata: { status: 'watching', confidence: 'high', priority: 'high' },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'node-5',
    type: 'risk',
    title: 'Grocery & Transport Inflation',
    content:
      'Higher diesel costs feed directly into food supply chain: cold storage, freight, and distribution costs rise. Vegetables +8–12%, packaged goods +5–8%, edible oils +10–15% likely within 4–6 weeks.',
    tags: ['inflation', 'grocery', 'food', 'transport'],
    position: { x: 620, y: 420 },
    metadata: { status: 'watching', confidence: 'medium', priority: 'high' },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'node-6',
    type: 'opportunity',
    title: 'Energy Sector Positioning',
    content:
      'Domestic energy producers (ONGC, Oil India, GAIL) and refinery stocks benefit from higher crude prices. International crude exposure via ETFs could hedge the portfolio. Monitor for 3–6 month time horizon.',
    tags: ['energy', 'stocks', 'ongc', 'hedging'],
    position: { x: 60, y: 460 },
    metadata: { status: 'draft', confidence: 'medium', priority: 'medium' },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'node-7',
    type: 'opportunity',
    title: 'Essentials Inventory Timing',
    content:
      'Buy-ahead opportunity for shelf-stable essentials: edible oil, pulses, LPG cylinders, packaged foods. Price pass-through lag is typically 2–4 weeks from crude price change to retail shelf. Act within 10–14 days.',
    tags: ['procurement', 'inflation-hedge', 'essentials'],
    position: { x: 340, y: 480 },
    metadata: { status: 'active', confidence: 'high', priority: 'high' },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'node-8',
    type: 'tactic',
    title: 'Monitor Oil Benchmarks Weekly',
    content:
      'Set up weekly tracking: Brent crude spot price, INR/USD rate, WPI inflation, RBI policy signals. Escalation trigger: Brent > $110 → activate emergency budget protocol.',
    tags: ['monitoring', 'tracking', 'triggers'],
    position: { x: 620, y: 80 },
    metadata: { status: 'active', confidence: 'high', priority: 'medium' },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'node-9',
    type: 'finance',
    title: 'Emergency Budget Adjustment Plan',
    content:
      'Revise monthly household budget for crisis scenario:\n• Fuel/transport: +₹1,500\n• Groceries: +₹1,200\n• LPG: +₹400\n• Offset: cut discretionary spend (dining, shopping) by ₹2,000\n• Net impact: +₹1,100/month\n• Increase emergency fund by ₹5,000 this month.',
    tags: ['budget', 'household', 'emergency-fund'],
    position: { x: 60, y: 640 },
    metadata: { status: 'active', confidence: 'high', priority: 'high' },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'node-10',
    type: 'investment',
    title: 'Scenario-Sensitive Sectors to Watch',
    content:
      'Research note (not advice):\n• Bearish: Aviation, logistics, paint companies (crude input)\n• Bullish: ONGC, Oil India, GAIL, solar/wind EPC companies\n• Neutral-watch: FMCG with pricing power, IT (INR depreciation benefit)\n\nThesis invalidation: rapid diplomatic resolution or RBI emergency rate cut.',
    tags: ['investment-research', 'sectors', 'india'],
    position: { x: 340, y: 640 },
    metadata: { status: 'draft', confidence: 'medium', priority: 'medium' },
    createdAt: now(),
    updatedAt: now(),
  },
];

export const DEMO_EDGES: BoardEdge[] = [
  { id: 'e-1-2', sourceNodeId: 'node-1', targetNodeId: 'node-2', relationType: 'related', label: 'triggered by' },
  { id: 'e-1-3', sourceNodeId: 'node-1', targetNodeId: 'node-3', relationType: 'causes', label: 'causes' },
  { id: 'e-2-3', sourceNodeId: 'node-2', targetNodeId: 'node-3', relationType: 'supports', label: 'supports' },
  { id: 'e-3-4', sourceNodeId: 'node-3', targetNodeId: 'node-4', relationType: 'causes', label: 'causes' },
  { id: 'e-4-5', sourceNodeId: 'node-4', targetNodeId: 'node-5', relationType: 'causes', label: 'causes' },
  { id: 'e-3-6', sourceNodeId: 'node-3', targetNodeId: 'node-6', relationType: 'related', label: 'opportunity' },
  { id: 'e-5-7', sourceNodeId: 'node-5', targetNodeId: 'node-7', relationType: 'related', label: 'prompts' },
  { id: 'e-3-8', sourceNodeId: 'node-3', targetNodeId: 'node-8', relationType: 'related', label: 'monitor' },
  { id: 'e-5-9', sourceNodeId: 'node-5', targetNodeId: 'node-9', relationType: 'impacts', label: 'informs' },
  { id: 'e-6-10', sourceNodeId: 'node-6', targetNodeId: 'node-10', relationType: 'related', label: 'research' },
];

export function createDemoWorkspace(): Workspace {
  return {
    id: 'workspace-demo',
    name: 'Iran–US Crisis Analysis',
    description:
      'Geopolitical tension scenario mapping: oil supply shock, inflation cascade, household financial impact, and investment research.',
    nodes: DEMO_NODES,
    edges: DEMO_EDGES,
    settings: { autoSave: true, gridSnap: false },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ─── Mock News Feed ──────────────────────────────────────────────────────────

export const MOCK_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    headline: 'Iran Threatens to Close Strait of Hormuz Amid US Sanctions Escalation',
    summary: 'Iranian officials issued fresh warnings to close the critical oil chokepoint following new US economic sanctions targeting the Iranian oil sector.',
    source: 'Reuters (Mock)',
    publishedAt: '2026-03-11',
    tags: ['iran', 'hormuz', 'oil', 'sanctions'],
  },
  {
    id: 'news-2',
    headline: 'Brent Crude Rises 6% on Middle East Supply Fears',
    summary: 'Oil markets reacted sharply to geopolitical developments, with Brent crude crossing $98/barrel for the first time since 2023.',
    source: 'Bloomberg (Mock)',
    publishedAt: '2026-03-10',
    tags: ['brent', 'crude', 'oil-price'],
  },
  {
    id: 'news-3',
    headline: 'India Plans Emergency Oil Reserves Activation',
    summary: 'The Indian government activated strategic petroleum reserves protocols and engaged alternative suppliers in Russia and UAE ahead of potential supply disruption.',
    source: 'Economic Times (Mock)',
    publishedAt: '2026-03-10',
    tags: ['india', 'oil-reserves', 'strategy'],
  },
  {
    id: 'news-4',
    headline: 'Petrol and Diesel Price Hike Expected Within 2 Weeks, Say Analysts',
    summary: 'Fuel retailers and industry analysts project domestic petrol price increases of ₹5–8/litre within the next fortnight if crude holds above $95.',
    source: 'Mint (Mock)',
    publishedAt: '2026-03-09',
    tags: ['petrol', 'diesel', 'india', 'inflation'],
  },
  {
    id: 'news-5',
    headline: 'ONGC, Oil India Shares Surge 4% on Crude Price Rally',
    summary: 'Domestic energy stocks rallied as investors positioned for higher realizations from rising crude prices, with ONGC up 4.2% and Oil India up 3.8%.',
    source: 'Business Standard (Mock)',
    publishedAt: '2026-03-11',
    tags: ['ongc', 'oil-india', 'stocks', 'energy'],
  },
  {
    id: 'news-6',
    headline: 'G7 Nations Call for De-escalation in Strait of Hormuz',
    summary: 'G7 foreign ministers issued a joint statement urging restraint and calling for diplomatic resolution, though analysts remain cautious given past precedent.',
    source: 'AP News (Mock)',
    publishedAt: '2026-03-11',
    tags: ['g7', 'diplomacy', 'de-escalation'],
  },
];
