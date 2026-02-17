# CHAOS Memory System - Self-Hosting Guide

## Overview

This guide helps you deploy and run the CHAOS (Cognitive Heuristic Agent Operating System) Memory System on your own infrastructure. CHAOS provides persistent, heat-weighted memory for AI agents with hybrid search (vector + keyword + heat-based retrieval).

---

## Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 22.04+ recommended) or macOS
- **Memory**: 2GB RAM minimum, 4GB+ recommended
- **Storage**: 1GB for CHAOS + database growth (scales with usage)
- **Database**: MySQL/MariaDB 8.0+ (for production) or SQLite (development)

### Required Tools
- **Node.js**: v18+ (for optional web UI)
- **Dolt** (recommended): Git-for-data SQL database
- **Git**: For version control
- **Go** (optional): For building from source

---

## Installation Methods

### Option 1: Quick Start with Pre-built Binary (Recommended)

```bash
# Download latest release
curl -L https://github.com/hargabyte/chaos-memory/releases/latest/download/chaos-cli-linux-amd64 -o chaos-cli
chmod +x chaos-cli
sudo mv chaos-cli /usr/local/bin/

# Verify installation
chaos-cli --version
```

### Option 2: Install from Source

```bash
# Clone the repository
git clone https://github.com/hargabyte/chaos-memory.git
cd chaos-memory

# Build the CLI
go build -o chaos-cli cmd/chaos-cli/main.go

# Install globally
sudo mv chaos-cli /usr/local/bin/

# Verify
chaos-cli --version
```

### Option 3: Docker Deployment

```bash
# Pull the CHAOS image
docker pull hargabyte/chaos-memory:latest

# Run with persistent volume
docker run -d \
  --name chaos-memory \
  -v chaos-data:/data \
  -p 3306:3306 \
  hargabyte/chaos-memory:latest
```

---

## Database Setup

### Using Dolt (Recommended - Version Control for Data)

Dolt provides Git-like versioning for your CHAOS memory database.

```bash
# Install Dolt
sudo bash -c 'curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | bash'

# Create CHAOS database
mkdir -p ~/chaos-memory
cd ~/chaos-memory
dolt init

# Import CHAOS schema
dolt sql < schema/chaos_schema.sql

# Start Dolt server
dolt sql-server --host 0.0.0.0 --port 3306
```

**Dolt Benefits:**
- Version control: `dolt log`, `dolt diff`, `dolt branch`
- Rollback bad imports: `dolt reset --hard HEAD~1`
- Branching for testing: `dolt checkout -b experiment`
- Remote backups: `dolt push origin main`

### Using MySQL/MariaDB

```bash
# Install MySQL
sudo apt update
sudo apt install mysql-server -y

# Create database
mysql -u root -p
CREATE DATABASE chaos_memory;
CREATE USER 'chaos'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON chaos_memory.* TO 'chaos'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u chaos -p chaos_memory < schema/chaos_schema.sql
```

### Using SQLite (Development Only)

```bash
# CHAOS will auto-create SQLite database
chaos-cli init --db-type sqlite --db-path ~/chaos-memory.db
```

---

## Configuration

### Environment Variables

Create `.env` in your CHAOS directory:

```bash
# Database configuration
CHAOS_DB_TYPE=mysql          # mysql, dolt, or sqlite
CHAOS_DB_HOST=localhost
CHAOS_DB_PORT=3306
CHAOS_DB_NAME=chaos_memory
CHAOS_DB_USER=chaos
CHAOS_DB_PASS=your_secure_password

# Memory engine settings
CHAOS_HEAT_DECAY=0.95        # Heat decay rate (0.9-0.99)
CHAOS_BOOST_RECENT=1.5       # Recent memory boost factor
CHAOS_MAX_RESULTS=10         # Default search result limit

# Vector search (optional - requires embeddings)
CHAOS_EMBEDDING_MODEL=text-embedding-3-small
CHAOS_OPENAI_API_KEY=sk-...  # For embeddings

# API settings (if running web server)
CHAOS_API_PORT=8080
CHAOS_API_HOST=0.0.0.0
```

### Configuration File

Alternatively, use `chaos.yaml`:

