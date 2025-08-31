// Corrected Genesys Cloud Messenger SDK Integration 
// FIXES: Widget opening that preserves natural flow behavior

// Genesys Messenger SDK Bootstrap
(function (g, e, n, es, ys) {
    g['_genesysJs'] = e;
    g[e] = g[e] || function () {
        (g[e].q = g[e].q || []).push(arguments)
    };
    g[e].t = 1 * new Date();
    g[e].c = es;
    ys = document.createElement('script'); 
    ys.async = 1; 
    ys.src = n; 
    ys.charset = 'utf-8'; 
    document.head.appendChild(ys);
})(window, 'Genesys', 'https://apps.euw2.pure.cloud/genesys-bootstrap/genesys.min.js', {
    environment: 'prod-euw2',
    deploymentId: '7953b9f3-bac3-4b1d-95e4-9d489c49af26'
});

// Journey Tracking Implementation (keeps original functionality)
Genesys("subscribe", "Journey.ready", function() {
    console.log('✅ Genesys Journey tracking initialized');
    
    // Track page view with delay
    setTimeout(function () {
        trackPageView();
    }, 500);
    
    // Track navigation changes
    if (window.history && window.history.pushState) {
        const originalPushState = window.history.pushState;
        window.history.pushState = function() {
            originalPushState.apply(window.history, arguments);
            setTimeout(trackPageView, 200);
        };
        
        window.addEventListener('popstate', function() {
            setTimeout(trackPageView, 200);
        });
    }
});

// Page tracking function
function trackPageView() {
    let pathname = window.location.pathname;
    
    if (!pathname || pathname === "/" || pathname === "/index.html") {
        pathname = "/home";
    }
    
    let segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
        pathname = "/" + segments[segments.length - 1].replace('.html', '');
    }
    
    const pageMapping = {
        '/index': '/home',
        '/submit-claim': '/submit-claim',
        '/track-claims': '/track-claims', 
        '/contact': '/contact'
    };
    
    if (pageMapping[pathname]) {
        pathname = pageMapping[pathname];
    }
    
    let pageContext = {
        section: 'insurance-portal',
        category: getPageCategory(pathname),
        timestamp: new Date().toISOString()
    };
    
    console.log('📊 Tracking page view:', pathname);
    
    Genesys("command", "Journey.pageview", {
        pageTitle: pathname,
        pageUrl: window.location.href,
        customAttributes: pageContext
    });
}

function getPageCategory(pathname) {
    const categoryMap = {
        '/home': 'landing',
        '/submit-claim': 'claims-submission',
        '/track-claims': 'claims-tracking',
        '/contact': 'customer-support'
    };
    
    return categoryMap[pathname] || 'other';
}

