import type { PromptTemplate } from './types';

// Built-in prompt templates — these are bundled with the app and cannot be deleted,
// but users can create customized copies.
export const BUILT_IN_TEMPLATES: PromptTemplate[] = [
  {
    id: 'tpl-crisis-impact',
    name: 'Crisis Impact Analysis',
    category: 'Analysis',
    description: 'Structured multi-horizon impact breakdown of a crisis event.',
    isBuiltIn: true,
    variables: ['event', 'context', 'region'],
    prompt: `Analyze the following crisis event in a structured way.
Event: {{event}}
Context: {{context}}
Region: {{region}}

Return a structured analysis covering:
1. Immediate impacts (0–72 hours)
2. Short-term impacts (1–4 weeks)
3. Medium-term impacts (1–6 months)
4. Affected sectors and supply chains
5. Price-sensitive goods and services
6. Risk level by sector (High / Medium / Low)
7. Opportunity areas that may emerge
8. Recommended monitoring indicators

Frame all outputs as research and decision-support, not guaranteed predictions.`,
    providerHints: ['openai', 'claude', 'gemini', 'ollama', 'mock'],
  },
  {
    id: 'tpl-opportunity',
    name: 'Opportunity Extraction',
    category: 'Opportunities',
    description: 'Identifies practical and ethical opportunities from a crisis analysis.',
    isBuiltIn: true,
    variables: ['analysis'],
    prompt: `Given this crisis analysis, identify practical and ethical business, supply-chain, budgeting, and investment-related opportunities.
Analysis: {{analysis}}

For each opportunity return:
- Opportunity description
- Why it may emerge from this crisis
- Time horizon (immediate / short / medium / long)
- Risk level (High / Medium / Low)
- Who benefits
- What leading indicators to monitor before acting

Note: These are research inputs, not investment advice.`,
  },
  {
    id: 'tpl-tactics',
    name: 'Tactics Generator',
    category: 'Planning',
    description: 'Generates actionable tactics from a crisis scenario and its opportunities.',
    isBuiltIn: true,
    variables: ['scenario', 'opportunities', 'constraints'],
    prompt: `Based on this crisis scenario and identified opportunities, generate actionable tactics.
Scenario: {{scenario}}
Opportunities: {{opportunities}}
Constraints: {{constraints}}

Return structured tactics:
- Immediate actions (next 72 hours)
- Low-cost / low-risk actions
- Defensive actions (protect current position)
- Offensive actions (capture opportunity)
- Contingency steps (if scenario worsens)
- Mistakes to avoid`,
  },
  {
    id: 'tpl-finance-crisis',
    name: 'Finance Management in Crisis',
    category: 'Finance',
    description: 'Crisis-focused financial management and cash-flow protection plan.',
    isBuiltIn: true,
    variables: ['scenario', 'risks', 'profile'],
    prompt: `Create a crisis-focused financial management plan.
Scenario: {{scenario}}
Current risks: {{risks}}
Household/business profile: {{profile}}

Return a structured plan covering:
- Cash-flow protection steps
- Budget adjustment ideas
- Inflation-sensitive spending categories to watch
- Emergency reserve priorities
- Debt-risk notes and timing
- Procurement timing ideas (buy ahead / defer)
- Monitoring checklist (weekly / monthly)

This is a planning framework, not personalised financial advice.`,
  },
  {
    id: 'tpl-investment-research',
    name: 'Investment Research Support',
    category: 'Investment',
    description: 'Research-oriented scenario analysis for investment decision support.',
    isBuiltIn: true,
    variables: ['scenario', 'assets'],
    prompt: `Provide a research-oriented investment analysis for the scenario below.
Scenario: {{scenario}}
Assets / Sectors to evaluate: {{assets}}

Requirements:
- Do not present any certainty or guarantees
- Highlight both upside and downside
- Explain key macro drivers
- Mention timing sensitivity
- State what evidence would confirm or invalidate the thesis

Return:
- Core thesis
- Counter-thesis
- Sectors / assets potentially affected
- Leading indicators to track
- Major risks
- Research gaps remaining
- Cautious next-step actions

⚠️ This output is for research and decision-support only, not financial advice.`,
  },
  {
    id: 'tpl-synthesis',
    name: 'Cross-Node Synthesis',
    category: 'Analysis',
    description: 'Synthesizes insights across multiple connected nodes on the board.',
    isBuiltIn: true,
    variables: ['nodes'],
    prompt: `Synthesize insights across the following connected research nodes.
Nodes:
{{nodes}}

Return:
- Common themes
- Contradictions or conflicting signals
- Causal links identified
- Strongest signals (high confidence)
- Weak assumptions that need validation
- Decision implications
- New nodes that should be created to fill gaps`,
  },
  {
    id: 'tpl-risk-mapping',
    name: 'Risk Mapping',
    category: 'Risk',
    description: 'Maps and scores risks across dimensions for a given scenario.',
    isBuiltIn: true,
    variables: ['scenario', 'context'],
    prompt: `Map all identified risks for the following scenario.
Scenario: {{scenario}}
Context: {{context}}

For each risk return:
- Risk name
- Category (financial / operational / geopolitical / supply-chain / regulatory / reputational)
- Probability (High / Medium / Low)
- Impact (High / Medium / Low)
- Risk score (Probability × Impact: Critical / High / Medium / Low)
- Time to materialize
- Early warning indicators
- Mitigation options`,
  },
  {
    id: 'tpl-research-gaps',
    name: 'Research Gap Detection',
    category: 'Analysis',
    description: 'Identifies missing information and research gaps in a workspace.',
    isBuiltIn: true,
    variables: ['analysis', 'nodes'],
    prompt: `Review the following analysis and node summaries to detect research gaps.
Analysis: {{analysis}}
Existing nodes: {{nodes}}

Return:
- Missing data points that would materially change the analysis
- Assumptions that are currently unvalidated
- Counterarguments not yet explored
- Sectors or regions not yet covered
- Recommended next research actions (ordered by priority)
- Suggested node types to add to the board`,
  },
];

/** Interpolate template variables. Replaces {{variable}} with provided values. */
export function interpolateTemplate(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? `[${key}]`);
}

/** Get all templates including user-customized ones merged with built-ins. */
export function getAllTemplates(userTemplates: PromptTemplate[]): PromptTemplate[] {
  return [...BUILT_IN_TEMPLATES, ...userTemplates];
}
