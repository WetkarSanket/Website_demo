# 🚀 Genesys Cloud Web Messaging Integration Guide

Your SecureLife Insurance website now includes full Genesys Cloud Web Messaging integration with Journey tracking.

## ✅ Integration Features Implemented

### 🎯 **Genesys Messenger SDK**
- **Environment**: `prod-euw2`
- **Deployment ID**: `7953b9f3-bac3-4b1d-95e4-9d489c49af26`
- **Bootstrap URL**: `https://apps.euw2.pure.cloud/genesys-bootstrap/genesys.min.js`

### 📊 **Journey Tracking**
- ✅ Automatic page view tracking on all pages
- ✅ URL path normalization (tracks meaningful page segments)
- ✅ Custom page mapping for analytics
- ✅ Form submission tracking
- ✅ Conversation event tracking

### 💬 **Messenger Integration Points**

#### **1. Navigation Bar**
- "Contact Us" links open Genesys Messenger instead of contact page
- Automatic enhancement of existing contact buttons

#### **2. Homepage**
- Quick action "Contact Support" button opens messenger
- Contextual data passed to agents

#### **3. Claims Pages**
- "Contact Support" buttons on claim cards open messenger with claim context
- Form submission success messages include chat option
- Claim data automatically sent to Genesys for agent context

#### **4. Contact Page**
- **Prominent Live Chat CTA** - Large featured button
- Multiple chat entry points
- Enhanced live chat buttons throughout the page

#### **5. Forms Integration**
- Claim submission forms send context to Genesys
- Contact forms integrate with Journey tracking
- Success messages include chat options

## 🗺️ **Journey Tracking Implementation**

### **Page Tracking**
```javascript
// Tracks these page identifiers:
/home          // Homepage (index.html)
/submit-claim  // Claim submission
/track-claims  // Claims tracking
/contact       // Contact/support
```

### **Event Tracking**
- `messenger-opened` - When chat widget opens
- `messenger-triggered` - When user clicks chat buttons
- `conversation-started` - When chat conversation begins
- `form-submitted` - When forms are submitted
- `claim-support` - When requesting help with specific claims

### **Custom Attributes**
```javascript
{
  source: "insurance-portal",
  page: "/submit-claim",
  formType: "claim-submission",
  claimId: "CLM-2024-123456",
  intent: "file-claim",
  section: "claims"
}
```

## 🔧 **Technical Implementation**

### **Files Modified/Added**

1. **`genesys-integration.js`** - New comprehensive integration script
2. **All HTML files** - Added Genesys SDK and Journey tracking scripts
3. **`script.js`** - Enhanced with Genesys integration functions
4. **`styles.css`** - Added live chat CTA styling

### **Key Functions Available**

#### **Global Functions:**
- `GenesysMessenger.openMessenger(context)` - Open chat with context
- `GenesysMessenger.closeMessenger()` - Close chat widget
- `genesysIntegration.sendFormContext(type, data)` - Send form data to agents

#### **Auto-Enhancement:**
- Automatically finds and enhances contact buttons
- Updates button text to "💬 Live Chat"
- Adds click handlers to open Genesys Messenger

## 🧪 **Testing Your Integration**

### **1. Basic Functionality Test**
1. Deploy your website to any hosting platform
2. Open browser developer console
3. Look for these console messages:
   ```
   Genesys Journey tracking initialized
   Tracking page view: {pathname: "/home", pageTitle: "Homepage"}
   Genesys Messenger is ready
   Enhanced X contact buttons with Genesys integration
   ```

### **2. Journey Tracking Test**
1. Navigate between pages
2. Check browser console for tracking events
3. Verify page views are being recorded

### **3. Messenger Integration Test**
1. Click any "Contact Us" or "Live Chat" button
2. Verify Genesys Messenger widget opens
3. Check console for messenger events

### **4. Form Context Test**
1. Submit a claim or contact form
2. Open messenger immediately after
3. Agent should receive form context automatically

## 📱 **Mobile Compatibility**
- ✅ Responsive design maintained
- ✅ Genesys Messenger works on all devices
- ✅ Touch-friendly chat buttons
- ✅ Mobile-optimized chat experience

## 🔒 **Security & Privacy**
- HTTPS required (automatically provided by hosting platforms)
- No sensitive data logged
- GDPR-compliant Journey tracking
- Secure Genesys Cloud environment

## 🎯 **Genesys Cloud Configuration**

### **In Genesys Cloud Admin:**
1. **Web Messaging** → Your Deployment
2. **Journey** → Verify events are being received
3. **Analytics** → Check customer journey data

### **Agent Desktop:**
- Agents will receive customer context automatically
- Form data appears in conversation timeline
- Journey history visible in customer profile

## 🚀 **Deployment Checklist**

- ✅ All HTML pages include Genesys SDK
- ✅ Journey tracking script on every page
- ✅ genesys-integration.js file included
- ✅ Contact buttons enhanced with chat functionality
- ✅ Form submissions send context to Genesys
- ✅ Success messages include chat options
- ✅ Mobile-responsive design maintained

## 📊 **Analytics & Reporting**

### **Journey Events You'll See:**
- Page views with normalized paths
- Form submission events
- Messenger interaction events
- Customer journey progression
- Conversion funnel data

### **Agent Context Data:**
- Current page when chat initiated
- Recent form submissions
- Claim information (when applicable)
- Customer journey history
- Device and browser information

## 🔧 **Customization Options**

### **To Modify Journey Tracking:**
Edit the page mapping in `genesys-integration.js`:
```javascript
const pageMapping = {
    '/index.html': '/home',
    '/submit-claim.html': '/submit-claim',
    // Add your custom mappings
};
```

### **To Add Custom Context:**
```javascript
GenesysMessenger.openMessenger({
    trigger: 'custom-button',
    userData: {
        customField: 'customValue',
        // Add any context data
    }
});
```

## ⚡ **Performance Optimized**
- Async script loading
- Minimal impact on page load times
- Efficient Journey tracking
- Lightweight integration code

## 🎉 **Ready for Production!**

Your insurance website is now fully integrated with Genesys Cloud Web Messaging:

- **Real-time customer support** via chat widget
- **Complete journey tracking** for analytics
- **Contextual agent assistance** with form data
- **Mobile-responsive** chat experience
- **Professional insurance portal** with enterprise chat capabilities

Deploy and start providing exceptional customer service through Genesys Cloud! 🌟