```yaml
database:
  type: dolt
  host: localhost
  port: 3306
  name: chaos_memory
  user: chaos
  password: ${CHAOS_DB_PASS}  # Use env var for security

memory:
  heat_decay: 0.95
  boost_recent: 1.5
  max_results: 10
  categories:
    - core       # Facts, constants
    - semantic   # Concepts, relationships
    - episodic   # Events, conversations
    - working    # Temporary context

search:
  hybrid_weights:
    vector: 0.4
    keyword: 0.3
    heat: 0.3
  
embeddings:
  provider: openai
  model: text-embedding-3-small
```

---

## Usage Examples

### Basic Memory Operations

```bash
# Add a memory
chaos-cli add "Hargabyte prefers late-night work sessions (9PM-2AM Pacific)" \
  --category semantic \
  --priority 0.9

# Search for context
chaos-cli context "work schedule preferences"

# Record a decision
chaos-cli decision "Use Dolt for version-controlled memory storage" \
  --outcome "Enables rollback, branching, and remote backups"

# View memory statistics
chaos-cli stats

# Check recent activity
chaos-cli history --limit 20
```

### Integration with AI Agents

**OpenClaw Integration:**
```bash
# Add wrapper script to OpenClaw skills
cat > scripts/chaos.sh <<'EOF'
#!/bin/bash
CHAOS_DB_HOST=localhost CHAOS_DB_PORT=3306 \
  chaos-cli "$@"
EOF
chmod +x scripts/chaos.sh

# Use in agent workflows
scripts/chaos.sh context "relevant query" >> agent_context.txt
```

**LangChain Integration:**
```python
from chaos_memory import CHAOSMemory

memory = CHAOSMemory(
    db_url="mysql://chaos:password@localhost:3306/chaos_memory"
)

# Store memory
memory.add(
    content="Key architectural decision",
    category="semantic",
    priority=0.9
)

# Retrieve context
context = memory.search("architecture decisions", limit=5)
```

---

## Backup & Recovery

### Dolt Backups (Versioned)

```bash
# Commit current state
dolt add .
dolt commit -m "Memory snapshot 2026-02-16"

# Push to remote (DoltHub or self-hosted)
dolt remote add origin <your-dolt-remote>
dolt push origin main

# Restore from backup
dolt fetch origin
dolt reset --hard origin/main
```

### MySQL Backups

```bash
# Dump database
mysqldump -u chaos -p chaos_memory > chaos_backup_$(date +%F).sql

# Restore
mysql -u chaos -p chaos_memory < chaos_backup_2026-02-16.sql
```

### Automated Backup Script

```bash
#!/bin/bash
# /usr/local/bin/chaos-backup.sh

BACKUP_DIR="/var/backups/chaos"
DATE=$(date +%F_%H-%M)

mkdir -p "$BACKUP_DIR"

if [ "$CHAOS_DB_TYPE" = "dolt" ]; then
  cd ~/chaos-memory
  dolt add .
  dolt commit -m "Auto-backup $DATE"
  dolt push origin main
else
  mysqldump -u chaos -p"$CHAOS_DB_PASS" chaos_memory | \
    gzip > "$BACKUP_DIR/chaos_$DATE.sql.gz"
fi

# Keep only last 30 days
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete
```

**Cron schedule:**
```bash
0 2 * * * /usr/local/bin/chaos-backup.sh
```

---

## Performance Tuning

### Database Optimization

**MySQL Configuration (`/etc/mysql/my.cnf`):**
```ini
[mysqld]
# Memory optimization
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M

# Query optimization
query_cache_type = 1
query_cache_size = 64M

# Connection settings
max_connections = 100
```

**Dolt Configuration:**
```bash
# Increase memory for better performance
dolt sql-server \
  --max-connections=50 \
  --query-parallelism=4
```

### Indexing Strategy

CHAOS automatically creates indexes on:
- `category` (for filtered searches)
- `priority` (for ranking)
- `heat` (for temporal relevance)
- `created_at`, `accessed_at` (for time-based queries)

