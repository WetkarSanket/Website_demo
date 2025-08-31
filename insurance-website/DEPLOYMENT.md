# 🚀 Deployment Guide - SecureLife Insurance Website

This guide will help you deploy your insurance website to the internet for Genesys Cloud Web Messaging integration.

## 📁 Files Ready for Deployment

Your website includes these files:
- `index.html` - Homepage
- `submit-claim.html` - Claim submission
- `track-claims.html` - Claims tracking  
- `contact.html` - Contact & support
- `styles.css` - Styling
- `script.js` - Functionality
- `netlify.toml` - Netlify configuration
- `README.md` - Documentation

## 🏆 Best Option: Netlify (Recommended for Genesys)

**Why Netlify?**
- ✅ Free HTTPS URLs
- ✅ Instant deployments
- ✅ No technical setup required
- ✅ Perfect for Genesys integration
- ✅ Reliable uptime

### Quick Netlify Deployment:

1. **Go to [netlify.com](https://netlify.com)**
2. **Drag & Drop Method:**
   - Zip all your website files
   - Drag the ZIP file to Netlify's deploy area
   - Get instant URL like: `https://amazing-site-name-123456.netlify.app`

3. **Your website will be live in 30 seconds!**

## 🐙 Alternative: GitHub Pages

### Steps:
1. Create GitHub account at [github.com](https://github.com)
2. Create new repository called `insurance-website`
3. Upload all website files to the repository
4. Go to repository Settings → Pages
5. Select "Deploy from branch" → "main" → "/ (root)"
6. Your site: `https://yourusername.github.io/insurance-website`

## ⚡ Alternative: Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub/Google/Email
3. Click "Import Project"
4. Upload your files or connect GitHub
5. Automatic deployment with custom domain

## 🔧 Genesys Cloud Integration Setup

Once deployed, your website URL can be used in Genesys Cloud:

### Web Messaging Integration Points:

1. **Homepage Integration:**
   ```
   https://your-site.netlify.app/
   ```

2. **Claims Support Page:**
   ```
   https://your-site.netlify.app/submit-claim.html
   ```

3. **Customer Service Page:**
   ```
   https://your-site.netlify.app/contact.html
   ```

### Genesys Configuration:
- Use your website URL in Genesys Web Messaging widget
- The responsive design works perfectly in chat widgets
- All forms are ready for integration with Genesys APIs

## 📱 Testing Your Live Website

After deployment, test these features:
- ✅ Submit a claim (generates claim ID)
- ✅ Track claims (search functionality)
- ✅ Contact form (generates ticket ID)  
- ✅ Mobile responsiveness
- ✅ All navigation links work

## 🔒 Security Features Included

- HTTPS by default on all platforms
- Content Security Policy headers (Netlify)
- XSS protection headers
- Form validation
- No external dependencies

## 🌐 Custom Domain (Optional)

All platforms support custom domains:
- **Netlify**: Free custom domains
- **GitHub Pages**: Free with GitHub Pro
- **Vercel**: Free custom domains

Example: `claims.yourcompany.com`

## 📞 Support

If you need help with deployment:
1. Check the platform's documentation
2. Most platforms have live chat support
3. GitHub has community forums

## 🎯 Ready for Production!

Your insurance website is production-ready with:
- Professional insurance company design
- Complete claims management system  
- Customer support features
- Mobile-responsive layout
- Genesys Cloud integration ready
- No maintenance required

**Deploy now and start using with Genesys Cloud Web Messaging!** 🚀