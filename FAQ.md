# CHAOS Memory System - Frequently Asked Questions

## General Questions

### What is CHAOS?

CHAOS (Cognitive Heuristic Agent Operating System) is a persistent memory system for AI agents. It stores knowledge, decisions, and context with heat-based ranking, enabling agents to recall critical information across sessions and conversations.

Unlike simple chat history or RAG systems, CHAOS actively manages memory importance through:
- **Heat decay**: Stale information naturally fades
- **Access patterns**: Frequently retrieved memories stay relevant
- **Hybrid search**: Vector + keyword + temporal ranking for best results

---

### Why "CHAOS"?

It stands for **Cognitive Heuristic Agent Operating System**. The name reflects the system's ability to bring order to the chaos of multi-session agent conversations by intelligently managing what's remembered and what's forgotten.

---

### Who is CHAOS for?

**Primary Users:**
- AI researchers running multi-agent systems
- Developers building autonomous agents (OpenClaw, AutoGPT, LangChain)
- Teams deploying production AI assistants that need persistent context
- Enterprises managing knowledge across AI workflows

**Use Cases:**
- Customer support bots that remember past interactions
- Development agents tracking project decisions and code context
- Research assistants maintaining domain knowledge
- Personal AI assistants learning user preferences over time

---

### How is CHAOS different from vector databases?

| Feature | CHAOS | Traditional Vector DBs |
|---------|-------|------------------------|
| **Time awareness** | Heat decay, recency boost | Static embeddings |
| **Search method** | Hybrid (vector + keyword + heat) | Vector similarity only |
| **Memory categories** | Core, semantic, episodic, working | Single namespace |
| **Decision tracking** | First-class objects with lineage | Not supported |
| **Data versioning** | Built-in (Dolt backend) | Requires separate tooling |

CHAOS is optimized for **temporal knowledge** that evolves and decays, not just static document retrieval.

---

### Can I use CHAOS without embeddings?

Yes! CHAOS works in **three modes**:

1. **Keyword-only**: Pure text search with heat ranking (zero AI costs)
2. **Hybrid (recommended)**: Vector + keyword + heat for best accuracy
3. **Vector-only**: Pure semantic search (good for conceptual queries)

For budget-conscious users, keyword-only mode provides 70-80% of the value with no embedding costs.

---

## Pricing & Plans

### Is there a free tier?

Yes! The **Free Plan** includes:
- ✅ 1,000 memories (more than enough for personal use)
- ✅ All core features (heat, categories, decisions)
- ✅ Hybrid search (if you provide your own OpenAI key)
- ✅ Community support (Discord, GitHub)
- ❌ No API access (CLI only)
- ❌ No team features

Perfect for individual developers, researchers, and hobbyists.

---

### What's included in Pro?

The **Pro Plan** ($19/month) adds:
- ✅ 50,000 memories (50x more than Free)
- ✅ REST API access (integrate with any stack)
- ✅ Managed embeddings (we handle OpenAI API costs)
- ✅ Priority support (email, 24h response)
- ✅ Advanced analytics (heat distribution, search quality)
- ✅ Automated backups

Best for power users and small teams running production agents.

---

### What's Team tier for?

The **Team Plan** ($79/month) is for organizations:
- ✅ 500,000 memories (10x Pro)
- ✅ Multi-user workspaces (shared memories, role-based access)
- ✅ Audit logs (who accessed what, when)
- ✅ SSO/SAML authentication
- ✅ SLA guarantee (99.5% uptime)
- ✅ Dedicated support (Slack channel, video calls)
- ✅ Custom integrations (LangChain, OpenClaw, etc.)

Includes 5 seats; $15/month per additional user.

---

### Can I self-host for free?

Absolutely! CHAOS is **open-source** (MIT license). Self-host on your own infrastructure and pay zero—forever.

**You get:**
- ✅ All features (no artificial limits)
- ✅ Full control over data
- ✅ No vendor lock-in
- ✅ Community support

**You're responsible for:**
- ❌ Server hosting & maintenance
- ❌ Database backups
- ❌ Security updates
- ❌ Embedding API costs (if using vectors)

See our [Self-Hosting Guide](SELF_HOSTING_GUIDE.md) for setup instructions.

---

## Technical Questions

### What databases does CHAOS support?

**Production-ready:**
- **Dolt** (recommended): Git-like versioning for data
- **MySQL 8.0+**: Standard relational database
- **MariaDB 10.5+**: MySQL-compatible alternative

**Development only:**
- **SQLite**: Lightweight, file-based (not for production)

We recommend **Dolt** for its version control features (`dolt diff`, `dolt log`, `dolt branch`), which are invaluable for debugging memory issues.

---

### How do I handle embedding costs?

**Option 1: Use your own API key**
- Bring your own OpenAI/Voyage/Cohere key
- Pay only for what you use (~$0.02 per 1M tokens with OpenAI)
- Full control over embedding model

