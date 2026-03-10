---
publishDate: 2026-03-10
title: How to Migrate Your OpenClaw Server to a New Cloud Provider
description: A step-by-step guide to moving your OpenClaw instance from Baidu Cloud to Tencent Cloud Singapore, including data backup and security cleanup.
image: https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=630&fit=crop
category: tutorial
tags: [OpenClaw, cloud migration, tutorial, Tencent Cloud]
author: TechRuling
---

# How to Migrate Your OpenClaw Server to a New Cloud Provider

If you're running OpenClaw on a cloud server, you might find yourself needing to migrate to a better provider at some point. Maybe you're facing rising costs, network restrictions, or simply want better performance. In this guide, I'll walk you through exactly how I migrated my OpenClaw instance from Baidu Cloud to Tencent Cloud Singapore—and why I made the switch.

## Why I Decided to Move

I hosted my OpenClaw on Baidu Cloud (Baidu Yun) for several months. Here's what happened:

**Baidu Cloud Pricing:**
- First month: Free (great for testing!)
- Renewal: ¥90/month (~$12.50 USD)
- Problem: No access to international networks

After the free period, I was looking at paying around $12.50/month for a server that couldn't even access external networks properly. For an AI assistant that needs to fetch information from the web, this was a dealbreaker.

**Tencent Cloud Singapore:**
- Price: ¥99/year (~$14 USD)
- Full international network access
- Stable and fast connections

The math was simple: pay $12.50/month for a restricted server, or $14/year for a full-featured one. The choice was clear.

## Pre-Migration Checklist

Before you start, make sure you have:

1. **Access to your current server** via SSH
2. **Your OpenClaw configuration files** backed up
3. **A new cloud server** ready (I'll recommend Tencent Cloud Singapore)
4. **Your OpenClaw auth credentials** (you'll need these later)

## Step 1: Backup Your Current OpenClaw Data

First, connect to your old server and create a complete backup:

```bash
# Create backup directory
mkdir -p ~/openclaw-backup
cd ~/openclaw-backup

# Backup configuration
cp -r ~/.openclaw ~/openclaw-backup/

# Export your agents configuration
tar -czf openclaw-config.tar.gz ~/.openclaw/

# List all important files to backup
ls -la ~/.openclaw/
```

### Critical Files to Back Up:
- `~/.openclaw/config/` - Gateway configuration
- `~/.openclaw/agents/` - Agent settings
- `~/.openclaw/workspace/` - Your working files and memory

## Step 2: Security Cleanup (IMPORTANT!)

This is the most critical step before decommissioning your old server. You MUST remove sensitive information to prevent security issues.

### What to Clean:

```bash
# 1. Remove authentication credentials
rm -rf ~/.openclaw/agents/*/agent/auth-profiles.json

# 2. Clear environment variables that might contain secrets
unset $(env | grep -E '^(API_KEY|TOKEN|SECRET|PASSWORD)' | cut -d= -f1)

# 3. Remove Git credentials
rm -f ~/.git-credentials
git config --global --unset credential.helper

# 4. Clear history (optional but recommended)
rm -f ~/.bash_history
history -c

# 5. Remove any API keys stored in config files
# Check these common locations:
cat ~/.openclaw/config.yaml | grep -i key
cat ~/.openclaw/config.yaml | grep -i token
```

### Verify Cleanup:

```bash
# Check for any remaining secrets
grep -r "ghp_" ~/.openclaw/ 2>/dev/null
grep -r "sk-" ~/.openclaw/ 2>/dev/null
grep -r "api" ~/.openclaw/config.yaml 2>/dev/null
```

If any of these commands return results, manually remove those lines before proceeding.

## Step 3: Set Up Your New Server (Tencent Cloud Singapore)

I highly recommend Tencent Cloud Singapore. Here's why:

- **Price**: Only ¥99/year (~$14 USD)
- **Location**: Singapore (great for Asia-Pacific users)
- **Network**: Full international access (no restrictions!)
- **Performance**: Excellent for OpenClaw and AI applications

### How to Purchase:

1. Visit: **[Tencent Cloud Singapore](https://cloud.tencent.com/act/cps/redirect?redirect=10605&cps_key=)**
2. Select "Cloud Virtual Machine" (CVM)
3. Choose "Singapore" region
4. Pick your configuration (2GB RAM minimum recommended for OpenClaw)
5. Complete purchase

**Get ¥99 Singapore Server**: **https://cloud.tencent.com/act/cps/redirect?redirect=10605&cps_key=**

## Step 4: Fresh OpenClaw Installation on New Server

Once your Tencent Cloud server is ready, install OpenClaw fresh:

```bash
# SSH into your new server
ssh root@your-new-server-ip

# Install OpenClaw
curl -sL https://get.openclaw.ai | bash

# Configure your gateway
openclaw configure
```

## Step 5: Restore Your Configuration

Transfer only the safe parts of your backup:

```bash
# From your local machine, copy the backup (excluding sensitive files)
scp -r ~/openclaw-backup/openclaw-config.tar.gz root@new-server:/root/

# On the new server
cd ~
tar -xzf openclaw-config.tar.gz
cp -r ~/.openclaw/config.yaml ~/.openclaw/workspace/ ~/openclaw/ 2>/dev/null

# Restart the gateway
openclaw gateway restart
```

### What NOT to Restore:
- ❌ `auth-profiles.json` (regenerate new API keys)
- ❌ Git credentials (reconfigure on new server)
- ❌ Any hardcoded API keys in config files

## Step 6: Verify Everything Works

```bash
# Check gateway status
openclaw status

# Test a simple conversation
openclaw chat "Hello, are you working?"
```

## Step 7: Decommission Old Server

Once you've verified everything works on the new server:

1. **Log into Baidu Cloud console**
2. **Terminate the instance**
3. **Release any associated IP addresses**
4. **Delete any snapshots** (if you don't need them)

⚠️ **Important**: Make absolutely sure you've completed the security cleanup in Step 2 BEFORE terminating!

## Cost Comparison

| Provider | First Month | Renewal | International Network |
|----------|-------------|---------|---------------------|
| Baidu Cloud | Free | ¥90/month | ❌ No |
| Tencent Cloud SG | ¥99/year | ¥99/year | ✅ Yes |

**Savings**: Save approximately $136 per year by switching!

## Final Thoughts

Moving your OpenClaw server doesn't have to be complicated. With proper backup and security precautions, the migration can be completed in under an hour. The performance improvement from restricted to unrestricted network access alone is worth the switch.

If you're currently on Baidu Cloud or any provider with network restrictions, I strongly recommend making the move to Tencent Cloud Singapore. The cost difference is minimal, but the capabilities difference is massive.

**Get started today**: **https://cloud.tencent.com/act/cps/redirect?redirect=10605&cps_key=**

---

*Have you migrated your OpenClaw instance? Share your experience in the comments below!*

