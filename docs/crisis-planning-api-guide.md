# Crisis Planning — Future Backend API Guide

This document describes the recommended REST API for a future backend that syncs
Crisis Planning Whiteboard data. The current implementation stores everything in
`localStorage`. When you add a backend, implement these endpoints and wire the
`storage.ts` service to call them.

---

## Authentication

All endpoints assume bearer-token auth:
```
Authorization: Bearer <user_token>
```

---

## Workspaces

### `POST /api/workspaces`
Create a new workspace.

**Request body:**
```json
{
  "name": "Iran–US Crisis Analysis",
  "description": "Geopolitical tension scenario mapping",
  "settings": { "autoSave": true }
}
```

**Response `201`:**
```json
{
  "id": "ws_abc123",
  "name": "Iran–US Crisis Analysis",
  "nodes": [],
  "edges": [],
  "createdAt": "2026-03-11T08:00:00Z",
  "updatedAt": "2026-03-11T08:00:00Z"
}
```

---

### `GET /api/workspaces`
List all workspaces for the authenticated user.

**Response `200`:**
```json
{
  "workspaces": [
    { "id": "ws_abc123", "name": "Iran–US Crisis", "updatedAt": "2026-03-11T08:00:00Z" }
  ]
}
```

---

### `GET /api/workspaces/:id`
Get full workspace with nodes and edges.

**Response `200`:** Full `Workspace` object.

---

### `PUT /api/workspaces/:id`
Update workspace metadata or replace full node/edge graph.

**Request body:** Partial `Workspace` (only changed fields).

**Response `200`:** Updated `Workspace`.

**Implementation note:** For large graphs, prefer the individual node/edge endpoints
below rather than replacing the full workspace on every change.

---

### `DELETE /api/workspaces/:id`
Soft-delete a workspace.

---

## Nodes

### `POST /api/workspaces/:id/nodes`
Add a node to a workspace.

**Request body:**
```json
{
  "type": "risk",
  "title": "Fuel & LPG Price Surge",
  "content": "Domestic petrol and LPG prices expected to rise 10–20%…",
  "tags": ["lpg", "fuel", "inflation"],
  "position": { "x": 620, "y": 260 },
  "metadata": { "status": "watching", "priority": "high", "confidence": "high" },
  "source": {
    "url": "https://example.com/article",
    "name": "Economic Times",
    "type": "news",
    "publishedAt": "2026-03-10"
  }
}
```

**Response `201`:** Created `BoardNode` with `id`, `createdAt`, `updatedAt`.

---

### `PUT /api/workspaces/:id/nodes/:nodeId`
Update a node (full or partial).

**Request body:** Partial `BoardNode`.

**Response `200`:** Updated `BoardNode`.

---

### `PATCH /api/workspaces/:id/nodes/:nodeId/position`
Update only a node's canvas position (used during drag-end to avoid full node writes).

**Request body:**
```json
{ "x": 340, "y": 180 }
```

**Response `200`:** `{ "ok": true }`

---

### `DELETE /api/workspaces/:id/nodes/:nodeId`
Remove a node (and cascade-delete its edges server-side).

---

## Edges

### `POST /api/workspaces/:id/edges`
Create a connection between two nodes.

**Request body:**
```json
{
  "sourceNodeId": "node-1",
  "targetNodeId": "node-3",
  "relationType": "causes",
  "label": "causes"
}
```

**Response `201`:** Created `BoardEdge`.

---

### `DELETE /api/workspaces/:id/edges/:edgeId`
Remove an edge.

---

## AI Analysis

### `POST /api/analysis/run`
Run an AI action server-side (recommended for production to keep API keys off the client).

**Request body:**
```json
{
  "workspaceId": "ws_abc123",
  "nodeId": "node-3",
  "action": "analyzeCrisis",
  "provider": "openai",
  "model": "gpt-4o",
  "params": {
    "event": "Iran–US Strait of Hormuz Tensions",
    "context": "Naval confrontations and diplomatic breakdown…",
    "region": "Middle East"
  }
}
```

**Response `200`:**
```json
{
  "id": "result_xyz",
  "output": "## Crisis Impact Analysis\n\n...",
  "provider": "openai",
  "model": "gpt-4o",
  "promptType": "analyzeCrisis",
  "createdAt": "2026-03-11T09:00:00Z"
}
```

**Security note:** When running AI server-side, API keys live in backend environment
variables. The frontend sends `provider` + `model` without keys.

---

### `GET /api/analysis/history`
Retrieve recent analysis results for the user.

**Query params:** `?workspaceId=ws_abc123&limit=50`

---

## Provider Config (server-managed keys)

### `POST /api/providers/config`
Save provider preferences (model, temperature) server-side. **Never store raw API keys
in your database.** Store them in environment variables or a secrets manager.

