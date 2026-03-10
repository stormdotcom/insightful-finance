import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { BoardNode, NodeType, NodeStatus, ConfidenceLevel, Priority, AIOutput } from '@/lib/crisis/types';
import { getNodeConfig, NODE_TYPE_CONFIGS } from './nodeConfig';
import {
  Sparkles, Loader2, ChevronDown, ChevronRight,
  AlertTriangle, TrendingUp, Crosshair, DollarSign,
  BarChart2, Network, X, Plus, ExternalLink,
} from 'lucide-react';

interface Props {
  node: BoardNode | null;
  isRunningAI: boolean;
  onUpdate: (updated: BoardNode) => void;
  onClose: () => void;
  onRunAI: (nodeId: string, action: AIActionType) => void;
}

export type AIActionType =
  | 'analyze'
  | 'summarize'
  | 'extractRisks'
  | 'extractOpportunities'
  | 'generateTactics'
  | 'generateFinancePlan'
  | 'synthesize';

const AI_ACTIONS: { id: AIActionType; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'analyze',              label: 'Analyze',          icon: Sparkles,       description: 'Run structured impact analysis' },
  { id: 'summarize',            label: 'Summarize',        icon: ChevronDown,    description: 'Condense content to key points' },
  { id: 'extractRisks',        label: 'Find Risks',       icon: AlertTriangle,  description: 'Extract and categorize risks' },
  { id: 'extractOpportunities',label: 'Find Opportunities',icon: TrendingUp,    description: 'Identify emerging opportunities' },
  { id: 'generateTactics',     label: 'Gen Tactics',      icon: Crosshair,      description: 'Generate actionable tactics' },
  { id: 'generateFinancePlan', label: 'Finance Plan',     icon: DollarSign,     description: 'Build crisis finance plan' },
  { id: 'synthesize',          label: 'Synthesize',       icon: Network,        description: 'Cross-node synthesis' },
];

