# CHAOS Memory System - Architecture Documentation

## System Overview

CHAOS (Cognitive Heuristic Agent Operating System) is a persistent, heat-weighted memory system designed for AI agents. It combines vector embeddings, keyword search, and temporal heat metrics to provide intelligent context retrieval across conversations and sessions.

---

## Core Principles

### 1. Heat-Weighted Recall
Memories aren't just stored—they have **heat** that increases with:
- Recency (recently created or accessed)
- Access frequency (how often retrieved)
- Explicit priority (user-assigned importance)

Heat naturally **decays over time** (configurable), ensuring stale information doesn't dominate fresh insights.

### 2. Hybrid Search
No single search method is perfect. CHAOS combines:
- **Vector embeddings** (semantic similarity)
- **Keyword matching** (exact terms)
- **Heat scoring** (temporal relevance)

Weighted fusion delivers the most contextually relevant results.

### 3. Category-Aware Storage
Not all memories are equal. CHAOS categorizes knowledge:
- **Core**: Facts, constants, capabilities (low decay)
- **Semantic**: Concepts, relationships, learnings (medium decay)
- **Episodic**: Events, conversations, incidents (high decay)
- **Working**: Temporary context (aggressive decay)

Each category has different decay rates and retrieval strategies.

### 4. Decision Lineage
Critical decisions are first-class objects with:
- Context (why was this decided?)
- Outcome (what happened?)
- Relations (what did this influence?)

Enables "why did we decide X?" queries across sessions.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  chaos-cli │  │  Python SDK  │  │  REST API (8080)   │  │
│  │  (Go CLI)  │  │  (LangChain) │  │  (FastAPI/Express) │  │
│  └────────────┘  └──────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Memory Engine Core                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Heat Manager (decay, boost, normalization)          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Search Orchestrator (hybrid fusion, ranking)        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Decision Graph (relations, outcomes, lineage)       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Storage Layer                            │
│  ┌───────────────┐  ┌────────────────┐  ┌───────────────┐  │
│  │ SQL Database  │  │ Vector Store   │  │ Redis Cache   │  │
│  │ (Dolt/MySQL)  │  │ (pgvector)     │  │ (optional)    │  │
│  └───────────────┘  └────────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ OpenAI API     │  │ Anthropic API  │  │ Local LLM    │  │
│  │ (embeddings)   │  │ (embeddings)   │  │ (Ollama)     │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Model

### Core Tables

#### `memories` Table
```sql
CREATE TABLE memories (
  id VARCHAR(36) PRIMARY KEY,
  content TEXT NOT NULL,
  category ENUM('core', 'semantic', 'episodic', 'working'),
  priority DECIMAL(3,2) DEFAULT 0.5,
  heat DECIMAL(5,4) DEFAULT 1.0,
  embedding BLOB,  -- Vector embedding (optional)
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  accessed_at TIMESTAMP,
  access_count INT DEFAULT 0,
  tags JSON,
  
  INDEX idx_category (category),
  INDEX idx_heat (heat DESC),
  INDEX idx_priority (priority DESC),
  INDEX idx_created (created_at DESC),
  FULLTEXT INDEX idx_content (content)
);
```

#### `decisions` Table
```sql
CREATE TABLE decisions (
  id VARCHAR(36) PRIMARY KEY,
  decision TEXT NOT NULL,
  context TEXT,
  outcome TEXT,
  decided_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  memory_id VARCHAR(36),
  
  FOREIGN KEY (memory_id) REFERENCES memories(id) ON DELETE SET NULL,
  INDEX idx_decided (decided_at DESC)
);
```

#### `relations` Table
```sql
CREATE TABLE relations (
  id VARCHAR(36) PRIMARY KEY,
  source_id VARCHAR(36) NOT NULL,
  target_id VARCHAR(36) NOT NULL,
  relation_type VARCHAR(50),  -- 'influences', 'depends_on', 'contradicts', etc.
  strength DECIMAL(3,2) DEFAULT 0.5,
  
  FOREIGN KEY (source_id) REFERENCES memories(id) ON DELETE CASCADE,
  FOREIGN KEY (target_id) REFERENCES memories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_relation (source_id, target_id, relation_type)
);
```

---

## Heat Dynamics

### Heat Calculation

Heat is a composite score reflecting memory relevance:

```
heat = base_heat × recency_boost × access_boost × priority_weight × decay_factor
```