**Option 2: Use managed embeddings (Pro/Team)**
- We handle API costs and optimization
- Pooled credits across all users
- Automatic retries and failover

**Option 3: Self-host with local models**
- Use Ollama with `nomic-embed-text` (free, open-source)
- ~200ms latency vs. 50ms for OpenAI
- No external API calls

---

### Can CHAOS run on-premises?

Yes! CHAOS is designed for air-gapped deployments:

```bash
# Download binary and schema
curl -L https://chaoshq.ai/downloads/chaos-cli-linux-amd64 -o chaos-cli
curl -L https://chaoshq.ai/downloads/schema.sql -o schema.sql

# Deploy to isolated network
scp chaos-cli schema.sql user@internal-server:/opt/chaos/
ssh user@internal-server "cd /opt/chaos && ./setup.sh"
```

No internet connection required (except for embedding APIs, if used).

---

### What's the max memory capacity?

**Practical limits (tested):**
- **1 million memories**: ~6 GB storage (with embeddings)
- **10 million memories**: ~60 GB storage
- Search latency stays under 100ms with proper indexing

**Theoretical limit:**
- MySQL max table size: 64 TB (effectively unlimited)
- Dolt recommended: < 100 GB per database for best performance

For extreme scale (100M+ memories), use database sharding or archival strategies.

---

### How fast is search?

**Single instance, 100K memories:**
- Keyword-only search: **12ms** (p50), **25ms** (p99)
- Hybrid search (with vectors): **45ms** (p50), **80ms** (p99)
- Heat update: **3ms** (p50), **6ms** (p99)

**With caching enabled:**
- Hot queries (cache hit): **2ms**

Latency scales logarithmically with memory count, not linearly.

---

### Does CHAOS support real-time collaboration?

**Current state:**
- Multiple agents can read/write concurrently (Dolt handles conflicts)
- Shared memories across agents in the same workspace
- No live sync (agents poll for updates)

**Planned features:**
- WebSocket API for real-time memory updates
- Conflict-free replicated data types (CRDTs) for distributed teams
- Event stream for memory change notifications

---

## Integration Questions

### Can I use CHAOS with LangChain?

Yes! We provide official LangChain integration:

```python
from langchain.memory import CHAOSMemory

memory = CHAOSMemory(
    api_key="your_api_key",  # Pro/Team only
    # Or self-hosted:
    db_url="mysql://user:pass@localhost:3306/chaos_memory"
)

# Use in chains
from langchain.chains import ConversationChain

chain = ConversationChain(memory=memory)
chain.run("What did we decide about the API design?")
```

---

### Does CHAOS work with OpenClaw?

Absolutely! CHAOS was built alongside OpenClaw. Integration is seamless:

```bash
# Add CHAOS skill to OpenClaw
openclaw skill install chaos-memory

# Use in agent workflows
scripts/chaos.sh context "relevant query" >> agent_context.txt
```

OpenClaw agents can automatically store decisions, learnings, and context in CHAOS.

---

### Can I export my data?

Yes, always. CHAOS supports multiple export formats:

```bash
# JSON export
chaos-cli export --format json --output chaos_backup.json

# CSV export (for analysis)
chaos-cli export --format csv --output memories.csv

# SQL dump (for migration)
mysqldump -u chaos -p chaos_memory > full_backup.sql
```

**No vendor lock-in.** Your data is yours, always.

---

### Can I migrate from other memory systems?

Yes! We provide migration scripts for:

- **Pinecone**: `chaos-cli migrate --from pinecone --api-key <key>`
- **Weaviate**: `chaos-cli migrate --from weaviate --url <url>`
- **ChromaDB**: `chaos-cli migrate --from chromadb --path <path>`
- **Custom JSON**: `chaos-cli import --file data.json`

Migration preserves embeddings and metadata where possible.

---

## Privacy & Security

### Where is my data stored?

**Cloud Hosted (Pro/Team):**
- Primary: AWS us-east-1 (Virginia)
- Backups: AWS us-west-2 (Oregon)
- EU region available on request (GDPR compliance)

**Self-Hosted:**
- You choose the location (your servers, your rules)

We never train on your data or share it with third parties.

---

### Is my data encrypted?

**In transit:**
- TLS 1.3 for all API connections
- Certificate pinning for mobile/desktop clients

**At rest:**
- AES-256 encryption for database files (MySQL/Dolt native)
- Encrypted backups (GPG-encrypted before S3 upload)

**Embeddings:**
- Stored as encrypted binary blobs
- Never logged or cached in plaintext

---

### Can I delete my data?

Yes, always. Two options:

**Soft delete (reversible):**
```bash
chaos-cli delete --id <memory-id>  # Marks as deleted, keeps in DB
chaos-cli undelete --id <memory-id>  # Restore within 30 days
```

**Hard delete (permanent):**
```bash
chaos-cli purge --id <memory-id>  # Immediate, irreversible
```

