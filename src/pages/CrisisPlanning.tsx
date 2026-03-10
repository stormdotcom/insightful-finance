import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import type {
  Workspace, BoardNode, BoardEdge, NodeType,
  ProviderConfig, PromptTemplate, AnalysisResult,
  RelationType, NewsItem, AIOutput,
} from '@/lib/crisis/types';
import {
  loadStore, saveStore, saveWorkspace, saveProviderConfigs,
  exportWorkspaceJSON, importWorkspaceJSON, addAnalysisResult,
} from '@/lib/crisis/storage';
import { createDemoWorkspace } from '@/lib/crisis/mockData';
import { getActiveAdapter } from '@/lib/crisis/providers';
import { newsItemToNode } from '@/lib/crisis/newsService';
import { WhiteboardCanvas } from '@/components/crisis/WhiteboardCanvas';
import { NodeDetailPanel } from '@/components/crisis/NodeDetailPanel';
import type { AIActionType } from '@/components/crisis/NodeDetailPanel';
import { LeftSidebar } from '@/components/crisis/LeftSidebar';
import { NewsFeedPanel } from '@/components/crisis/NewsFeedPanel';
import { CrisisTopBar } from '@/components/crisis/CrisisTopBar';
import { ProviderConfigDialog } from '@/components/crisis/ProviderConfigDialog';
import { TemplateRunDialog } from '@/components/crisis/TemplateRunDialog';

// Unique ID generator
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

type SaveStatus = 'saved' | 'unsaved' | 'saving';

interface FilterState {
  types: Set<NodeType>;
  tags: Set<string>;
}