**Request body:**
```json
{
  "provider": "openai",
  "model": "gpt-4o",
  "temperature": 0.7
}
```

---

### `POST /api/providers/test`
Test that a configured provider is reachable.

**Request body:** `{ "provider": "openai" }`

**Response `200`:** `{ "ok": true, "latencyMs": 342 }` or `{ "ok": false, "error": "…" }`

---

## News Ingestion

### `POST /api/news/import`
Import a news item as a board node.

**Request body:**
```json
{
  "workspaceId": "ws_abc123",
  "headline": "Brent Crude Rises 6% on Supply Fears",
  "summary": "Oil markets reacted sharply…",
  "url": "https://example.com/article",
  "source": "Bloomberg",
  "publishedAt": "2026-03-11",
  "tags": ["brent", "crude", "oil-price"],
  "targetNodeType": "news"
}
```

**Response `201`:** Created `BoardNode`.

---

### `GET /api/news/feed`
Proxy a news feed (hides API key from client).

**Query params:** `?q=iran+oil+crisis&limit=10`

**Response `200`:**
```json
{
  "items": [
    {
      "id": "newsapi-1",
      "headline": "…",
      "summary": "…",
      "url": "…",
      "source": "Reuters",
      "publishedAt": "2026-03-11",
      "tags": []
    }
  ]
}
```

---

## Sync

### `POST /api/sync/push`
Push a full workspace snapshot from the client to the server (used for initial migration
from localStorage or periodic offline sync).

**Request body:** Full `Workspace` object.

**Response `200`:** `{ "merged": true, "serverUpdatedAt": "2026-03-11T10:00:00Z" }`

---

### `POST /api/sync/pull`
Pull the latest server state for a workspace.

**Request body:** `{ "workspaceId": "ws_abc123", "clientUpdatedAt": "2026-03-11T09:50:00Z" }`

**Response `200`:** Full `Workspace` if server is newer; `{ "upToDate": true }` otherwise.

---

## Sync Strategy Notes

1. **Optimistic local-first**: All changes are written to `localStorage` immediately.
   Server sync happens in the background.

2. **Conflict resolution**: Use `updatedAt` timestamps. Server wins on conflicts for
   simplicity; for production, consider CRDTs or operational transforms.

3. **Partial sync**: Prefer sending individual node/edge mutations rather than full
   workspace snapshots to reduce payload size.

4. **Offline support**: Queue failed API calls in `IndexedDB` and replay them when
   connectivity is restored.

5. **WebSocket (future)**: For real-time collaborative boards, add a WebSocket channel
   per workspace and broadcast node position updates.

---

## LangGraph Integration Notes

[LangGraph](https://github.com/langchain-ai/langgraph) enables stateful, graph-based
AI workflow orchestration. Here is how it could map to Crisis Planning:

### Recommended graph: `CrisisAnalysisGraph`

```
EntryNode
  ↓
EventClassifier      (classify: geopolitical / economic / natural / social)
  ↓
ImpactExpander       (fan-out: energy / supply / financial / social effects)
  ↓
RiskMapper           (score each impact as risk)
  ↓
OpportunityExtractor (flip risks into opportunities where applicable)
  ↓
TacticsGenerator     (generate actionable tactics per opportunity)
  ↓
FinancePlanBuilder   (crisis finance plan from risk set)
  ↓
SynthesisNode        (combine all outputs into executive summary)
  ↓
OutputFormatter
```

### Integration boundary

Keep LangGraph server-side. Expose it via `POST /api/analysis/graph-run`:

```json
{
  "workspaceId": "ws_abc123",
  "entryEvent": "Iran–US Strait of Hormuz Tensions",
  "context": "…",
  "region": "Middle East",
  "graphId": "crisis-analysis-v1"
}
```

The graph runs multi-step analysis and creates multiple nodes on the board automatically.

### Client scaffold

`src/lib/crisis/langGraph/` — placeholder directory for future LangGraph client bindings:
- `types.ts` — graph input/output types
- `client.ts` — API client for graph-run endpoint
- `useGraphRun.ts` — React hook for running and streaming graph results

---

## Implementation Checklist

When adding a real backend:

- [ ] Implement JWT or session auth
- [ ] Add `POST /api/workspaces` and migrate localStorage → server on first login
- [ ] Move AI API keys to backend environment variables
- [ ] Add `POST /api/news/feed` proxy to hide NewsAPI key
- [ ] Add WebSocket for real-time sync
- [ ] Implement offline queue with `IndexedDB`
- [ ] Add LangGraph server with `CrisisAnalysisGraph`
- [ ] Add rate limiting on `/api/analysis/run`
- [ ] Add audit log for all AI analysis runs