**Custom indexes for heavy usage:**
```sql
-- Compound index for category + heat queries
CREATE INDEX idx_category_heat ON memories(category, heat DESC);

-- Full-text search on content
CREATE FULLTEXT INDEX idx_content_fulltext ON memories(content);
```

---

## Security Hardening

### Network Security

```bash
# Bind database to localhost only (if running on same host)
# In my.cnf or dolt config:
bind-address = 127.0.0.1

# Use UFW firewall
sudo ufw allow from 192.168.1.0/24 to any port 3306  # Internal network only
sudo ufw enable
```

### Authentication

```bash
# Use strong passwords
openssl rand -base64 32  # Generate secure password

# Rotate credentials regularly
mysql -u root -p
ALTER USER 'chaos'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Encryption at Rest

```bash
# Enable MySQL encryption
[mysqld]
early-plugin-load=keyring_file.so
keyring_file_data=/var/lib/mysql-keyring/keyring

# Encrypt table
ALTER TABLE memories ENCRYPTION='Y';
```

---

## Monitoring & Maintenance

### Health Checks

```bash
# Check CHAOS service status
chaos-cli stats
chaos-cli doctor  # Validates DB connection, indexes, schema

# Database health
mysql -u chaos -p -e "SHOW PROCESSLIST; SHOW STATUS LIKE 'Threads%';"
```

### Log Rotation

```bash
# /etc/logrotate.d/chaos-memory
/var/log/chaos/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 hargabyte hargabyte
}
```

### Scheduled Maintenance

```bash
# Weekly optimization
0 3 * * 0 mysql -u chaos -p chaos_memory -e "OPTIMIZE TABLE memories;"

# Heat decay normalization (monthly)
0 4 1 * * chaos-cli normalize-heat
```

---

## Troubleshooting

### Common Issues

**Issue: "Connection refused" when accessing database**
```bash
# Check if database is running
sudo systemctl status mysql
# or
ps aux | grep dolt

# Check port binding
netstat -tuln | grep 3306

# Verify credentials
mysql -u chaos -p -h localhost chaos_memory -e "SELECT 1;"
```

**Issue: Slow search performance**
```bash
# Analyze slow queries
mysql -u chaos -p chaos_memory
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;

# Review slow query log
tail -f /var/log/mysql/slow-query.log
```

**Issue: High memory usage**
```bash
# Check buffer pool usage
SHOW STATUS LIKE 'Innodb_buffer_pool%';

# Reduce buffer pool if needed
SET GLOBAL innodb_buffer_pool_size = 512M;
```

---

## Upgrading CHAOS

### Minor Version Updates

```bash
# Backup first!
chaos-cli backup

# Download new version
curl -L https://github.com/hargabyte/chaos-memory/releases/latest/download/chaos-cli-linux-amd64 -o chaos-cli
chmod +x chaos-cli
sudo mv chaos-cli /usr/local/bin/

# Verify upgrade
chaos-cli --version
chaos-cli doctor
```

### Major Version Updates

```bash
# Review changelog for breaking changes
curl -s https://api.github.com/repos/hargabyte/chaos-memory/releases/latest | jq -r '.body'

# Run migration scripts (if provided)
chaos-cli migrate --from v0.12 --to v0.13

# Test thoroughly before production use
```

---

## Production Deployment Checklist

- [ ] Database secured with strong password
- [ ] Firewall rules configured (UFW/iptables)
- [ ] SSL/TLS enabled for remote connections
- [ ] Automated backups configured (daily)
- [ ] Monitoring alerts set up (Uptime Kuma, Prometheus, etc.)
- [ ] Log rotation enabled
- [ ] Resource limits configured (systemd, Docker)
- [ ] Health check endpoint tested
- [ ] Disaster recovery plan documented
- [ ] Team trained on backup/restore procedures

---

## Support & Community

- **Documentation**: https://docs.chaoshq.ai
- **GitHub Issues**: https://github.com/hargabyte/chaos-memory/issues
- **Discord Community**: https://discord.gg/chaoshq
- **Email Support**: support@chaoshq.ai (Team tier only)

---

## License

CHAOS Memory System is open-source under the MIT License. See LICENSE file for details.

---

**Last Updated**: February 16, 2026
**Version**: 0.13.0