export default function CrisisPlanning() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [providerConfigs, setProviderConfigs] = useState<ProviderConfig[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [isNewsFeedOpen, setIsNewsFeedOpen] = useState(false);
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
  const [runningTemplate, setRunningTemplate] = useState<PromptTemplate | null>(null);
  const [isRunningAI, setIsRunningAI] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ types: new Set(), tags: new Set() });
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load persisted state on mount ──────────────────────────────────────────
  useEffect(() => {
    const store = loadStore();
    setProviderConfigs(store.providerConfigs);

    if (store.workspaces.length > 0) {
      const active = store.activeWorkspaceId
        ? store.workspaces.find(w => w.id === store.activeWorkspaceId) ?? store.workspaces[0]
        : store.workspaces[0];
      setWorkspace(active);
    } else {
      // First launch — create an empty workspace
      const empty: Workspace = {
        id: uid(),
        name: 'New Workspace',
        nodes: [],
        edges: [],
        settings: { autoSave: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setWorkspace(empty);
    }
  }, []);

  // ── Auto-save on workspace change ─────────────────────────────────────────
  useEffect(() => {
    if (!workspace) return;
    setSaveStatus('unsaved');
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      persistWorkspace(workspace);
    }, 1500);
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [workspace]);

  const persistWorkspace = (ws: Workspace) => {
    setSaveStatus('saving');
    try {
      const store = loadStore();
      const updated = saveWorkspace(store, ws);
      saveStore({ ...updated, activeWorkspaceId: ws.id });
      setSaveStatus('saved');
    } catch {
      setSaveStatus('unsaved');
      toast.error('Failed to save workspace');
    }
  };

  const handleSave = () => {
    if (workspace) persistWorkspace(workspace);
  };

  // ── Node mutations ────────────────────────────────────────────────────────

  const addNode = useCallback((type: NodeType) => {
    const newNode: BoardNode = {
      id: uid(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: '',
      tags: [],
      position: {
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 150,
      },
      metadata: { status: 'draft' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWorkspace(ws => ws ? { ...ws, nodes: [...ws.nodes, newNode] } : ws);
    setSelectedNodeId(newNode.id);
  }, []);

  const updateNode = useCallback((updated: BoardNode) => {
    setWorkspace(ws => ws
      ? { ...ws, nodes: ws.nodes.map(n => n.id === updated.id ? updated : n) }
      : ws
    );
  }, []);

  const moveNode = useCallback((id: string, x: number, y: number) => {
    setWorkspace(ws => ws
      ? {
          ...ws,
          nodes: ws.nodes.map(n =>
            n.id === id ? { ...n, position: { x, y }, updatedAt: new Date().toISOString() } : n
          ),
        }
      : ws
    );
  }, []);

  const deleteNode = useCallback((id: string) => {
    setWorkspace(ws => ws
      ? {
          ...ws,
          nodes: ws.nodes.filter(n => n.id !== id),
          edges: ws.edges.filter(e => e.sourceNodeId !== id && e.targetNodeId !== id),
        }
      : ws
    );
    setSelectedNodeId(s => (s === id ? null : s));
    toast.success('Node deleted');
  }, []);

  // ── Edge mutations ────────────────────────────────────────────────────────

  const addEdge = useCallback((sourceNodeId: string, targetNodeId: string, relationType: RelationType) => {
    // Prevent duplicate edges
    const exists = workspace?.edges.some(
      e => e.sourceNodeId === sourceNodeId && e.targetNodeId === targetNodeId
    );
    if (exists) {
      toast.info('Connection already exists');
      return;
    }
    const edge: BoardEdge = {
      id: uid(),
      sourceNodeId,
      targetNodeId,
      relationType,
    };
    setWorkspace(ws => ws ? { ...ws, edges: [...ws.edges, edge] } : ws);
    toast.success('Nodes connected');
  }, [workspace]);

  const deleteEdge = useCallback((edgeId: string) => {
    setWorkspace(ws => ws
      ? { ...ws, edges: ws.edges.filter(e => e.id !== edgeId) }
      : ws
    );
  }, []);

  // ── AI Actions ────────────────────────────────────────────────────────────

  const handleRunAI = useCallback(async (nodeId: string, action: AIActionType) => {
    const node = workspace?.nodes.find(n => n.id === nodeId);
    if (!node) return;

    setIsRunningAI(true);
    try {
      const adapter = getActiveAdapter(providerConfigs);
      let output = '';
      const context = node.content || node.title;

      switch (action) {
        case 'analyze':
          output = await adapter.analyzeCrisis({
            event: node.title,
            context,
            region: node.metadata?.region,
          });
          break;
        case 'summarize':
          output = await adapter.summarize(context);
          break;
        case 'extractRisks':
          output = await adapter.extractRisks(context);
          break;
        case 'extractOpportunities':
          output = await adapter.extractOpportunities(context);
          break;
        case 'generateTactics':
          output = await adapter.generateTactics({ scenario: context, opportunities: '' });
          break;
        case 'generateFinancePlan':
          output = await adapter.generateFinancePlan({ scenario: context, risks: '' });
          break;
        case 'synthesize': {
          // Synthesize using this node + its connected neighbours
          const connectedIds = workspace!.edges
            .filter(e => e.sourceNodeId === nodeId || e.targetNodeId === nodeId)
            .map(e => (e.sourceNodeId === nodeId ? e.targetNodeId : e.sourceNodeId));
          const neighbours = workspace!.nodes.filter(n => connectedIds.includes(n.id));
          const summaries = [node, ...neighbours].map(n => `${n.type.toUpperCase()}: ${n.title}\n${n.content}`);
          output = await adapter.synthesizeNodes(summaries);
          break;
        }
      }

      const aiOutput: AIOutput = {
        id: uid(),
        provider: adapter.name,
        model: providerConfigs.find(c => c.enabled)?.model ?? 'unknown',
        promptType: action,
        output,
        createdAt: new Date().toISOString(),
      };

      const updatedNode: BoardNode = {
        ...node,
        aiOutputs: [...(node.aiOutputs ?? []), aiOutput],
        updatedAt: new Date().toISOString(),
      };
      updateNode(updatedNode);

      // Save to analysis history
      const result: AnalysisResult = {
        id: uid(),
        nodeId,
        provider: aiOutput.provider,
        model: aiOutput.model,
        promptType: action,
        output,
        createdAt: aiOutput.createdAt,
      };
      const store = loadStore();
      saveStore(addAnalysisResult(store, result));

      toast.success(`AI analysis complete — ${action}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'AI request failed';
      toast.error(msg);
    } finally {
      setIsRunningAI(false);
    }
  }, [workspace, providerConfigs, updateNode]);

  // ── Template run ──────────────────────────────────────────────────────────

  const handleRunTemplate = useCallback(async (prompt: string, templateName: string) => {
    if (!selectedNodeId && !workspace?.nodes.length) {
      toast.info('Select a node to attach the result to, or add nodes first');
      return;
    }
    setIsRunningAI(true);
    try {
      const adapter = getActiveAdapter(providerConfigs);
      const output = await adapter.generateText(prompt);

      const targetId = selectedNodeId ?? workspace!.nodes[workspace!.nodes.length - 1].id;
      const targetNode = workspace!.nodes.find(n => n.id === targetId)!;

      const aiOutput: AIOutput = {
        id: uid(),
        provider: adapter.name,
        model: providerConfigs.find(c => c.enabled)?.model ?? 'unknown',
        promptType: templateName,
        output,
        createdAt: new Date().toISOString(),
      };

      updateNode({ ...targetNode, aiOutputs: [...(targetNode.aiOutputs ?? []), aiOutput] });
      toast.success(`Template "${templateName}" ran successfully`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Template run failed');
    } finally {
      setIsRunningAI(false);
    }
  }, [workspace, selectedNodeId, providerConfigs, updateNode]);

  // ── News import ────────────────────────────────────────────────────────────

  const handleImportNews = useCallback((item: NewsItem, type: NodeType) => {
    const nodeBase = newsItemToNode(item, {
      x: 100 + Math.random() * 300,
      y: 80 + Math.random() * 200,
    });
    const newNode: BoardNode = {
      ...nodeBase,
      id: uid(),
      type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWorkspace(ws => ws ? { ...ws, nodes: [...ws.nodes, newNode] } : ws);
    setSelectedNodeId(newNode.id);
    toast.success('News item added to board');
  }, []);

  // ── Export / Import ───────────────────────────────────────────────────────

  const handleExport = () => {
    if (!workspace) return;
    const json = exportWorkspaceJSON(workspace);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crisis-workspace-${workspace.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Workspace exported');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const imported = importWorkspaceJSON(text);
        setWorkspace(imported);
        setSelectedNodeId(null);
        toast.success(`Imported workspace: ${imported.name}`);
      } catch {
        toast.error('Invalid workspace JSON file');
      }
    };
    input.click();
  };

  // ── Demo workspace ────────────────────────────────────────────────────────

  const handleLoadDemo = () => {
    const demo = createDemoWorkspace();
    setWorkspace(demo);
    setSelectedNodeId(null);
    toast.success('Demo scenario loaded: Iran–US Crisis Analysis');
  };

  // ── Provider config ────────────────────────────────────────────────────────

  const handleSaveProviders = (configs: ProviderConfig[]) => {
    setProviderConfigs(configs);
    const store = loadStore();
    saveStore(saveProviderConfigs(store, configs));
    toast.success('Provider configuration saved');
  };

  // ── Rename workspace ──────────────────────────────────────────────────────

  const handleRename = (name: string) => {
    setWorkspace(ws => ws ? { ...ws, name } : ws);
  };

  // ── Filtered nodes ────────────────────────────────────────────────────────

  const filteredNodes = workspace?.nodes.filter(node => {
    if (filters.types.size > 0 && !filters.types.has(node.type)) return false;
    if (filters.tags.size > 0 && !node.tags.some(t => filters.tags.has(t))) return false;
    return true;
  }) ?? [];

  const allTags = [...new Set(workspace?.nodes.flatMap(n => n.tags) ?? [])].sort();
  const selectedNode = workspace?.nodes.find(n => n.id === selectedNodeId) ?? null;

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Loading workspace…
      </div>
    );
  }

  return (
    <div
      className="flex flex-col -mx-3 -mt-3 sm:-mx-4 sm:-mt-4 md:-mx-6 md:-mt-6"
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      {/* Top bar */}
      <CrisisTopBar
        workspaceName={workspace.name}
        saveStatus={saveStatus}
        onRename={handleRename}
        onSave={handleSave}
        onExport={handleExport}
        onImport={handleImport}
        onAddNode={() => addNode('note')}
        onToggleNews={() => setIsNewsFeedOpen(s => !s)}
        onOpenProviders={() => setIsProviderDialogOpen(true)}
        onLoadDemo={handleLoadDemo}
        hasNodes={workspace.nodes.length > 0}
      />

      {/* Main area */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar */}
        <LeftSidebar
          allTags={allTags}
          onAddNode={addNode}
          onRunTemplate={setRunningTemplate}
          filters={filters}
          onFilterChange={setFilters}
          userTemplates={[]}
        />

        {/* Canvas */}
        <WhiteboardCanvas
          nodes={filteredNodes}
          edges={workspace.edges.filter(e =>
            filteredNodes.some(n => n.id === e.sourceNodeId) &&
            filteredNodes.some(n => n.id === e.targetNodeId)
          )}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          onMoveNode={moveNode}
          onDeleteNode={deleteNode}
          onAddEdge={addEdge}
          onDeleteEdge={deleteEdge}
        />

        {/* Right detail panel */}
        <NodeDetailPanel
          node={selectedNode}
          isRunningAI={isRunningAI}
          onUpdate={updateNode}
          onClose={() => setSelectedNodeId(null)}
          onRunAI={handleRunAI}
        />
      </div>

      {/* News feed — bottom collapsible */}
      <NewsFeedPanel
        isOpen={isNewsFeedOpen}
        onToggle={() => setIsNewsFeedOpen(s => !s)}
        onImportAsNode={handleImportNews}
      />

      {/* Dialogs */}
      <ProviderConfigDialog
        open={isProviderDialogOpen}
        onClose={() => setIsProviderDialogOpen(false)}
        configs={providerConfigs}
        onSave={handleSaveProviders}
      />

      <TemplateRunDialog
        template={runningTemplate}
        onClose={() => setRunningTemplate(null)}
        onRun={handleRunTemplate}
      />
    </div>
  );
}
