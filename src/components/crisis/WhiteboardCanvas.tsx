import { useRef, useState, useCallback, useEffect } from 'react';
import type { BoardNode, BoardEdge, RelationType } from '@/lib/crisis/types';
import { BoardNodeCard } from './BoardNodeCard';
import { getNodeConfig, NODE_WIDTH, NODE_HEIGHT } from './nodeConfig';
import { cn } from '@/lib/utils';

interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

interface Props {
  nodes: BoardNode[];
  edges: BoardEdge[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onMoveNode: (id: string, x: number, y: number) => void;
  onDeleteNode: (id: string) => void;
  onAddEdge: (sourceId: string, targetId: string, relation: RelationType) => void;
  onDeleteEdge: (edgeId: string) => void;
}

// For edge drawing — compute the closest edge anchor between two nodes
function edgePath(
  src: BoardNode,
  tgt: BoardNode
): { d: string; midX: number; midY: number } {
  const sx = src.position.x + NODE_WIDTH / 2;
  const sy = src.position.y + NODE_HEIGHT / 2;
  const tx = tgt.position.x + NODE_WIDTH / 2;
  const ty = tgt.position.y + NODE_HEIGHT / 2;
  const cx1 = sx + (tx - sx) * 0.5;
  const cy1 = sy;
  const cx2 = sx + (tx - sx) * 0.5;
  const cy2 = ty;
  return {
    d: `M ${sx} ${sy} C ${cx1} ${cy1} ${cx2} ${cy2} ${tx} ${ty}`,
    midX: (sx + tx) / 2,
    midY: (sy + ty) / 2,
  };
}

export function WhiteboardCanvas({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onMoveNode,
  onDeleteNode,
  onAddEdge,
  onDeleteEdge,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 0.85 });

  // Node dragging state
  const dragRef = useRef<{
    nodeId: string;
    startMouseX: number;
    startMouseY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // Canvas panning state
  const panRef = useRef<{ startX: number; startY: number } | null>(null);

  // Connecting state
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);

