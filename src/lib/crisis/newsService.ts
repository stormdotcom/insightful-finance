import type { NewsItem, BoardNode } from './types';
import { MOCK_NEWS_ITEMS } from './mockData';

// ─── News Service Interface ──────────────────────────────────────────────────
// Implement this interface to plug in a real news API (e.g. NewsAPI, GDELT, RSS).

export interface NewsServiceAdapter {
  fetchLatest(query?: string, maxItems?: number): Promise<NewsItem[]>;
  search(query: string): Promise<NewsItem[]>;
}

// ─── Mock News Service ───────────────────────────────────────────────────────

class MockNewsService implements NewsServiceAdapter {
  async fetchLatest(_query?: string, maxItems = 10): Promise<NewsItem[]> {
    await new Promise(r => setTimeout(r, 400));
    return MOCK_NEWS_ITEMS.slice(0, maxItems);
  }

  async search(query: string): Promise<NewsItem[]> {
    await new Promise(r => setTimeout(r, 300));
    const q = query.toLowerCase();
    return MOCK_NEWS_ITEMS.filter(
      item =>
        item.headline.toLowerCase().includes(q) ||
        item.summary?.toLowerCase().includes(q) ||
        item.tags?.some(t => t.includes(q))
    );
  }
}

// ─── NewsAPI Adapter (wired when API key is configured) ──────────────────────
// TODO: implement when a real news API key is available.
// Example: https://newsapi.org/v2/everything?q=iran+oil&apiKey=KEY

export class NewsAPIAdapter implements NewsServiceAdapter {
  constructor(private apiKey: string, private baseUrl = 'https://newsapi.org/v2') {}

  async fetchLatest(query = 'geopolitical crisis', maxItems = 10): Promise<NewsItem[]> {
    const url = `${this.baseUrl}/everything?q=${encodeURIComponent(query)}&pageSize=${maxItems}&sortBy=publishedAt&apiKey=${this.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`);
    const data = await res.json();
    return data.articles.map((a: any, i: number) => ({
      id: `newsapi-${i}`,
      headline: a.title,
      summary: a.description,
      url: a.url,
      source: a.source?.name,
      publishedAt: a.publishedAt?.slice(0, 10),
      tags: [],
    }));
  }

  async search(query: string): Promise<NewsItem[]> {
    return this.fetchLatest(query);
  }
}

// ─── Active service instance ─────────────────────────────────────────────────

let activeService: NewsServiceAdapter = new MockNewsService();

export function configureNewsService(apiKey: string): void {
  activeService = new NewsAPIAdapter(apiKey);
}

export function getNewsService(): NewsServiceAdapter {
  return activeService;
}

// ─── Conversion helpers ──────────────────────────────────────────────────────

/** Convert a news item to a News board node, ready to be placed on the canvas. */
export function newsItemToNode(
  item: NewsItem,
  position = { x: 100, y: 100 }
): Omit<BoardNode, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    type: 'news',
    title: item.headline,
    content: item.summary ?? '',
    tags: item.tags ?? [],
    position,
    source: {
      url: item.url,
      name: item.source,
      type: 'news',
      publishedAt: item.publishedAt,
    },
    metadata: { status: 'active', confidence: 'medium' },
  };
}
