import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { NewsItem, NodeType } from '@/lib/crisis/types';
import { getNewsService } from '@/lib/crisis/newsService';
import { ChevronDown, ChevronUp, Plus, RefreshCw, Loader2, Newspaper, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onImportAsNode: (item: NewsItem, type: NodeType) => void;
}

export function NewsFeedPanel({ isOpen, onToggle, onImportAsNode }: Props) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [manualHeadline, setManualHeadline] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [manualSummary, setManualSummary] = useState('');
  const [showManual, setShowManual] = useState(false);

  const loadFeed = async (query = '') => {
    setIsLoading(true);
    try {
      const svc = getNewsService();
      const results = query ? await svc.search(query) : await svc.fetchLatest(undefined, 10);
      setItems(results);
    } catch (e) {
      console.error('[NewsFeed] Failed to fetch:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && items.length === 0) loadFeed();
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadFeed(searchQuery);
  };

  const handleManualAdd = () => {
    if (!manualHeadline.trim()) return;
    const manual: NewsItem = {
      id: `manual-${Date.now()}`,
      headline: manualHeadline.trim(),
      summary: manualSummary.trim() || undefined,
      url: manualUrl.trim() || undefined,
      source: 'Manual Entry',
      publishedAt: new Date().toISOString().slice(0, 10),
      tags: [],
    };
    setItems(prev => [manual, ...prev]);
    setManualHeadline('');
    setManualUrl('');
    setManualSummary('');
    setShowManual(false);
  };

  return (
    <div
      className={cn(
        'border-t border-border/50 bg-background/80 transition-all duration-200',
        isOpen ? 'h-52' : 'h-9'
      )}
    >
      {/* Panel toggle header */}
      <button
        onClick={onToggle}
        className="w-full h-9 flex items-center justify-between px-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Newspaper className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">News Feed</span>
          <span className="text-[10px] text-muted-foreground">({items.length} items)</span>
        </div>
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {isOpen && (
        <div className="flex h-[calc(100%-2.25rem)]">
          {/* Controls */}
          <div className="w-56 border-r border-border/50 p-2 space-y-2 shrink-0">
            <form onSubmit={handleSearch} className="flex gap-1">
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search news…"
                className="h-7 text-xs"
              />
              <Button type="submit" size="sm" variant="outline" className="h-7 w-7 p-0 shrink-0">
                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              </Button>
            </form>
            <button
              onClick={() => setShowManual(s => !s)}
              className="text-[10px] text-primary hover:underline w-full text-left flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Add manually
            </button>
            {showManual && (
              <div className="space-y-1">
                <Input
                  value={manualHeadline}
                  onChange={e => setManualHeadline(e.target.value)}
                  placeholder="Headline *"
                  className="h-7 text-xs"
                />
                <Input
                  value={manualUrl}
                  onChange={e => setManualUrl(e.target.value)}
                  placeholder="URL (optional)"
                  className="h-7 text-xs"
                />
                <Input
                  value={manualSummary}
                  onChange={e => setManualSummary(e.target.value)}
                  placeholder="Summary (optional)"
                  className="h-7 text-xs"
                />
                <Button size="sm" className="w-full h-7 text-xs" onClick={handleManualAdd}>
                  Add to Feed
                </Button>
              </div>
            )}
          </div>

          {/* News items */}
          <ScrollArea className="flex-1">
            <div className="flex gap-2 p-2 h-full">
              {isLoading && items.length === 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading feed…
                </div>
              )}
              {items.map(item => (
                <div
                  key={item.id}
                  className="shrink-0 w-56 border border-border/50 rounded-lg p-2.5 bg-secondary/20 hover:bg-secondary/40 transition-colors flex flex-col gap-1"
                >
                  <div className="flex items-start gap-1">
                    <p className="text-[11px] font-semibold text-foreground leading-snug line-clamp-3 flex-1">
                      {item.headline}
                    </p>
                  </div>
                  {item.summary && (
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-snug">
                      {item.summary}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <span className="text-[9px] text-muted-foreground">{item.source}</span>
                    <div className="flex items-center gap-1">
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <button
                        onClick={() => onImportAsNode(item, 'news')}
                        title="Add to board as News node"
                        className="text-[10px] text-primary hover:bg-primary/10 px-1.5 py-0.5 rounded"
                      >
                        + Board
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
