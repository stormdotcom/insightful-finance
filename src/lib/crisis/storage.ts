import type { WorkspaceStore, Workspace, ProviderConfig, PromptTemplate, AnalysisResult } from './types';
import { DEFAULT_PROVIDER_CONFIGS } from './mockData';

const STORAGE_KEY = 'crisis-planning-store';
const CURRENT_VERSION = 1;

function createEmptyStore(): WorkspaceStore {
  return {
    version: CURRENT_VERSION,
    workspaces: [],
    activeWorkspaceId: null,
    providerConfigs: DEFAULT_PROVIDER_CONFIGS,
    promptTemplates: [],
    analysisHistory: [],
  };
}

// ─── Load / Save ────────────────────────────────────────────────────────────

export function loadStore(): WorkspaceStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyStore();
    const parsed = JSON.parse(raw) as WorkspaceStore;
    // Future migrations: check parsed.version and upgrade schema here
    if (!parsed.version) return createEmptyStore();
    return {
      ...createEmptyStore(),
      ...parsed,
    };
  } catch {
    console.warn('[crisis-storage] Failed to load store, resetting.');
    return createEmptyStore();
  }
}

export function saveStore(store: WorkspaceStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('[crisis-storage] Failed to save store:', e);
  }
}

export function resetStore(): WorkspaceStore {
  localStorage.removeItem(STORAGE_KEY);
  return createEmptyStore();
}

// ─── Workspace helpers ───────────────────────────────────────────────────────

export function saveWorkspace(store: WorkspaceStore, workspace: Workspace): WorkspaceStore {
  const idx = store.workspaces.findIndex(w => w.id === workspace.id);
  const updated = { ...workspace, updatedAt: new Date().toISOString() };
  const workspaces =
    idx >= 0
      ? store.workspaces.map(w => (w.id === workspace.id ? updated : w))
      : [...store.workspaces, updated];
  return { ...store, workspaces };
}

export function deleteWorkspace(store: WorkspaceStore, workspaceId: string): WorkspaceStore {
  return {
    ...store,
    workspaces: store.workspaces.filter(w => w.id !== workspaceId),
    activeWorkspaceId:
      store.activeWorkspaceId === workspaceId ? null : store.activeWorkspaceId,
  };
}

// ─── Provider helpers ────────────────────────────────────────────────────────

export function saveProviderConfigs(
  store: WorkspaceStore,
  configs: ProviderConfig[]
): WorkspaceStore {
  return { ...store, providerConfigs: configs };
}

// ─── Template helpers ────────────────────────────────────────────────────────

export function saveUserTemplate(
  store: WorkspaceStore,
  template: PromptTemplate
): WorkspaceStore {
  const idx = store.promptTemplates.findIndex(t => t.id === template.id);
  const templates =
    idx >= 0
      ? store.promptTemplates.map(t => (t.id === template.id ? template : t))
      : [...store.promptTemplates, template];
  return { ...store, promptTemplates: templates };
}

// ─── Analysis history ────────────────────────────────────────────────────────

export function addAnalysisResult(
  store: WorkspaceStore,
  result: AnalysisResult
): WorkspaceStore {
  // Keep last 100 results
  const history = [result, ...store.analysisHistory].slice(0, 100);
  return { ...store, analysisHistory: history };
}

// ─── Export / Import ─────────────────────────────────────────────────────────

export function exportWorkspaceJSON(workspace: Workspace): string {
  return JSON.stringify({ exportedAt: new Date().toISOString(), workspace }, null, 2);
}

export function importWorkspaceJSON(json: string): Workspace {
  const parsed = JSON.parse(json);
  // Support both raw workspace and wrapped export format
  const workspace: Workspace = parsed.workspace ?? parsed;
  if (!workspace.id || !workspace.nodes || !workspace.edges) {
    throw new Error('Invalid workspace JSON format.');
  }
  return workspace;
}