Account deletion removes ALL data within 7 days (GDPR compliance).

---

### Do you train on my memories?

**No.** Never. Your data is not used for:
- ❌ Model training
- ❌ Product improvements
- ❌ Analytics (except anonymous aggregate metrics like "avg search latency")

We use your data **only** to provide the service you pay for.

---

## Troubleshooting

### Why are my search results stale?

**Cause:** Heat decay has reduced relevance of old memories.

**Solution:**
```bash
# Boost heat for specific memory
chaos-cli boost --id <memory-id> --heat 0.9

# Adjust decay rate (slower decay)
chaos-cli config set heat_decay 0.98  # Default: 0.95

# Disable decay for critical memories
chaos-cli update --id <memory-id> --category core  # Core decays slowest
```

---

### Why is search slow?

**Cause:** Missing database indexes or large result sets.

**Solution:**
```bash
# Check for missing indexes
chaos-cli doctor  # Auto-detects missing indexes

# Add custom indexes (if needed)
mysql -u chaos -p chaos_memory
CREATE INDEX idx_custom ON memories(category, heat DESC);

# Limit search results
chaos-cli search "query" --limit 5  # Default: 10
```

---

### How do I handle "Connection refused" errors?

**Check database status:**
```bash
sudo systemctl status mysql  # or 'dolt'
netstat -tuln | grep 3306  # Verify port is open
```

**Check credentials:**
```bash
mysql -u chaos -p -h localhost chaos_memory -e "SELECT 1;"
```

**Check firewall:**
```bash
sudo ufw status  # Ensure port 3306 is allowed (if remote)
```

---

### Can I recover deleted memories?

**If soft deleted (default):**
```bash
chaos-cli undelete --id <memory-id>  # Works within 30 days
```

**If hard deleted (purged):**
- Not recoverable from CHAOS
- Restore from backups (if available)

**If using Dolt:**
```bash
# Dolt versioning lets you roll back!
dolt log  # Find commit before deletion
dolt reset --hard <commit-hash>
```

---

## Billing & Support

### How do I upgrade/downgrade?

**Cloud hosted:**
1. Log in to https://app.chaoshq.ai
2. Settings → Billing → Change Plan
3. Changes apply immediately (prorated)

**Self-hosted:**
- No billing (free forever)
- Upgrade by pulling latest code

---

### What payment methods do you accept?

- Credit/debit cards (Visa, Mastercard, Amex)
- ACH bank transfer (Team tier only, annual billing)
- PayPal (on request)
- Cryptocurrency (Bitcoin, USDC via Coinbase Commerce)

---

### Can I get a refund?

Yes! We offer a **30-day money-back guarantee** (no questions asked).

After 30 days:
- Refunds on a case-by-case basis
- Contact support@chaoshq.ai with details

---

### How do I contact support?

**Free tier:**
- Discord community: https://discord.gg/chaoshq
- GitHub issues: https://github.com/hargabyte/chaos-memory/issues

**Pro tier:**
- Email: support@chaoshq.ai (24h response)
- In-app chat (dashboard)

**Team tier:**
- Dedicated Slack channel
- Video call support (schedule via dashboard)
- Emergency phone support (critical issues only)

---

## Roadmap & Features

### What's coming next?

**Q1 2026:**
- ✅ Web dashboard (v1.0)
- ✅ LangChain integration
- ⏳ Multi-modal embeddings (images, audio)
- ⏳ Knowledge graph view (Neo4j integration)

**Q2 2026:**
- Real-time collaboration (WebSocket API)
- Federated search (cross-instance queries)
- Auto-categorization (ML-based)
- Mobile SDK (iOS, Android)

**Q3 2026:**
- Distributed clustering (Raft consensus)
- Advanced analytics (memory lifecycle, search quality)
- Custom decay functions (per-memory-type learning)

---

### Can I request features?

Yes! We prioritize based on customer demand:

1. **Upvote existing requests**: https://chaoshq.ai/roadmap
2. **Submit new ideas**: https://chaoshq.ai/feedback
3. **Sponsor features**: Team tier includes feature sponsorship

Most-requested features get built first.

---

### Is CHAOS open-source forever?

Yes. CHAOS core is **MIT licensed** and will always be open-source.

**What's open:**
- Core memory engine (heat, search, decisions)
- CLI tool
- Database schema
- Python/JavaScript SDKs

**What's proprietary:**
- Managed cloud hosting
- Web dashboard (for paid tiers)
- Advanced analytics

Self-hosters get the full engine; cloud users get convenience and support.

---

## Still Have Questions?

- **Documentation**: https://docs.chaoshq.ai
- **Community Discord**: https://discord.gg/chaoshq
- **Email**: support@chaoshq.ai
- **GitHub**: https://github.com/hargabyte/chaos-memory

---

**Last Updated**: February 16, 2026
**Version**: 0.13.0