**Components:**
- `base_heat`: Initial heat (1.0 for new memories)
- `recency_boost`: Time since creation (exponential decay)
- `access_boost`: Access frequency (logarithmic scaling)
- `priority_weight`: User-assigned importance (0.0-1.0)
- `decay_factor`: Category-specific decay rate

### Heat Decay Formula

```
new_heat = current_heat × decay_rate^(hours_elapsed)
```

**Default Decay Rates by Category:**
- Core: 0.99 (slow decay, ~69 hours to halve)
- Semantic: 0.95 (medium decay, ~14 hours to halve)
- Episodic: 0.90 (fast decay, ~7 hours to halve)
- Working: 0.80 (aggressive decay, ~3 hours to halve)

### Recency Boost

Recent memories get amplified:

```python
def recency_boost(created_at, boost_factor=1.5):
    hours_old = (now() - created_at).total_seconds() / 3600
    return max(1.0, boost_factor / (1 + hours_old / 24))
```

### Access Boost

Frequently accessed memories stay hot:

```python
def access_boost(access_count):
    return 1 + (0.1 * log10(1 + access_count))
```

---

## Search Algorithm

### Hybrid Search Fusion

CHAOS fuses multiple search methods with configurable weights:

```python
def hybrid_search(query, weights={'vector': 0.4, 'keyword': 0.3, 'heat': 0.3}):
    # Vector similarity (semantic)
    vector_scores = cosine_similarity(query_embedding, memory_embeddings)
    
    # Keyword matching (exact terms)
    keyword_scores = bm25_score(query, memory_contents)
    
    # Heat scores (temporal relevance)
    heat_scores = normalize(memory_heats)
    
    # Weighted fusion
    final_scores = (
        weights['vector'] * vector_scores +
        weights['keyword'] * keyword_scores +
        weights['heat'] * heat_scores
    )
    
    return rank_and_return(final_scores, limit=10)
```

### Category Filtering

Searches can be scoped to specific categories:

```sql
-- Retrieve only core facts
SELECT * FROM memories WHERE category = 'core' ORDER BY heat DESC LIMIT 10;

-- Combine categories
SELECT * FROM memories 
WHERE category IN ('core', 'semantic') 
ORDER BY heat DESC LIMIT 10;
```

### Time-Windowed Search

Focus on recent context:

```sql
-- Last 24 hours
SELECT * FROM memories 
WHERE created_at > NOW() - INTERVAL 24 HOUR
ORDER BY heat DESC;
```

---

## Memory Lifecycle

### 1. Creation
```
User/Agent → chaos-cli add → Memory Engine → Database
                                    ↓
                             Generate embedding (if enabled)
                             Set initial heat = 1.0
                             Apply category rules
```

### 2. Retrieval
```
Query → Search Orchestrator → Hybrid Search → Ranked Results
              ↓                      ↓
        Update accessed_at    Increment access_count
        Boost heat            Update heat score
```

### 3. Decay
```
Background Task (hourly) → Heat Manager → Apply decay formula
                                    ↓
                           Normalize heat distribution
                           Archive cold memories (heat < 0.01)
```

### 4. Archival
Low-heat memories (heat < threshold) are moved to archive:

```sql
-- Archive cold memories
INSERT INTO memories_archive 
SELECT * FROM memories WHERE heat < 0.01;

DELETE FROM memories WHERE heat < 0.01;
```

---

## Embedding Strategy

### Vector Generation

CHAOS supports multiple embedding providers:

**OpenAI (text-embedding-3-small):**
- Dimensions: 1536
- Cost: $0.02 / 1M tokens
- Speed: ~50ms per embedding

**Voyage AI (voyage-2):**
- Dimensions: 1024
- Cost: $0.12 / 1M tokens
- Quality: Best for technical content

**Local Models (Ollama):**
- Model: nomic-embed-text
- Dimensions: 768
- Cost: Free (self-hosted)
- Speed: ~200ms per embedding

### Embedding Storage

Embeddings are stored as binary blobs in the database:

```python
import struct

# Serialize embedding
embedding_bytes = struct.pack(f'{len(vector)}f', *vector)

# Store in DB
cursor.execute(
    "UPDATE memories SET embedding = %s WHERE id = %s",
    (embedding_bytes, memory_id)
)
```

### Similarity Search

Cosine similarity is used for vector comparison:

