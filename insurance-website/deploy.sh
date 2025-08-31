#!/bin/bash

echo "🚀 SecureLife Insurance Website Deployment Helper"
echo "================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "📁 Git repository already exists"
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Commit files
echo "💾 Committing files..."
git commit -m "Initial deployment of SecureLife Insurance website

🏠 Homepage with company overview
📋 Claim submission form with validation  
📊 Claims tracking with progress indicators
📞 Contact page with FAQ section
📱 Responsive design for all devices
🔧 Ready for Genesys Cloud integration"

echo "✅ Files committed successfully!"

echo ""
echo "🌐 Next Steps for Deployment:"
echo "=============================="
echo ""
echo "GitHub Pages:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin https://github.com/yourusername/your-repo-name.git"
echo "3. Run: git branch -M main"
echo "4. Run: git push -u origin main" 
echo "5. Go to your repo Settings → Pages → Deploy from branch 'main'"
echo ""
echo "Netlify (Drag & Drop):"
echo "1. Go to https://netlify.com"
echo "2. Drag the entire project folder to the deploy area"
echo "3. Get instant HTTPS URL"
echo ""
echo "Vercel:"
echo "1. Go to https://vercel.com"  
echo "2. Import from Git or upload files"
echo "3. Automatic deployment"
echo ""
echo "🎯 Your website will be ready for Genesys Cloud Web Messaging integration!"