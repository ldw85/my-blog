#!/bin/bash
# Build and deploy script for my-blog
# Usage: ./build.sh

set -e

echo "========================================="
echo "Building my-blog locally"
echo "========================================="

cd /root/.openclaw/workspace/my-blog

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Skipping local build."
    echo "   Cloudflare will build from GitHub."
    echo ""
    read -p "Push to GitHub? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Pushing to GitHub..."
        git push origin main
        echo "✅ Pushed!"
    fi
    exit 0
fi

# Build the project
echo "Building with Astro..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check dist folder
    if [ -d "dist" ]; then
        echo "✅ Dist folder created"
        ls -la dist/ | head -5
    fi
    
    # Push to GitHub
    echo ""
    echo "Pushing to GitHub..."
    git push origin main
    echo "✅ Deployed to Cloudflare!"
else
    echo "❌ Build failed! Fix errors before pushing."
    exit 1
fi
