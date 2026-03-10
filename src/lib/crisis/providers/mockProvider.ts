import type {
  AIProviderAdapter,
  CrisisAnalysisParams,
  FinancePlanParams,
  GenerateOptions,
  TacticsParams,
} from './types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// Realistic mock responses used when no real provider is configured.
// Replace by wiring a real provider in index.ts.
export class MockProvider implements AIProviderAdapter {
  id = 'mock';
  name = 'Mock AI (Demo)';

  isAvailable() {
    return true;
  }

  async generateText(prompt: string, _options?: GenerateOptions): Promise<string> {
    await delay(800);
    return `**Mock Response**\n\nPrompt received (${prompt.length} chars). Configure a real AI provider in Settings → Providers to get actual analysis.\n\n_This is a demo placeholder._`;
  }

  async summarize(text: string, _options?: GenerateOptions): Promise<string> {
    await delay(600);
    const words = text.trim().split(/\s+/).slice(0, 20).join(' ');
    return `**Summary (Mock)**\n\n${words}… [truncated for demo]\n\nWire a real provider for accurate summarization.`;
  }

  async analyzeCrisis(
    { event, context, region }: CrisisAnalysisParams,
    _options?: GenerateOptions
  ): Promise<string> {
    await delay(1200);
    return `## Crisis Impact Analysis (Mock)

**Event:** ${event}
**Region:** ${region ?? 'Global'}

### 1. Immediate Impacts (0–72 hrs)
- Supply chain disruptions in energy and commodities
- Currency volatility in affected regions
- Market sentiment shift toward safe-haven assets

### 2. Short-term Impacts (1–4 weeks)
- Crude oil price spike (+10–25% estimated)
- Shipping route adjustments increasing lead times
- Retail fuel and LPG price pass-through begins

### 3. Medium-term Impacts (1–6 months)
- Grocery inflation as transport costs rise
- Industrial input cost pressure in manufacturing
- Possible central bank responses to inflation

### 4. Affected Sectors
| Sector | Risk Level |
|--------|-----------|
| Energy | 🔴 High |
| Transport | 🔴 High |
| Agriculture / Food | 🟠 Medium-High |
| Manufacturing | 🟠 Medium |
| IT / Services | 🟢 Low |

### 5. Price-sensitive Goods
Crude oil, LPG, diesel, fertilisers, wheat, edible oils

### 6. Opportunity Areas
- Energy sector equities and ETFs
- Domestic alternative energy providers
- Bulk-buy / inventory build for essential goods

### 7. Monitoring Indicators
- Brent crude spot price
- INR/USD exchange rate
- RBI policy statements
- FMCG company margin announcements

_⚠️ This is a mock demo response. Configure a real AI provider for production use._

**Context provided:** ${context.substring(0, 100)}…`;
  }

  async extractRisks(analysis: string, _options?: GenerateOptions): Promise<string> {
    await delay(900);
    return `## Risk Extraction (Mock)

| Risk | Category | Probability | Impact | Score |
|------|----------|-------------|--------|-------|
| Fuel price spike | Financial | High | High | 🔴 Critical |
| Supply chain delay | Operational | High | Medium | 🟠 High |
| INR depreciation | Financial | Medium | High | 🟠 High |
| Grocery inflation | Social | High | Medium | 🟠 High |
| Market volatility | Financial | High | Medium | 🟠 High |
| Policy uncertainty | Regulatory | Medium | Medium | 🟡 Medium |

### Early Warning Indicators
- Brent crude price crossing $100/barrel
- INR/USD rate above 87
- WPI food inflation above 8%

_⚠️ Mock response — wire a real provider for accurate risk mapping._

**Based on:** ${analysis.substring(0, 80)}…`;
  }

  async extractOpportunities(analysis: string, _options?: GenerateOptions): Promise<string> {
    await delay(900);
    return `## Opportunity Extraction (Mock)

### 1. Energy Sector Positioning
- **Why:** Supply disruption raises valuations for domestic producers
- **Time horizon:** Short to medium (1–6 months)
- **Risk level:** Medium-High
- **Monitor:** ONGC, Oil India stock prices; domestic refinery margins

### 2. Essential Goods Inventory Build
- **Why:** Price pass-through expected within 2–4 weeks
- **Time horizon:** Immediate (next 1–2 weeks)
- **Risk level:** Low
- **Monitor:** Retail pump prices; LPG cylinder costs

### 3. Alternative Energy Exposure
- **Why:** Crisis accelerates energy transition narrative
- **Time horizon:** Medium to long (3–12 months)
- **Risk level:** Medium
- **Monitor:** Solar/wind sector policy announcements

### 4. Export-Oriented IT & Services
- **Why:** INR depreciation boosts USD-revenue companies
- **Time horizon:** Short (1–3 months)
- **Risk level:** Low-Medium
- **Monitor:** USD/INR rate; IT sector guidance

_⚠️ This is research support, not investment advice._`;
  }

