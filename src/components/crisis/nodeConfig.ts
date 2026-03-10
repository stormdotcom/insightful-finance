import type { NodeType } from '@/lib/crisis/types';

export interface NodeTypeConfig {
  type: NodeType;
  label: string;
  description: string;
  colorClass: string;       // Tailwind border/text color
  bgClass: string;          // Tailwind bg color (light tint)
  badgeClass: string;       // Badge background
  dotColor: string;         // Inline SVG dot color (HSL var)
  icon: string;             // emoji or lucide name
}

export const NODE_TYPE_CONFIGS: Record<NodeType, NodeTypeConfig> = {
  news: {
    type: 'news',
    label: 'News',
    description: 'News headline or breaking event',
    colorClass: 'border-sky-500 text-sky-400',
    bgClass: 'bg-sky-500/10',
    badgeClass: 'bg-sky-500/20 text-sky-300',
    dotColor: 'hsl(199, 89%, 48%)',
    icon: '📰',
  },
  article: {
    type: 'article',
    label: 'Article / Research',
    description: 'In-depth article or research paper',
    colorClass: 'border-indigo-500 text-indigo-400',
    bgClass: 'bg-indigo-500/10',
    badgeClass: 'bg-indigo-500/20 text-indigo-300',
    dotColor: 'hsl(234, 89%, 74%)',
    icon: '📄',
  },
  analysis: {
    type: 'analysis',
    label: 'Analysis',
    description: 'Structured analysis or breakdown',
    colorClass: 'border-violet-500 text-violet-400',
    bgClass: 'bg-violet-500/10',
    badgeClass: 'bg-violet-500/20 text-violet-300',
    dotColor: 'hsl(263, 70%, 50%)',
    icon: '🔬',
  },
  scenario: {
    type: 'scenario',
    label: 'Scenario',
    description: 'Central crisis scenario or situation',
    colorClass: 'border-amber-500 text-amber-400',
    bgClass: 'bg-amber-500/10',
    badgeClass: 'bg-amber-500/20 text-amber-300',
    dotColor: 'hsl(38, 92%, 50%)',
    icon: '🌐',
  },
  risk: {
    type: 'risk',
    label: 'Risk',
    description: 'Identified risk or threat',
    colorClass: 'border-rose-500 text-rose-400',
    bgClass: 'bg-rose-500/10',
    badgeClass: 'bg-rose-500/20 text-rose-300',
    dotColor: 'hsl(350, 89%, 60%)',
    icon: '⚠️',
  },
  opportunity: {
    type: 'opportunity',
    label: 'Opportunity',
    description: 'Emerging opportunity from the crisis',
    colorClass: 'border-emerald-500 text-emerald-400',
    bgClass: 'bg-emerald-500/10',
    badgeClass: 'bg-emerald-500/20 text-emerald-300',
    dotColor: 'hsl(160, 84%, 39%)',
    icon: '✨',
  },
  tactic: {
    type: 'tactic',
    label: 'Tactic / Action',
    description: 'Actionable step or tactic',
    colorClass: 'border-teal-500 text-teal-400',
    bgClass: 'bg-teal-500/10',
    badgeClass: 'bg-teal-500/20 text-teal-300',
    dotColor: 'hsl(174, 72%, 46%)',
    icon: '🎯',
  },
  finance: {
    type: 'finance',
    label: 'Finance',
    description: 'Financial planning or budget note',
    colorClass: 'border-green-500 text-green-400',
    bgClass: 'bg-green-500/10',
    badgeClass: 'bg-green-500/20 text-green-300',
    dotColor: 'hsl(142, 76%, 36%)',
    icon: '💰',
  },
  investment: {
    type: 'investment',
    label: 'Investment Research',
    description: 'Investment scenario research note',
    colorClass: 'border-cyan-500 text-cyan-400',
    bgClass: 'bg-cyan-500/10',
    badgeClass: 'bg-cyan-500/20 text-cyan-300',
    dotColor: 'hsl(187, 85%, 43%)',
    icon: '📈',
  },
  note: {
    type: 'note',
    label: 'Note',
    description: 'Free-form note or observation',
    colorClass: 'border-slate-500 text-slate-400',
    bgClass: 'bg-slate-500/10',
    badgeClass: 'bg-slate-500/20 text-slate-300',
    dotColor: 'hsl(215, 16%, 47%)',
    icon: '📝',
  },
};

export const NODE_WIDTH = 240;
export const NODE_HEIGHT = 130; // used for edge midpoint calc

export function getNodeConfig(type: NodeType): NodeTypeConfig {
  return NODE_TYPE_CONFIGS[type] ?? NODE_TYPE_CONFIGS.note;
}
