---
title: "How to Migrate OpenClaw to Tencent Cloud Singapore | Complete Guide"
description: "Step-by-step guide to migrate OpenClaw from Baidu Cloud to Tencent Cloud Singapore. Save 90% costs, get foreign network access. Includes sensitive data removal checklist."
keywords: "OpenClaw migration, Baidu Cloud to Tencent Cloud, cloud server migration, OpenClaw tutorial, Tencent Cloud Singapore"
author: "LiuDavid"
date: "2026-03-10"
tags: ["OpenClaw", "Cloud Migration", "Tencent Cloud", "Tutorial"]
---

# How to Migrate OpenClaw to a New Cloud Server: A Complete Guide

---

**Target Audience**: DevOps engineers, developers, OpenClaw users migrating from Baidu Cloud  
**Search Intent**: Informational / How-to guide  
**Primary Keyword**: migrate OpenClaw  
**Secondary Keywords**: Baidu Cloud to Tencent Cloud, cloud server migration guide, OpenClaw setup

---

## Introduction

If you're running OpenClaw on Baidu Cloud (百度云), you've likely hit two major walls: **expensive monthly costs** (90 CNY/month after the free month) and **no foreign network access**. These limitations prevent you from installing plugins from GitHub, downloading npm packages, or calling international APIs.

Here's the solution: **Tencent Cloud Singapore** — just 99 CNY per year with full global internet access.

This guide covers:
- ✅ Backing up your OpenClaw data
- ✅ **Clearing sensitive information** (critical security step)
- ✅ Setting up Tencent Cloud Singapore
- ✅ Restoring and verifying your deployment

**Time required**: 1-2 hours  
**Cost savings**: From 1,080 CNY/year → 99 CNY/year (90% savings)

---

## Why Migrate? The Baidu Cloud Problem

Before diving into the migration process, let's address why you might want to move:

| Feature | Baidu Cloud | Tencent Cloud Singapore |
|---------|-------------|-------------------------|
| **Price (after free month)** | 90 CNY/month | 99 CNY/year |
| **Foreign Network Access** | ❌ Blocked | ✅ Full Access |
| **GitHub Access** | ❌ Limited | ✅ Unrestricted |
| **npm Package Downloads** | ❌ Slow/Blocked | ✅ Fast |
| **International API Calls** | ❌ Problematic | ✅ Stable |

**Bottom line**: 90 CNY/month × 12 months = **1,080 CNY/year** vs. **99 CNY/year** on Tencent Cloud Singapore. That's over **90% savings**, plus complete freedom to access global resources.

---

## Pre-Migration Checklist

Before you begin the migration, gather the following:

- [ ] SSH access to your current Baidu Cloud server
- [ ] Tencent Cloud account (see recommendation below)
- [ ] Backup of all important configuration files
- [ ] List of installed plugins and dependencies
- [ ] Domain DNS access (if applicable)

---

## Step-by-Step Migration Guide

### Step 1: Backup Your Current OpenClaw Data

First, connect to your Baidu Cloud server and create a complete backup:

```bash
# Navigate to your OpenClaw workspace
cd /root/.openclaw/workspace

# Create a backup archive (exclude node_modules and logs to save space)
tar -czvf openclay-backup-$(date +%Y%m%d).tar.gz \
  --exclude='node_modules' \
  --exclude='*.log' \
  --exclude='.git' \
  .
```

**Important files to back up separately:**

