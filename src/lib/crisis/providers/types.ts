// Provider adapter interface — implement this to add a new AI provider.
// All methods return plain strings (markdown or structured text).

export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface CrisisAnalysisParams {
  event: string;
  context: string;
  region?: string;
}

export interface TacticsParams {
  scenario: string;
  opportunities: string;
  constraints?: string;
}

export interface FinancePlanParams {
  scenario: string;
  risks: string;
  profile?: string;
}

export interface InvestmentResearchParams {
  scenario: string;
  assets: string;
}

export interface AIProviderAdapter {
  id: string;
  name: string;
  /** Quick health check — does not make a network call for mock/local providers. */
  isAvailable(): boolean;
  generateText(prompt: string, options?: GenerateOptions): Promise<string>;
  summarize(text: string, options?: GenerateOptions): Promise<string>;
  analyzeCrisis(params: CrisisAnalysisParams, options?: GenerateOptions): Promise<string>;
  extractRisks(analysis: string, options?: GenerateOptions): Promise<string>;
  extractOpportunities(analysis: string, options?: GenerateOptions): Promise<string>;
  generateTactics(params: TacticsParams, options?: GenerateOptions): Promise<string>;
  generateFinancePlan(params: FinancePlanParams, options?: GenerateOptions): Promise<string>;
  synthesizeNodes(nodeSummaries: string[], options?: GenerateOptions): Promise<string>;
}

export type AIAction =
  | 'analyze'
  | 'summarize'
  | 'extractRisks'
  | 'extractOpportunities'
  | 'generateTactics'
  | 'generateFinancePlan'
  | 'synthesize';
