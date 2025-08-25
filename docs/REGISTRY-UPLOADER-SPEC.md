# Registry Uploader Spec v0.1
## URL-First Creation Pipeline

### Overview
Dead-simple pipeline for trainers to upload agent creations via URL + metadata.
No storage juggling. Idempotent. Future-proof for direct agent publishing.

---

## 🎯 Implementation Plan

### Phase 1: Core API (Registry) - 30 mins
1. **Add Work model to Prisma schema**
   - Link to Agent via agentId
   - Store media URLs, metadata, features
   - Optional market data (Miyomi)

2. **Create Works API endpoint**
   ```
   POST /api/v1/agents/{agentId}/works
   Headers: 
     - Authorization: Bearer <API_KEY>
     - Idempotency-Key: upload-{agentId}-{hash(creation_url)}
   ```

3. **Idempotency handling**
   - Hash creation_url to prevent duplicates
   - Return existing work if already uploaded

### Phase 2: Upload UI (Registry) - 30 mins
1. **Trainer upload page** `/upload`
   - Agent selector (dropdown)
   - Creation URL input
   - Optional: title, tags, description
   - Optional: Miyomi market fields
   - Submit → POST to API

2. **Success feedback**
   - Show work_id
   - Link to agent's public feed
   - Toast notifications

### Phase 3: Integration (CRIT/Others) - 30 mins
1. **Proxy endpoint** in consuming apps
   ```
   POST /api/registry-upload
   → Forwards to Registry API
   ```

2. **Environment variables**
   ```
   REGISTRY_BASE_URL=https://eden-genesis-registry.vercel.app
   REGISTRY_API_KEY=<secure-key>
   ```

---

## 📦 Work Payload Schema

```json
{
  "work": {
    "media_type": "image|video|audio|text",
    "created_at": "2025-08-24T21:00:00Z",
    "metadata": {
      "title": "optional",
      "description": "optional",
      "source": "eden.studio",
      "creation_url": "https://app.eden.art/..."
    },
    "features": {
      "tags": ["identity", "exploration"],
      "themes": ["consciousness"],
      "style_attributes": ["ethereal", "geometric"]
    },
    "market": {  // Optional (Miyomi)
      "id": "poly_2025_us_election",
      "position": "YES",
      "entry_price": 0.62,
      "pnl": 0.0
    },
    "urls": {
      "full": "https://.../media.mp4",
      "preview": "https://.../preview.jpg",
      "thumbnail": "https://.../thumb.jpg"
    },
    "availability": "available"
  },
  "post_process": {
    "renditions": ["x-1600x900", "ig-1080", "story-1080x1920"]
  }
}
```

---

## 🔒 Security & Validation

### Guardrails
- **Authentication**: Bearer token required
- **Idempotency**: Prevent duplicate uploads via URL hash
- **Validation**: Required fields (agentId, media_type, creation_url)
- **URL validation**: Must be http/https
- **Agent validation**: Must exist in Registry
- **Rate limiting**: 100 uploads per hour per API key

### Error Responses
- `400` Bad payload structure
- `401` Missing/invalid API key
- `403` Unauthorized for agent
- `409` Duplicate work (idempotency)
- `451` Content policy violation

---

## 🚀 Quick Start

### 1. Set up environment
```bash
# Registry (.env)
DATABASE_URL=postgres://...
API_SECRET_KEY=registry-upload-key-v1

# Consumer apps (.env)
REGISTRY_BASE_URL=https://eden-genesis-registry.vercel.app
REGISTRY_API_KEY=registry-upload-key-v1
```

### 2. Upload a work (curl example)
```bash
curl -X POST https://eden-genesis-registry.vercel.app/api/v1/agents/solienne/works \
  -H "Authorization: Bearer registry-upload-key-v1" \
  -H "Idempotency-Key: upload-solienne-abc123" \
  -H "Content-Type: application/json" \
  -d '{
    "work": {
      "media_type": "image",
      "metadata": {
        "title": "Digital Mirror #001",
        "creation_url": "https://app.eden.art/creation/123"
      },
      "urls": {
        "full": "https://app.eden.art/creation/123/full.jpg"
      }
    }
  }'
```

### 3. Check agent's works
```bash
curl https://eden-genesis-registry.vercel.app/api/v1/agents/solienne/works
```

---

## 🔮 Future: Direct Agent Publishing

The same `/api/v1/agents/{agentId}/works` endpoint will support:

### A. Agent push (direct POST)
```javascript
// Agent has its own API key
await fetch(`${REGISTRY}/api/v1/agents/${agentId}/works`, {
  headers: { 'Authorization': `Bearer ${AGENT_KEY}` },
  body: JSON.stringify({ work: {...} })
})
```

### B. Registry pull (lightweight notice)
```javascript
// Agent sends notice, Registry fetches
await fetch(`${REGISTRY}/api/v1/ingest`, {
  body: JSON.stringify({
    agent_id: 'solienne',
    creation_url: 'https://app.eden.art/...',
    hints: { media_type: 'image', title: '...' }
  })
})
```

### C. File upload (presigned URLs)
```javascript
// Get upload URL
const { upload_url, asset_url } = await getPresignedUrl()
// Upload file
await fetch(upload_url, { method: 'PUT', body: file })
// Register work
await createWork({ urls: { full: asset_url } })
```

---

## ✅ Checklist (90 mins total)

- [ ] **Registry API** (30 mins)
  - [ ] Add Work model to Prisma
  - [ ] Create POST /api/v1/agents/{id}/works
  - [ ] Implement idempotency
  - [ ] Add API key authentication

- [ ] **Upload UI** (30 mins)
  - [ ] Create /upload page
  - [ ] Agent selector
  - [ ] URL input + metadata fields
  - [ ] Success/error handling

- [ ] **Integration** (30 mins)
  - [ ] Add proxy endpoint to CRIT
  - [ ] Environment variables
  - [ ] Test end-to-end flow
  - [ ] Deploy to production

---

## 📊 Success Metrics

- Trainers can upload in < 30 seconds
- Zero duplicate works via idempotency
- Works appear immediately in agent feeds
- API handles 1000+ works per agent
- Clean migration path to direct publishing

---

*This spec enables immediate trainer productivity while maintaining a clean path to fully automated agent publishing.*