- `MEMORY.md` and `memory/` folder (your long-term memory)
- `USER.md` (user preferences)
- `SOUL.md` (agent configuration)
- Any custom skills or plugins in `skills/`
- Environment variables and API keys (we'll address security shortly)

Download this backup to your local machine using `scp` or a similar tool.

---

### Step 2: ⚠️ Clear Sensitive Information from Your Old Instance

**This is critical.** Before decommissioning your Baidu Cloud server, you MUST remove sensitive data. Failure to do so could give the next user of that server access to your accounts.

#### A. Git Credentials and Tokens

```bash
# Remove Git credentials
git config --global --unset-all credential.helper
rm -f ~/.git-credentials

# Remove stored GitHub tokens in git remote
cd /your/openclaw/repo
git remote remove origin
git remote add origin https://github.com/yourusername/yourrepo.git
```

#### B. API Keys and Environment Variables

```bash
# Check for hardcoded API keys
grep -r "ghp_" ~/.openclaw/workspace/ --include="*.md"
grep -r "sk-" ~/.openclaw/workspace/ --include="*.md"
grep -r "cloudflare" ~/.openclaw/workspace/ --include="*.md"

# Remove or replace sensitive values in configuration files
# Edit each file and replace actual keys with placeholders
```

#### C. SSH Keys

```bash
# Remove SSH keys if dedicated to this server
rm -rf ~/.ssh/

# If using a shared SSH agent, at least remove server-specific keys
```

#### D. Database Credentials

If your OpenClaw uses any databases:

```bash
# MySQL/MariaDB
mysql -u root -p -e "DROP USER 'openclaw'@'localhost';"
mysql -u root -p -e "DROP DATABASE openclaw_db;"

# Or for SQLite, simply delete the database file
rm -f /path/to/openclaw/database.db
```

#### E. Chat Platform Tokens

Review and remove tokens for:
- Telegram bot tokens
- Discord webhooks
- Feishu app credentials
- WeChat/QQ bot tokens

```bash
# Check common config locations
cat ~/.openclaw/config.yaml
cat ~/.openclaw/.env
```

> **Security Note**: Failing to clear these credentials means anyone who provisions the same Baidu Cloud instance later could potentially access your accounts. This is a real security risk.

---

### Step 3: Document Your Current Configuration

Before shutting down the old server, document everything:

```bash
# List all installed packages
npm list -g --depth=0

# Show system info
uname -a
node --version
npm --version

# List all running services
systemctl list-units --type=service

# Show port allocations
netstat -tulpn
```

This information will help you replicate the environment on your new server.

---

### Step 4: Provision Your New Tencent Cloud Singapore Server

Now let's set up your new home on Tencent Cloud Singapore:

1. **Visit Tencent Cloud**: Go to [cloud.tencent.com](https://cloud.tencent.com)
2. **Navigate to Lighthouse (轻量应用服务器)**
3. **Select Singapore Region**
4. **Choose a Plan**:
   - **Basic Package**: 99 CNY/year (1 CPU, 1GB RAM, 25GB SSD)
   - This is sufficient for OpenClaw

5. **Configure**:
   - Select **Ubuntu 20.04 LTS** or **22.04 LTS**
   - Enable "Allow all ports" in firewall (or configure as needed)
   - Set your SSH password

6. **Deploy and Note**:
   - Your server IP address
   - SSH username (usually `root` or `ubuntu`)
   - Password or SSH key

---

### Step 5: Set Up Your New Server

Once your Tencent Cloud server is ready:

```bash
# SSH into your new server
ssh root@your_new_server_ip

# Install required dependencies
apt update && apt upgrade -y
apt install -y git nodejs npm

# Verify Node.js version (recommended: v18+)
node --version

# Install OpenClaw (follow official docs)
# Or restore from your backup

# Restore your backed-up configuration
cd /root/.openclaw/workspace
tar -xzvf /path/to/openclay-backup-YYYYMMDD.tar.gz
```

---

### Step 6: Configure Git and Re-add Credentials

On your new server, reconfigure Git with proper credential management:

```bash
# Configure Git (use a GitHub Personal Access Token for push/pull)
git remote set-url origin https://YOUR_GITHUB_TOKEN@github.com/yourusername/yourrepo.git

# Or use SSH keys (recommended)
ssh-keygen -t ed25519 -C "your_email@example.com"
# Add the public key to GitHub → Settings → SSH Keys
```

---

### Step 7: Verify Everything Works

```bash
# Test network connectivity
curl https://api.github.com
npm install express

# Start OpenClaw
openclaw start

# Check logs for any errors
tail -f /var/log/openclaw.log
```

---

## Recommended: Tencent Cloud Singapore

If you're looking for an affordable, reliable cloud solution with foreign network access, **Tencent Cloud Singapore Lighthouse** is an excellent choice:

### Why Tencent Cloud Singapore?

| Benefit | Details |
|---------|---------|
| **Cost** | 99 CNY/year — 90% savings over Baidu Cloud |
| **Network** | Full foreign network access (GitHub, npm, international APIs) |
| **Performance** | 1 CPU, 1GB RAM, 25GB SSD |
| **Support** | Chinese language support available |
| **Uptime** | 99.99% SLA guarantee |

### Get Started Today

👉 **[Tencent Cloud Singapore Lighthouse](https://cloud.tencent.com/product/lighthouse)**  

Use the **Singapore region** for optimal international connectivity. The 99 CNY/year plan is perfect for personal projects like OpenClaw.

---

## Conclusion

Migrating OpenClaw from Baidu Cloud to Tencent Cloud Singapore is straightforward:

1. **Backup** your current data
2. **Clear all sensitive information** from the old server (critical!)
3. **Document** your current configuration
4. **Provision** a new Tencent Cloud Singapore server
5. **Restore** and verify everything works

The result? **90% cost savings** + **unrestricted internet access** + **better performance**.

---

## FAQ

### How long does migration take?

For most users, 1-2 hours including configuration. The actual data transfer depends on your backup size.

### Can I run OpenClaw on the 99 CNY plan?

Yes! The basic plan (1GB RAM) is sufficient for standard OpenClaw usage. For heavy workloads, consider upgrading.

### What happens to my old Baidu Cloud server?

Either decommission it or ensure you've completely wiped all sensitive data (see Step 2).

### Will my domain DNS need to change?

Only if your new server has a different IP address. Update your A records accordingly.

### Is Tencent Cloud Singapore fast enough for production?

Yes. With 99.99% uptime SLA and Singapore's strategic location, it offers excellent performance for users in Asia-Pacific regions.

---

**Ready to make the switch? Head to [Tencent Cloud Singapore](https://cloud.tencent.com/product/lighthouse) and start your migration today!**