  // Reset connect mode on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConnectingFrom(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Mouse handlers ──────────────────────────────────────────────────────

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    // Only start pan when clicking directly on canvas background
    if (target === containerRef.current || target.dataset.canvasBg === 'true') {
      onSelectNode(null);
      panRef.current = { startX: e.clientX - viewport.x, startY: e.clientY - viewport.y };
    }
  }, [viewport, onSelectNode]);

  const handleNodeDragStart = useCallback((e: React.MouseEvent, nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    dragRef.current = {
      nodeId,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      origX: node.position.x,
      origY: node.position.y,
    };
  }, [nodes]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragRef.current) {
      const dx = (e.clientX - dragRef.current.startMouseX) / viewport.zoom;
      const dy = (e.clientY - dragRef.current.startMouseY) / viewport.zoom;
      onMoveNode(
        dragRef.current.nodeId,
        dragRef.current.origX + dx,
        dragRef.current.origY + dy
      );
    } else if (panRef.current) {
      setViewport(v => ({
        ...v,
        x: e.clientX - panRef.current!.startX,
        y: e.clientY - panRef.current!.startY,
      }));
    }
  }, [viewport.zoom, onMoveNode]);

  const handleMouseUp = useCallback(() => {
    dragRef.current = null;
    panRef.current = null;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setViewport(v => ({
      ...v,
      zoom: Math.min(Math.max(v.zoom * delta, 0.3), 2.5),
    }));
  }, []);

  // ── Connect mode ────────────────────────────────────────────────────────

  const handleNodeConnect = useCallback((nodeId: string) => {
    if (!connectingFrom) {
      setConnectingFrom(nodeId);
      return;
    }
    if (connectingFrom === nodeId) {
      setConnectingFrom(null);
      return;
    }
    onAddEdge(connectingFrom, nodeId, 'related');
    setConnectingFrom(null);
  }, [connectingFrom, onAddEdge]);

  // ── Zoom controls ───────────────────────────────────────────────────────

  const zoomIn = () => setViewport(v => ({ ...v, zoom: Math.min(v.zoom * 1.2, 2.5) }));
  const zoomOut = () => setViewport(v => ({ ...v, zoom: Math.max(v.zoom * 0.85, 0.3) }));
  const resetView = () => setViewport({ x: 0, y: 0, zoom: 0.85 });

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return (
    <div className="relative flex-1 overflow-hidden bg-background rounded-lg border border-border/40">
      {/* Connect mode banner */}
      {connectingFrom && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-amber-500/90 text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow">
          Click a target node to connect — or <kbd className="bg-black/20 px-1 rounded">Esc</kbd> to cancel
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1">
        {[
          { label: '+', fn: zoomIn },
          { label: '−', fn: zoomOut },
          { label: '⊙', fn: resetView, title: 'Reset view' },
        ].map(({ label, fn, title }) => (
          <button
            key={label}
            title={title}
            onClick={fn}
            className="h-7 w-7 rounded-md bg-background border border-border shadow text-sm font-medium hover:bg-secondary transition-colors"
          >
            {label}
          </button>
        ))}
        <div className="text-[9px] text-center text-muted-foreground">
          {Math.round(viewport.zoom * 100)}%
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className={cn(
          'w-full h-full overflow-hidden',
          connectingFrom ? 'cursor-crosshair' : 'cursor-default'
        )}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Dot-grid background */}
        <div
          data-canvas-bg="true"
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
            backgroundSize: `${24 * viewport.zoom}px ${24 * viewport.zoom}px`,
            backgroundPosition: `${viewport.x % (24 * viewport.zoom)}px ${viewport.y % (24 * viewport.zoom)}px`,
          }}
        />

        {/* Transformed canvas content */}
        <div
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: '0 0',
            position: 'absolute',
            width: '4000px',
            height: '3000px',
          }}
        >
          {/* SVG edge layer */}
          <svg
            className="absolute inset-0 pointer-events-none overflow-visible"
            style={{ width: '100%', height: '100%' }}
          >
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" className="fill-border" />
              </marker>
            </defs>
            {edges.map(edge => {
              const src = nodeMap.get(edge.sourceNodeId);
              const tgt = nodeMap.get(edge.targetNodeId);
              if (!src || !tgt) return null;
              const { d, midX, midY } = edgePath(src, tgt);
              const srcCfg = getNodeConfig(src.type);
              return (
                <g key={edge.id}>
                  {/* Wider invisible hit area for click */}
                  <path
                    d={d}
                    stroke="transparent"
                    strokeWidth="12"
                    fill="none"
                    className="cursor-pointer pointer-events-auto"
                    onClick={() => onDeleteEdge(edge.id)}
                    title="Click to remove edge"
                  />
                  <path
                    d={d}
                    stroke={srcCfg.dotColor}
                    strokeWidth="1.5"
                    fill="none"
                    opacity={0.6}
                    strokeDasharray="4 3"
                    markerEnd="url(#arrowhead)"
                  />
                  {edge.label && (
                    <text
                      x={midX}
                      y={midY - 6}
                      textAnchor="middle"
                      className="fill-muted-foreground"
                      style={{ fontSize: 10, fontFamily: 'Inter, sans-serif' }}
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Node cards */}
          {nodes.map(node => (
            <BoardNodeCard
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              isConnecting={!!connectingFrom}
              isConnectSource={connectingFrom === node.id}
              onSelect={onSelectNode}
              onDragStart={handleNodeDragStart}
              onConnect={handleNodeConnect}
              onDelete={onDeleteNode}
            />
          ))}

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-3xl mb-3">🗺️</p>
                <p className="text-muted-foreground text-sm font-medium">
                  Your whiteboard is empty
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Add nodes from the left sidebar or load the demo scenario
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
