// ─── Core Node Types ────────────────────────────────────────────────────────

export type NodeType =
  | 'news'
  | 'article'
  | 'analysis'
  | 'scenario'
  | 'risk'
  | 'opportunity'
  | 'tactic'
  | 'finance'
  | 'investment'
  | 'note';

export type NodeStatus = 'draft' | 'active' | 'resolved' | 'watching' | 'archived';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type RelationType =
  | 'causes'
  | 'impacts'
  | 'mitigates'
  | 'supports'
  | 'contradicts'
  | 'related';

export type ProviderType = 'mock' | 'ollama' | 'openai' | 'gemini' | 'claude';

// ─── Node ───────────────────────────────────────────────────────────────────

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeSource {
  url?: string;
  name?: string;
  type?: 'news' | 'article' | 'report' | 'social' | 'manual' | 'ai';
  publishedAt?: string;
}

export interface AIOutput {
  id: string;
  provider: string;
  model: string;
  promptType: string;
  output: string;
  createdAt: string;
}

export interface BoardNode {
  id: string;
  type: NodeType;
  title: string;
  content: string;
  tags: string[];
  position: NodePosition;
  source?: NodeSource;
  metadata?: {
    status?: NodeStatus;
    confidence?: ConfidenceLevel;
    priority?: Priority;
    region?: string;
    category?: string;
  };
  aiOutputs?: AIOutput[];
  createdAt: string;
  updatedAt: string;
}

// ─── Edge ───────────────────────────────────────────────────────────────────

export interface BoardEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: RelationType;
  label?: string;
}

// ─── Prompt Template ────────────────────────────────────────────────────────

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  prompt: string;
  variables: string[];
  description?: string;
  providerHints?: ProviderType[];
  isBuiltIn?: boolean;
}

// ─── Provider Config ────────────────────────────────────────────────────────

export interface ProviderConfig {
  id: string;
  provider: ProviderType;
  label: string;
  baseUrl?: string;
  model: string;
  apiKey?: string;
  temperature?: number;
  enabled: boolean;
  localOnly?: boolean;
  extraSettings?: Record<string, string>;
}

// ─── Analysis Result ────────────────────────────────────────────────────────

export interface AnalysisResult {
  id: string;
  nodeId?: string;
  provider: string;
  model: string;
  promptType: string;
  output: string;
  createdAt: string;
}

// ─── News ───────────────────────────────────────────────────────────────────

export interface NewsItem {
  id: string;
  headline: string;
  summary?: string;
  url?: string;
  source?: string;
  publishedAt?: string;
  tags?: string[];
}

// ─── Workspace ──────────────────────────────────────────────────────────────

export interface WorkspaceSettings {
  defaultProvider?: string;
  autoSave?: boolean;
  gridSnap?: boolean;
  snapSize?: number;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  nodes: BoardNode[];
  edges: BoardEdge[];
  settings?: WorkspaceSettings;
  createdAt: string;
  updatedAt: string;
}

// ─── Root Store (persisted to localStorage) ─────────────────────────────────

export interface WorkspaceStore {
  version: number;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  providerConfigs: ProviderConfig[];
  promptTemplates: PromptTemplate[]; // user-customized templates only
  analysisHistory: AnalysisResult[];
}