  async generateTactics(
    { scenario, opportunities }: TacticsParams,
    _options?: GenerateOptions
  ): Promise<string> {
    await delay(1000);
    return `## Tactical Response Plan (Mock)

**Scenario:** ${scenario.substring(0, 100)}

### Immediate Actions (72 hrs)
- [ ] Review and document current fuel/utility exposure
- [ ] Identify essential goods inventory status
- [ ] Monitor RBI and government policy announcements

### Low-cost / Low-risk Actions
- [ ] Set price alerts on key commodities (crude, LPG, edible oil)
- [ ] Audit discretionary budget for potential trimming
- [ ] Review open positions in affected sectors

### Defensive Actions
- [ ] Increase emergency cash reserve target by 10–15%
- [ ] Lock in fuel/logistics costs where contracts allow
- [ ] Reduce exposure to highly leveraged companies

### Offensive Actions (if confidence improves)
- [ ] Gradually increase energy sector allocation
- [ ] Consider bulk procurement of essentials at current prices
- [ ] Explore INR hedging for USD liabilities

### Contingency Steps
- [ ] Pre-define trigger levels (e.g., crude > $110) for escalation
- [ ] Prepare revised household budget for 15% cost increase
- [ ] Identify suppliers/vendors with pricing flexibility

### Mistakes to Avoid
- Do not panic-sell diversified assets on short-term volatility
- Avoid concentrated bets on single geopolitical outcome
- Do not delay emergency fund top-up

_⚠️ Mock response. Opportunities context: ${opportunities.substring(0, 80)}…_`;
  }

  async generateFinancePlan(
    { scenario, risks, profile }: FinancePlanParams,
    _options?: GenerateOptions
  ): Promise<string> {
    await delay(1000);
    return `## Crisis Financial Management Plan (Mock)

**Scenario:** ${scenario.substring(0, 100)}
**Profile:** ${profile ?? 'General household/individual'}

### Cash-flow Protection
- Maintain 3–6 months of expenses in liquid savings
- Prioritise paying variable-rate debt (credit cards) now
- Defer large discretionary purchases by 60–90 days

### Budget Adjustments
| Category | Action |
|----------|--------|
| Fuel / Transport | Budget +20% buffer |
| Groceries | Budget +12% buffer; bulk buy staples |
| Utilities | Budget +10% buffer |
| Discretionary | Cut by 15–20% temporarily |
| Investments | Maintain SIPs; pause lump-sum until clarity |

### Inflation-sensitive Categories
LPG, petrol/diesel, cooking oil, vegetables, packaged foods, transport

### Emergency Reserve Priority
1. 3 months of non-discretionary expenses in savings account
2. Top up only after covering minimum debt payments
3. Target 6 months if scenario escalates

### Debt Risk Notes
- Avoid new floating-rate loans during volatility
- Consider prepaying high-interest (>15%) debt if surplus available

### Procurement Timing Ideas
- Buy LPG cylinders at current rates if storage allows
- Stock 2–3 months of shelf-stable essentials now
- Defer non-essential electronics or appliance purchases

### Monitoring Checklist
**Weekly:** Fuel prices, LPG updates, grocery basket cost
**Monthly:** Budget vs actual review, net worth tracking, RBI rate decisions

_⚠️ Risk context: ${risks.substring(0, 80)}… — This is a planning framework, not financial advice._`;
  }

  async synthesizeNodes(nodeSummaries: string[], _options?: GenerateOptions): Promise<string> {
    await delay(1100);
    return `## Cross-Node Synthesis (Mock)

**Nodes analysed:** ${nodeSummaries.length}

### Common Themes
- Energy price disruption as central causal factor
- Inflation cascade affecting food, transport, and household costs
- Financial market uncertainty as secondary effect

### Contradictions / Conflicting Signals
- Some nodes suggest short-term volatility only; others indicate structural shift
- Domestic policy response is uncertain — could dampen or amplify effects

### Causal Links Identified
Energy shock → Fuel price rise → Transport cost rise → Food price inflation → Household expense pressure → Budget strain

### Strongest Signals (High Confidence)
- Short-term crude oil price increase is near-certain
- LPG and petrol retail price increases likely within 2–4 weeks

### Weak Assumptions Needing Validation
- Assumes no government subsidy intervention
- Assumes conflict escalation rather than de-escalation
- Assumes normal monsoon for food supply

### Decision Implications
- Act on defensive measures immediately (budget, reserves)
- Monitor before any offensive positioning
- Re-synthesise after 2 weeks with updated data

### New Nodes Recommended
- "Government Policy Response" node
- "Domestic Alternative Energy Update" node
- "RBI Monetary Response" node

_⚠️ Mock synthesis across ${nodeSummaries.length} nodes._`;
  }
}

export const mockProvider = new MockProvider();