export function NodeDetailPanel({ node, isRunningAI, onUpdate, onClose, onRunAI }: Props) {
  const [editedNode, setEditedNode] = useState<BoardNode | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [expandedOutputs, setExpandedOutputs] = useState<Set<string>>(new Set());

  useEffect(() => {
    setEditedNode(node ? { ...node } : null);
  }, [node]);

  if (!node || !editedNode) {
    return (
      <div className="w-80 border-l border-border/50 flex flex-col items-center justify-center text-center p-6 shrink-0">
        <div className="text-4xl mb-3">👈</div>
        <p className="text-sm text-muted-foreground">Select a node to inspect or edit it</p>
      </div>
    );
  }

  const cfg = getNodeConfig(editedNode.type);

  const handleChange = <K extends keyof BoardNode>(key: K, value: BoardNode[K]) => {
    setEditedNode(n => n ? { ...n, [key]: value, updatedAt: new Date().toISOString() } : n);
  };

  const handleMetaChange = (key: string, value: string) => {
    setEditedNode(n => n ? {
      ...n,
      metadata: { ...n.metadata, [key]: value },
      updatedAt: new Date().toISOString(),
    } : n);
  };

  const handleSourceChange = (key: string, value: string) => {
    setEditedNode(n => n ? {
      ...n,
      source: { ...n.source, [key]: value },
      updatedAt: new Date().toISOString(),
    } : n);
  };

  const handleSave = () => {
    if (editedNode) onUpdate(editedNode);
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !editedNode.tags.includes(tag)) {
      handleChange('tags', [...editedNode.tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    handleChange('tags', editedNode.tags.filter(t => t !== tag));
  };

  const toggleOutput = (id: string) => {
    setExpandedOutputs(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="w-80 border-l border-border/50 flex flex-col shrink-0">
      {/* Panel header */}
      <div className={cn('px-3 py-2.5 flex items-center gap-2 border-b border-border/50', cfg.bgClass)}>
        <span className="text-base">{cfg.icon}</span>
        <div className="flex-1 min-w-0">
          <span className={cn('text-[10px] font-bold uppercase tracking-wider', cfg.colorClass)}>
            {cfg.label}
          </span>
          <p className="text-xs font-semibold text-foreground truncate">{editedNode.title}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">

          {/* Type selector */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Node Type</label>
            <select
              value={editedNode.type}
              onChange={e => handleChange('type', e.target.value as NodeType)}
              className="mt-1 w-full text-xs bg-secondary/50 border border-border rounded-md px-2 py-1.5 text-foreground"
            >
              {Object.values(NODE_TYPE_CONFIGS).map(c => (
                <option key={c.type} value={c.type}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Title</label>
            <Input
              value={editedNode.title}
              onChange={e => handleChange('title', e.target.value)}
              className="mt-1 text-xs h-8"
              placeholder="Node title"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Content</label>
            <Textarea
              value={editedNode.content}
              onChange={e => handleChange('content', e.target.value)}
              className="mt-1 text-xs min-h-[80px] resize-y"
              placeholder="Detailed notes, analysis, or observations…"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Tags</label>
            <div className="mt-1 flex flex-wrap gap-1">
              {editedNode.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-[10px] gap-1 pr-1 cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} <X className="h-2.5 w-2.5" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-1 mt-1.5">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="h-7 text-xs"
                placeholder="Add tag…"
              />
              <Button size="sm" variant="outline" className="h-7 px-2" onClick={addTag}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'status', label: 'Status', options: ['draft', 'active', 'watching', 'resolved', 'archived'] },
              { key: 'confidence', label: 'Confidence', options: ['low', 'medium', 'high'] },
              { key: 'priority', label: 'Priority', options: ['low', 'medium', 'high', 'critical'] },
            ].map(({ key, label, options }) => (
              <div key={key} className={key === 'status' ? 'col-span-2' : ''}>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</label>
                <select
                  value={(editedNode.metadata as any)?.[key] ?? ''}
                  onChange={e => handleMetaChange(key, e.target.value)}
                  className="mt-1 w-full text-xs bg-secondary/50 border border-border rounded-md px-2 py-1.5 text-foreground"
                >
                  <option value="">— none —</option>
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="col-span-2">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Region</label>
              <Input
                value={editedNode.metadata?.region ?? ''}
                onChange={e => handleMetaChange('region', e.target.value)}
                className="mt-1 h-7 text-xs"
                placeholder="e.g. Middle East, India, Global"
              />
            </div>
          </div>

          {/* Source */}
          <div className="space-y-2">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Source</label>
            <Input
              value={editedNode.source?.url ?? ''}
              onChange={e => handleSourceChange('url', e.target.value)}
              className="h-7 text-xs"
              placeholder="https://…"
            />
            <div className="grid grid-cols-2 gap-1.5">
              <Input
                value={editedNode.source?.name ?? ''}
                onChange={e => handleSourceChange('name', e.target.value)}
                className="h-7 text-xs"
                placeholder="Source name"
              />
              <select
                value={editedNode.source?.type ?? ''}
                onChange={e => handleSourceChange('type', e.target.value)}
                className="text-xs bg-secondary/50 border border-border rounded-md px-2 py-1 text-foreground"
              >
                <option value="">Type</option>
                {['news', 'article', 'report', 'social', 'manual', 'ai'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {editedNode.source?.url && (
              <a
                href={editedNode.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" /> Open source
              </a>
            )}
          </div>

          <Button size="sm" className="w-full h-8 text-xs" onClick={handleSave}>
            Save Changes
          </Button>

          <Separator />

          {/* AI Actions */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" /> AI Actions
            </label>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {AI_ACTIONS.map(action => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    disabled={isRunningAI}
                    onClick={() => onRunAI(node.id, action.id)}
                    title={action.description}
                    className={cn(
                      'flex items-center gap-1.5 text-[10px] px-2 py-1.5 rounded-lg border border-border/50 bg-secondary/30 hover:bg-primary/10 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors text-left',
                      isRunningAI && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isRunningAI ? (
                      <Loader2 className="h-3 w-3 animate-spin shrink-0" />
                    ) : (
                      <Icon className="h-3 w-3 shrink-0" />
                    )}
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Outputs */}
          {editedNode.aiOutputs && editedNode.aiOutputs.length > 0 && (
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                AI Outputs ({editedNode.aiOutputs.length})
              </label>
              <div className="mt-2 space-y-2">
                {editedNode.aiOutputs.map((output: AIOutput) => (
                  <div key={output.id} className="border border-border/50 rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-[10px] bg-secondary/30 hover:bg-secondary/50 text-muted-foreground"
                      onClick={() => toggleOutput(output.id)}
                    >
                      <span className="font-medium text-foreground">{output.promptType}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-primary">{output.provider}</span>
                        {expandedOutputs.has(output.id) ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </button>
                    {expandedOutputs.has(output.id) && (
                      <div className="px-2.5 py-2 text-[11px] text-foreground leading-relaxed whitespace-pre-wrap max-h-48 overflow-auto bg-background/50">
                        {output.output}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </ScrollArea>
    </div>
  );
}