// CORRECTED Genesys Messenger Integration
const GenesysMessenger = {
    isReady: false,
    launcherReady: false,
    
    init: function() {
        console.log('🚀 Initializing CORRECTED Genesys Messenger integration...');
        
        this.waitForGenesys(() => {
            this.setupEvents();
            this.enhanceContactButtons();
            this.isReady = true;
            console.log('✅ Genesys Messenger integration ready!');
        });
    },
    
    waitForGenesys: function(callback) {
        if (typeof Genesys !== 'undefined') {
            // Wait for BOTH Messenger and Journey to be ready
            let messengerReady = false;
            let journeyReady = false;
            
            const checkBothReady = () => {
                if (messengerReady && journeyReady) {
                    console.log('✅ Both Messenger and Journey ready');
                    callback();
                }
            };
            
            Genesys("subscribe", "Messenger.ready", () => {
                console.log('✅ Genesys Messenger ready');
                messengerReady = true;
                checkBothReady();
            });
            
            Genesys("subscribe", "Journey.ready", () => {
                console.log('✅ Genesys Journey ready');  
                journeyReady = true;
                checkBothReady();
            });
            
            // Also wait for launcher specifically
            Genesys("subscribe", "Launcher.ready", () => {
                console.log('✅ Genesys Launcher ready');
                this.launcherReady = true;
            });
            
        } else {
            console.log('⏳ Waiting for Genesys SDK...');
            setTimeout(() => this.waitForGenesys(callback), 500);
        }
    },
    
    setupEvents: function() {
        console.log('🔧 Setting up Genesys events...');
        
        // Track when messenger opens (but don't interfere)
        Genesys("subscribe", "Messenger.opened", function() {
            console.log('💬 Genesys Messenger opened naturally');
            
            // Set context AFTER it opens naturally
            setTimeout(() => {
                const context = GenesysMessenger.getPageContext();
                Genesys("command", "Database.set", {
                    messaging: {
                        customAttributes: context
                    }
                });
                
                console.log('📝 Context set after natural opening:', context);
            }, 100);
        });
        
        Genesys("subscribe", "Conversations.started", function(data) {
            console.log('🎉 Conversation started naturally:', data);
        });
    },
    
    // CORRECTED: Use launcher instead of direct open command
    openMessenger: function(context = {}) {
        if (!this.isReady) {
            console.warn('⚠️ Genesys not ready, waiting...');
            setTimeout(() => this.openMessenger(context), 1000);
            return;
        }
        
        console.log('🚀 Opening Genesys Messenger via LAUNCHER method...');
        
        // METHOD 1: Try to trigger the actual launcher button
        const launcherButton = document.querySelector('.genesys-launcher, [data-genesys-launcher], .genesys-messenger-launcher');
        if (launcherButton) {
            console.log('✅ Found Genesys launcher button, clicking it naturally');
            
            // Set context BEFORE clicking
            const userContext = this.getPageContext(context);
            Genesys("command", "Database.set", {
                messaging: {
                    customAttributes: userContext
                }
            });
            
            // Click the actual launcher button - this preserves natural flow!
            launcherButton.click();
            return;
        }
        
        // METHOD 2: Use launcher-specific commands instead of Messenger.open
        if (this.launcherReady) {
            console.log('🎯 Using Launcher.open instead of Messenger.open');
            
            const userContext = this.getPageContext(context);
            Genesys("command", "Database.set", {
                messaging: {
                    customAttributes: userContext
                }
            });
            
            // Use Launcher.open which should preserve flow behavior
            Genesys("command", "Launcher.open");
            return;
        }
        
        // METHOD 3: Last resort - use Messenger.open with maximum delay
        console.log('⚠️ Using fallback Messenger.open with extended delay');
        
        setTimeout(() => {
            const userContext = this.getPageContext(context);
            Genesys("command", "Database.set", {
                messaging: {
                    customAttributes: userContext
                }
            });
            
            // Wait much longer to ensure flow is completely ready
            setTimeout(() => {
                console.log('🚀 Opening messenger after extended delay...');
                Genesys("command", "Messenger.open");
            }, 2000);
            
        }, 1000);
    },
    
    // Enhanced button enhancement that preserves natural behavior
    enhanceContactButtons: function() {
        console.log('🔧 Enhancing contact buttons with CORRECTED approach...');
        
        // Find contact elements
        const contactElements = document.querySelectorAll([
            'a[href="contact.html"]',
            'a[href="/contact.html"]',
            '.start-chat',
            '.live-chat',
            '[onclick*="GenesysMessenger"]',
            '[onclick*="startLiveChat"]'
        ].join(','));
        
        console.log(`🔍 Found ${contactElements.length} contact elements`);
        
        contactElements.forEach((element, index) => {
            if (element.dataset.genesysEnhanced) return;
            
            element.dataset.genesysEnhanced = 'true';
            
            // Remove any existing onclick handlers that might interfere
            element.removeAttribute('onclick');
            
            element.addEventListener('click', (e) => {
                console.log(`🖱️ Contact button ${index + 1} clicked - using corrected method`);
                
                // Prevent default navigation
                e.preventDefault();
                
                // Use corrected opening method
                this.openMessenger({
                    trigger: 'contact-button-' + (index + 1),
                    source: 'website-button'
                });
                
            }, true); // Use capture phase
            
            // Update button appearance
            if (element.textContent.includes('Contact') && !element.textContent.includes('💬')) {
                element.innerHTML = element.innerHTML.replace('Contact', '💬 Live Chat');
                element.title = 'Start a live conversation with our support team';
            }
        });
        
        console.log(`✅ Enhanced ${contactElements.length} buttons with corrected approach`);
    },
    
    getPageContext: function(additionalContext = {}) {
        const pathname = window.location.pathname;
        return {
            currentPage: pathname,
            pageTitle: document.title,
            timestamp: new Date().toISOString(),
            source: 'insurance-website',
            ...additionalContext
        };
    },
    
    // Debug function to test different opening methods
    debugOpen: function(method = 'auto') {
        console.log('🐛 DEBUG: Testing opening method:', method);
        
        switch(method) {
            case 'launcher':
                const btn = document.querySelector('.genesys-launcher, [data-genesys-launcher]');
                if (btn) {
                    console.log('🐛 Clicking actual launcher button');
                    btn.click();
                } else {
                    console.log('🐛 No launcher button found');
                }
                break;
                
            case 'launcher-command':
                console.log('🐛 Using Launcher.open command');
                Genesys("command", "Launcher.open");
                break;
                
            case 'messenger-direct':
                console.log('🐛 Using direct Messenger.open');
                Genesys("command", "Messenger.open");
                break;
                
            default:
                console.log('🐛 Using auto method');
                this.openMessenger({trigger: 'debug-test'});
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 DOM loaded, initializing CORRECTED Genesys integration...');
    GenesysMessenger.init();
});

// Expose for debugging
window.GenesysMessenger = GenesysMessenger;

// Enhanced form integration (preserves natural flow)
window.genesysIntegration = {
    sendFormContext: function(formType, formData) {
        if (typeof Genesys !== 'undefined') {
            console.log('📝 Sending form context:', formType);
            
            Genesys("command", "Database.set", {
                messaging: {
                    customAttributes: {
                        formType: formType,
                        formData: formData,
                        submissionTime: new Date().toISOString()
                    }
                }
            });
            
            Genesys("command", "Journey.record", {
                eventName: "form-submitted",
                customAttributes: {
                    formType: formType,
                    success: true
                }
            });
        }
    },
    
    openMessengerWithForm: function(formType, formData) {
        GenesysMessenger.openMessenger({
            trigger: 'form-submission',
            formType: formType,
            formData: formData
        });
    },
    
    checkStatus: function() {
        console.log('🔍 CORRECTED Genesys Integration Status:');
        console.log('- Genesys SDK loaded:', typeof Genesys !== 'undefined');
        console.log('- Integration ready:', GenesysMessenger.isReady);
        console.log('- Launcher ready:', GenesysMessenger.launcherReady);
        console.log('- Launcher element found:', !!document.querySelector('.genesys-launcher, [data-genesys-launcher]'));
        
        console.log('\n🧪 Debug Commands:');
        console.log('GenesysMessenger.debugOpen("launcher") - Click actual launcher');
        console.log('GenesysMessenger.debugOpen("launcher-command") - Use Launcher.open');
        console.log('GenesysMessenger.debugOpen("messenger-direct") - Direct Messenger.open');
        
        return GenesysMessenger.isReady;
    }
};

// Status check after load
setTimeout(() => {
    console.log('📋 Auto-status check:');
    genesysIntegration.checkStatus();
}, 5000);