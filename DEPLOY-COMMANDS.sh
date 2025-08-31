#!/bin/bash

echo "🚀 Deploying Genesys-Integrated Insurance Website to GitHub Pages"
echo "============================================================="

# Navigate to your project directory (adjust path as needed)
# cd /path/to/your/project

# Add remote repository
git remote add origin https://github.com/WetkarSanket/Website_demo.git

# Or if remote already exists, update it
# git remote set-url origin https://github.com/WetkarSanket/Website_demo.git

# Rename branch to main
git branch -M main

# Push to GitHub (will prompt for authentication)
git push -u origin main --force

echo "✅ Deployment complete!"
echo "🌐 Your website will be available at: https://WetkarSanket.github.io/Website_demo"
echo "⏱️  GitHub Pages deployment may take 5-10 minutes to be live"