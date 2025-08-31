# 🛠️ Genesys Messenger Flow Troubleshooting Guide

Your Messenger widget opens but doesn't show the configured welcome message/flow. This guide will help you fix the issue.

## 🔍 **Common Causes & Solutions**

### **1. Flow Not Mapped to Messenger Deployment**

**Issue**: The flow exists but isn't connected to your Messenger deployment.

**Solution**:
1. Go to **Genesys Cloud Admin** → **Message** → **Messenger Deployments**
2. Find deployment: `7953b9f3-bac3-4b1d-95e4-9d489c49af26`
3. Click **Edit** → **Configuration** tab
4. Under **Initial Flow**, select your welcome flow
5. **Save** and **Publish**

### **2. Flow Trigger Events Not Configured**

**Issue**: Flow is mapped but doesn't trigger on the right events.

**Solution - Configure Flow Triggers**:
1. Go to **Architect** → **Inbound Message Flows**
2. Open your flow
3. In the **Starting** menu, ensure these triggers are set:
   - `Conversation Start`
   - `messenger-opened` (custom event)
   - `chat-session-started` (custom event)

### **3. Journey Events Not Reaching Flow**

**Issue**: Journey tracking works but doesn't trigger flows.

**Solution - Set Up Journey-to-Flow Integration**:
1. **Architect** → **Inbound Message Flow**
2. Add **Journey** module in your flow
3. Configure Journey outcome to trigger welcome message
4. Use event names from our integration:
   - `messenger-opened`
   - `chat-initiated`
   - `contact-page-visit`
   - `claims-assistance`

## 🚀 **Enhanced Integration Code**

I've created an improved integration file that better triggers flows:

**Replace your current `genesys-integration.js` with the new version:**

### **Key Improvements**:
- ✅ **Multiple Flow Triggers**: Sends various events to trigger flows
- ✅ **Enhanced Debugging**: Console logs show what's happening
- ✅ **Delayed Triggers**: Ensures Genesys is fully loaded before triggering
- ✅ **Page-Specific Events**: Different triggers for different pages
- ✅ **Form Integration**: Triggers flows after form submissions

## 🧪 **Testing & Debugging**

### **1. Browser Console Testing**
Open browser console and run:
```javascript
// Check integration status
genesysIntegration.checkStatus()

// Test flow trigger manually  
genesysIntegration.testFlowTrigger("welcome-message")

// Open messenger with debug context
GenesysMessenger.openMessenger({trigger: 'debug-test'})
```

### **2. Check Console Logs**
Look for these messages when clicking chat:
```
✅ Genesys Journey tracking initialized
✅ Genesys Messenger is ready
🖱️ Contact button clicked
🚀 Opening Genesys Messenger with context
💬 Genesys Messenger opened
🎯 Sending flow activation trigger
```

### **3. Genesys Cloud Monitoring**
**Admin** → **Analytics** → **Journey**:
- Verify events are being received
- Check custom attributes are populated
- Confirm conversation starts are recorded

## ⚙️ **Genesys Cloud Configuration Steps**

### **Step 1: Verify Messenger Deployment**
```
Admin → Message → Messenger Deployments → Your Deployment
✅ Status: Active
✅ Initial Flow: [Your Welcome Flow]
✅ Journey Tracking: Enabled
```

### **Step 2: Configure Flow Triggers**
```
Architect → Inbound Message Flows → Your Flow
✅ Starting Point: Conversation Start
✅ Journey Integration: Configured for custom events
✅ Welcome Message: Configured and active
```

### **Step 3: Test Flow Logic**
1. Create simple flow with immediate text response
2. Test with minimal configuration first
3. Add complexity after basic flow works

## 🎯 **Recommended Flow Setup**

### **Simple Test Flow**:
1. **Start** → **Welcome Message**
2. **Text**: "Welcome to SecureLife Insurance! How can I help you today?"
3. **Menu Options**:
   - File a Claim
   - Track Existing Claim  
   - General Questions
4. **End**

### **Flow Triggers to Configure**:
- `Conversation Start` (default)
- `messenger-opened` (from our integration)
- `chat-initiated` (from our integration)
- `contact-page-visit` (page-specific)

## 🔧 **Advanced Troubleshooting**

### **If Flow Still Doesn't Trigger**:

1. **Create New Simple Flow**:
   - Name: "Test Welcome Flow"
   - Single message: "Hello from Genesys!"
   - Assign to your Messenger deployment

2. **Check Deployment Status**:
   ```
   Admin → Status → System Status
   ✅ Messenger Service: Operational
   ✅ Journey Service: Operational
   ✅ Your Organization: Active
   ```

3. **Verify Domain Whitelisting**:
   ```
   Messenger Deployment → Security
   ✅ Add: https://wetkarsanket.github.io
   ✅ Add: https://*.github.io (wildcard)
   ```

4. **Test with Different Trigger**:
   - Try triggering flow manually from Genesys Cloud
   - Test with different deployment if available

### **Code-Level Debugging**:

Add this to your browser console for detailed debugging:
```javascript
// Enable verbose Genesys logging
Genesys("command", "Logging.configure", {
  level: "debug"
});

// Monitor all Genesys events
Genesys("subscribe", "*", function(eventName, data) {
  console.log("Genesys Event:", eventName, data);
});
```

## 📋 **Deployment Checklist**

### **Before Testing**:
- ✅ Updated `genesys-integration.js` deployed to website
- ✅ Flow assigned to Messenger deployment  
- ✅ Domain whitelisted in Genesys
- ✅ Messenger deployment published and active
- ✅ Journey tracking enabled

### **During Testing**:
- ✅ Clear browser cache
- ✅ Open browser console for logs
- ✅ Test from different devices/browsers
- ✅ Check Genesys Cloud real-time analytics

## 🎉 **Expected Results**

After applying fixes:
1. **Click chat button** → Widget opens
2. **Within 2-3 seconds** → Welcome message appears
3. **Console shows** → Flow trigger events
4. **Genesys Cloud shows** → Journey events received
5. **Agent receives** → Customer context and page information

## 📞 **Still Having Issues?**

Try these additional steps:

1. **Test with simple HTTP page** (not HTTPS) if allowed
2. **Try different browser** (Chrome vs Firefox vs Safari)  
3. **Check Genesys Cloud status page** for service issues
4. **Contact Genesys Support** with deployment ID: `7953b9f3-bac3-4b1d-95e4-9d489c49af26`

The enhanced integration code should resolve most flow triggering issues. The key is ensuring the flow is properly mapped to the deployment and configured to respond to the events we're sending! 🚀