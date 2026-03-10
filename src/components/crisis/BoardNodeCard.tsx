import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { BoardNode } from '@/lib/crisis/types';
import { getNodeConfig, NODE_WIDTH } from './nodeConfig';
import { X, Link2 } from 'lucide-react';

interface Props {
  node: BoardNode;
  isSelected: boolean;
  isConnecting: boolean;   // canvas is in connect mode
  isConnectSource: boolean;
  onSelect: (id: string) => void;
  onDragStart: (e: React.MouseEvent, id: string) => void;
  onConnect: (id: string) => void;  // initiate connect from this node
  onDelete: (id: string) => void;
}

export const BoardNodeCard = memo(function BoardNodeCard({
  node,
  isSelected,
  isConnecting,
  isConnectSource,
  onSelect,
  onDragStart,
  onConnect,
  onDelete,
}: Props) {
  const cfg = getNodeConfig(node.type);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnecting && !isConnectSource) {
      onConnect(node.id);
      return;
    }
    onDragStart(e, node.id);
    onSelect(node.id);
  };

  const handleConnectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConnect(node.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(node.id);
  };

  return (
    <div
      className={cn(
        'absolute rounded-xl border-2 shadow-lg cursor-grab active:cursor-grabbing select-none transition-shadow',
        cfg.bgClass,
        cfg.colorClass,
        isSelected && 'ring-2 ring-primary ring-offset-1 ring-offset-background shadow-xl',
        isConnecting && !isConnectSource && 'cursor-crosshair hover:ring-2 hover:ring-primary',
        isConnectSource && 'ring-2 ring-amber-400 ring-offset-1'
      )}
      style={{ left: node.position.x, top: node.position.y, width: NODE_WIDTH }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className={cn('px-3 pt-2.5 pb-1 flex items-start gap-2', cfg.colorClass)}>
        <span className="text-base shrink-0 mt-0.5">{cfg.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className={cn('text-[10px] font-semibold uppercase tracking-wider', cfg.colorClass)}>
              {cfg.label}
            </span>
            {node.metadata?.priority === 'critical' && (
              <span className="text-[9px] bg-rose-500/30 text-rose-300 px-1 rounded">CRITICAL</span>
            )}
          </div>
          <p className="text-xs font-semibold text-foreground leading-tight mt-0.5 line-clamp-2">
            {node.title}
          </p>
        </div>
      </div>

      {/* Content preview */}
      <div className="px-3 pb-2">
        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
          {node.content}
        </p>
      </div>

      {/* Footer */}
      <div className="px-3 pb-2 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {node.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className={cn('text-[9px] px-1.5 py-0.5 rounded-full', cfg.badgeClass)}
            >
              {tag}
            </span>
          ))}
          {node.tags.length > 2 && (
            <span className="text-[9px] text-muted-foreground">+{node.tags.length - 2}</span>
          )}
        </div>
        {node.aiOutputs && node.aiOutputs.length > 0 && (
          <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
            {node.aiOutputs.length} AI
          </span>
        )}
      </div>

      {/* Action buttons — visible on hover/select */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 flex gap-1">
          <button
            title="Connect to another node"
            onClick={handleConnectClick}
            className="h-6 w-6 rounded-full bg-background border border-border shadow flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-400 transition-colors"
          >
            <Link2 className="h-3 w-3 text-muted-foreground" />
          </button>
          <button
            title="Delete node"
            onClick={handleDeleteClick}
            className="h-6 w-6 rounded-full bg-background border border-border shadow flex items-center justify-center hover:bg-destructive/20 hover:border-destructive transition-colors"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  );
});
