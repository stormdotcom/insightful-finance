import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { NodeType, PromptTemplate } from '@/lib/crisis/types';
import { NODE_TYPE_CONFIGS, getNodeConfig } from './nodeConfig';
import { BUILT_IN_TEMPLATES } from '@/lib/crisis/promptTemplates';
import { Search, ChevronDown, ChevronRight, Plus } from 'lucide-react';

interface FilterState {
  types: Set<NodeType>;
  tags: Set<string>;
}

interface Props {
  allTags: string[];
  onAddNode: (type: NodeType) => void;
  onRunTemplate: (template: PromptTemplate) => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  userTemplates: PromptTemplate[];
}

export function LeftSidebar({
  allTags,
  onAddNode,
  onRunTemplate,
  filters,
  onFilterChange,
  userTemplates,
}: Props) {
  const [search, setSearch] = useState('');
  const [sectionsOpen, setSectionsOpen] = useState({
    nodeTypes: true,
    templates: true,
    filters: false,
  });

  const toggleSection = (key: keyof typeof sectionsOpen) => {
    setSectionsOpen(s => ({ ...s, [key]: !s[key] }));
  };

  const toggleTypeFilter = (type: NodeType) => {
    const next = new Set(filters.types);
    next.has(type) ? next.delete(type) : next.add(type);
    onFilterChange({ ...filters, types: next });
  };

  const toggleTagFilter = (tag: string) => {
    const next = new Set(filters.tags);
    next.has(tag) ? next.delete(tag) : next.add(tag);
    onFilterChange({ ...filters, tags: next });
  };

  const allTemplates = [...BUILT_IN_TEMPLATES, ...userTemplates];
  const filteredTemplates = search
    ? allTemplates.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      )
    : allTemplates;

  return (
    <div className="w-52 border-r border-border/50 flex flex-col shrink-0 bg-sidebar/50">
      <div className="p-2 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-7 pl-6 text-xs"
            placeholder="Search templates…"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">

          {/* ── Node Types ──────────────────────────────── */}
          <SectionHeader
            title="Add Node"
            isOpen={sectionsOpen.nodeTypes}
            onToggle={() => toggleSection('nodeTypes')}
          />
          {sectionsOpen.nodeTypes && (
            <div className="space-y-0.5 mb-2">
              {Object.values(NODE_TYPE_CONFIGS).map(cfg => (
                <button
                  key={cfg.type}
                  onClick={() => onAddNode(cfg.type)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left hover:bg-secondary/60 transition-colors group',
                    filters.types.size > 0 && !filters.types.has(cfg.type) && 'opacity-40'
                  )}
                  title={cfg.description}
                >
                  <span className="text-sm shrink-0">{cfg.icon}</span>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground flex-1">
                    {cfg.label}
                  </span>
                  <Plus className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}

          <Separator />

          {/* ── Prompt Templates ─────────────────────── */}
          <SectionHeader
            title="Prompt Templates"
            isOpen={sectionsOpen.templates}
            onToggle={() => toggleSection('templates')}
          />
          {sectionsOpen.templates && (
            <div className="space-y-0.5 mb-2">
              {filteredTemplates.length === 0 && (
                <p className="text-[10px] text-muted-foreground px-2">No templates found</p>
              )}
              {groupByCategory(filteredTemplates).map(([category, templates]) => (
                <div key={category}>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider px-2 py-1 font-semibold">
                    {category}
                  </p>
                  {templates.map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => onRunTemplate(tpl)}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-left hover:bg-secondary/60 transition-colors"
                    >
                      <span className="text-xs">📋</span>
                      <span className="text-[11px] text-muted-foreground hover:text-foreground leading-tight">
                        {tpl.name}
                      </span>
                      {tpl.isBuiltIn && (
                        <span className="ml-auto text-[9px] text-muted-foreground/60">built-in</span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          <Separator />

          {/* ── Filters ──────────────────────────────── */}
          <SectionHeader
            title="Filter Board"
            isOpen={sectionsOpen.filters}
            onToggle={() => toggleSection('filters')}
            badge={filters.types.size + filters.tags.size > 0
              ? String(filters.types.size + filters.tags.size)
              : undefined}
          />
          {sectionsOpen.filters && (
            <div className="mb-2">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider px-2 pb-1 font-semibold">By Type</p>
              <div className="flex flex-wrap gap-1 px-2">
                {Object.values(NODE_TYPE_CONFIGS).map(cfg => (
                  <button
                    key={cfg.type}
                    onClick={() => toggleTypeFilter(cfg.type)}
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full border transition-colors',
                      filters.types.has(cfg.type)
                        ? `${cfg.badgeClass} border-transparent`
                        : 'border-border text-muted-foreground hover:bg-secondary/50'
                    )}
                  >
                    {cfg.icon} {cfg.label}
                  </button>
                ))}
              </div>

              {allTags.length > 0 && (
                <>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider px-2 pt-2 pb-1 font-semibold">By Tag</p>
                  <div className="flex flex-wrap gap-1 px-2">
                    {allTags.slice(0, 20).map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTagFilter(tag)}
                        className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded-full border transition-colors',
                          filters.tags.has(tag)
                            ? 'bg-primary/20 text-primary border-primary/40'
                            : 'border-border text-muted-foreground hover:bg-secondary/50'
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {(filters.types.size > 0 || filters.tags.size > 0) && (
                <button
                  onClick={() => onFilterChange({ types: new Set(), tags: new Set() })}
                  className="mt-2 w-full text-[10px] text-muted-foreground hover:text-foreground px-2 underline text-left"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

        </div>
      </ScrollArea>
    </div>
  );
}

function SectionHeader({
  title,
  isOpen,
  onToggle,
  badge,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-secondary/40 rounded-md transition-colors"
    >
      <span className="text-[11px] font-semibold text-foreground">{title}</span>
      <div className="flex items-center gap-1">
        {badge && (
          <Badge variant="secondary" className="text-[9px] h-4 px-1">{badge}</Badge>
        )}
        {isOpen ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
      </div>
    </button>
  );
}

function groupByCategory(templates: PromptTemplate[]): [string, PromptTemplate[]][] {
  const map = new Map<string, PromptTemplate[]>();
  for (const t of templates) {
    if (!map.has(t.category)) map.set(t.category, []);
    map.get(t.category)!.push(t);
  }
  return Array.from(map.entries());
}