```python
def cosine_similarity(vec_a, vec_b):
    dot_product = np.dot(vec_a, vec_b)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    return dot_product / (norm_a * norm_b)
```

---

## Concurrency & Scaling

### Read Scaling

- **Connection pooling**: 50 connections per instance
- **Read replicas**: Dolt supports read replicas for high traffic
- **Caching**: Redis cache for hot memories (TTL: 5 minutes)

### Write Scaling

- **Batch inserts**: Bulk memory creation in transactions
- **Async processing**: Background tasks for embedding generation
- **Write-ahead log**: Dolt's WAL prevents write conflicts

### Horizontal Scaling

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│ CHAOS API  │     │ CHAOS API  │     │ CHAOS API  │
│ Instance 1 │     │ Instance 2 │     │ Instance 3 │
└──────┬─────┘     └──────┬─────┘     └──────┬─────┘
       │                  │                  │
       └──────────────────┴──────────────────┘
                          │
                   ┌──────┴──────┐
                   │  Load Bal.  │
                   │  (Nginx)    │
                   └──────┬──────┘
                          │
       ┌──────────────────┴──────────────────┐
       │                                     │
  ┌────┴────┐                          ┌────┴────┐
  │ Primary │                          │ Read    │
  │ Dolt DB │◄─────── Replication ────►│ Replica │
  └─────────┘                          └─────────┘
```

---

## Performance Benchmarks

### Latency (single instance, 10K memories)

| Operation | Avg Latency | P99 Latency |
|-----------|-------------|-------------|
| Add memory | 8ms | 15ms |
| Hybrid search (no vector) | 12ms | 25ms |
| Hybrid search (with vector) | 45ms | 80ms |
| Heat update | 3ms | 6ms |
| Decision recording | 10ms | 18ms |

### Throughput (8-core server)

| Operation | Req/sec |
|-----------|---------|
| Read (cache hit) | 15,000 |
| Read (cache miss) | 2,500 |
| Write (single) | 1,200 |
| Write (batch 100) | 8,000 |

### Storage Efficiency

- Avg memory size: 250 bytes (text) + 6KB (embedding)
- 1M memories: ~6.25 GB (with embeddings), ~250 MB (text only)
- Dolt overhead: ~15% (versioning metadata)

---

## Security Architecture

### Authentication

```
Client → API Key (header) → Validate → Rate Limit → Execute
                                ↓
                         Audit log (who accessed what)
```

### Authorization

Role-based access control (RBAC):

```yaml
roles:
  reader:
    - memory:read
    - memory:search
  
  writer:
    - memory:read
    - memory:search
    - memory:create
    - memory:update
  
  admin:
    - memory:*
    - decision:*
    - system:config
```

### Data Encryption

- **At rest**: MySQL/Dolt encryption-at-rest (AES-256)
- **In transit**: TLS 1.3 for API connections
- **Embeddings**: Encrypted blobs in database

---

## Monitoring & Observability

### Key Metrics

```
# Heat distribution
chaos.memory.heat.avg
chaos.memory.heat.p50
chaos.memory.heat.p95

# Search performance
chaos.search.latency.avg
chaos.search.latency.p99
chaos.search.results.count

# Database health
chaos.db.connections.active
chaos.db.queries.slow_count
chaos.db.size.bytes
```

### Health Check Endpoint

```bash
GET /health
{
  "status": "healthy",
  "database": "connected",
  "embeddings": "available",
  "memory_count": 12458,
  "avg_heat": 0.42,
  "uptime_seconds": 86400
}
```

---

## Future Enhancements

### Planned Features
- **Multi-modal memories**: Image, audio, video embeddings
- **Distributed consensus**: Raft-based clustering for HA
- **Knowledge graphs**: Neo4j integration for complex relations
- **Federated search**: Cross-instance memory federation
- **Auto-categorization**: ML-based category prediction

### Research Areas
- **Adaptive decay**: Learn decay rates per memory type
- **Collaborative filtering**: Share anonymized memories across orgs
- **Compression**: Sparse embeddings for storage efficiency

---

## Contributing

CHAOS is open-source. Contributions welcome:

- **GitHub**: https://github.com/hargabyte/chaos-memory
- **Docs**: https://docs.chaoshq.ai
- **Discord**: https://discord.gg/chaoshq

---

**Last Updated**: February 16, 2026
**Version**: 0.13.0
