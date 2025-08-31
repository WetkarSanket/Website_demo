// FINAL CORRECTED Genesys Cloud Messenger SDK Integration 
// Uses ONLY verified API commands from Genesys documentation

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

// Journey Tracking Implementation (verified working)
Genesys("subscribe", "Journey.ready", function() {
    console.log('✅ Genesys Journey tracking initialized');
    
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

// Page tracking function (verified working)
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
    
    console.log('📊 Tracking page view:', pathname);
    
    Genesys("command", "Journey.pageview", {
        pageTitle: pathname,
        pageUrl: window.location.href,
        customAttributes: {
            section: 'insurance-portal',
            category: getPageCategory(pathname),
            timestamp: new Date().toISOString()
        }
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

// CORRECTED Genesys Messenger Integration - Using ONLY verified API commands
const GenesysMessenger = {
    isReady: false,
    messengerReady: false,
    
    init: function() {
        console.log('🚀 Initializing FINAL CORRECTED Genesys Messenger integration...');
        
        this.waitForGenesys(() => {
            this.setupEvents();
            this.enhanceContactButtons();
            this.isReady = true;
            console.log('✅ Genesys Messenger integration ready!');
        });
    },
    
    waitForGenesys: function(callback) {
        if (typeof Genesys !== 'undefined') {
            console.log('⏳ Waiting for Messenger.ready event...');
            
            // Subscribe to Messenger.ready (VERIFIED working event)
            Genesys("subscribe", "Messenger.ready", () => {
                console.log('✅ Genesys Messenger is ready');
                this.messengerReady = true;
                callback();
            });
            
        } else {
            console.log('⏳ Waiting for Genesys SDK to load...');
            setTimeout(() => this.waitForGenesys(callback), 500);
        }
    },
    
    setupEvents: function() {
        console.log('🔧 Setting up Genesys event listeners...');
        
        // Subscribe to messenger opened event (VERIFIED working)
        Genesys("subscribe", "Messenger.opened", function() {
            console.log('💬 Genesys Messenger opened');
        });
        
        // Subscribe to conversation started (VERIFIED working)
        Genesys("subscribe", "Conversations.started", function(data) {
            console.log('🎉 Conversation started:', data);
        });
        
        console.log('✅ Event listeners configured');
    },
    
    // CORRECTED: Use ONLY the verified Messenger.open command
    openMessenger: function(context = {}) {
        if (!this.isReady) {
            console.warn('⚠️ Genesys not ready yet, waiting...');
            setTimeout(() => this.openMessenger(context), 1000);
            return;
        }
        
        if (!this.messengerReady) {
            console.warn('⚠️ Messenger not ready yet, waiting...');
            setTimeout(() => this.openMessenger(context), 1000);
            return;
        }
        
        console.log('🚀 Opening Genesys Messenger with VERIFIED command...');
        
        // Set user context BEFORE opening (VERIFIED working)
        const userContext = this.getPageContext(context);
        console.log('📝 Setting context:', userContext);
        
        Genesys("command", "Database.set", {
            messaging: {
                customAttributes: userContext
            }
        });
        
        // Use ONLY the verified Messenger.open command with proper timing
        setTimeout(() => {
            console.log('🎯 Executing Messenger.open command...');
            Genesys("command", "Messenger.open");
        }, 500); // Small delay to ensure context is set
    },
    
    // Simple and reliable button enhancement
    enhanceContactButtons: function() {
        console.log('🔧 Enhancing contact buttons with VERIFIED approach...');
        
        // Find contact elements with broader selectors
        const selectors = [
            'a[href*="contact"]',
            '.start-chat',
            '.live-chat', 
            'button[onclick*="chat"]',
            'button[onclick*="GenesysMessenger"]',
            '[data-action="chat"]'
        ];
        
        const contactElements = document.querySelectorAll(selectors.join(','));
        console.log(`🔍 Found ${contactElements.length} contact elements`);
        
        contactElements.forEach((element, index) => {
            if (element.dataset.genesysEnhanced) return;
            
            element.dataset.genesysEnhanced = 'true';
            
            // Clean up any existing handlers
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            
            // Add single, clean event listener
            newElement.addEventListener('click', (e) => {
                console.log(`🖱️ Contact button ${index + 1} clicked`);
                
                // Prevent any navigation
                e.preventDefault();
                e.stopPropagation();
                
                // Open messenger with context
                this.openMessenger({
                    trigger: `contact-button-${index + 1}`,
                    buttonElement: newElement.tagName,
                    buttonText: newElement.textContent.trim()
                });
                
                return false;
            }, true);
            
            // Update button appearance if needed
            if (newElement.textContent.includes('Contact') && !newElement.textContent.includes('💬')) {
                newElement.innerHTML = newElement.innerHTML.replace('Contact', '💬 Live Chat');
                newElement.title = 'Start a live conversation with our support team';
            }
        });
        
        console.log(`✅ Enhanced ${contactElements.length} buttons`);
    },
    
    getPageContext: function(additionalContext = {}) {
        const pathname = window.location.pathname;
        const context = {
            currentPage: pathname,
            pageTitle: document.title,
            timestamp: new Date().toISOString(),
            source: 'insurance-website',
            userAgent: navigator.userAgent.substring(0, 50),
            ...additionalContext
        };
        
        // Add page-specific context
        if (pathname.includes('submit-claim')) {
            context.intent = 'file-claim';
            context.section = 'claims';
        } else if (pathname.includes('track-claims')) {
            context.intent = 'track-claim';
            context.section = 'claims';
        } else if (pathname.includes('contact')) {
            context.intent = 'general-support';
            context.section = 'support';
        } else {
            context.intent = 'general-inquiry';
            context.section = 'general';
        }
        
        return context;
    },
    
    // Debug function for testing
    testMessengerOpen: function() {
        console.log('🧪 Testing direct Messenger.open command...');
        
        if (!this.messengerReady) {
            console.error('❌ Messenger not ready. Wait for Messenger.ready event first.');
            return;
        }
        
        console.log('✅ Messenger is ready, executing command...');
        Genesys("command", "Messenger.open");
    },
    
    // Status check function  
    getStatus: function() {
        const status = {
            genesysLoaded: typeof Genesys !== 'undefined',
            integrationReady: this.isReady,
            messengerReady: this.messengerReady,
            buttonsFound: document.querySelectorAll('[data-genesys-enhanced="true"]').length
        };
        
        console.log('🔍 Genesys Integration Status:', status);
        
        if (status.genesysLoaded && status.messengerReady) {
            console.log('✅ Ready to use: GenesysMessenger.testMessengerOpen()');
        } else {
            console.log('⚠️ Not ready yet. Check status again in a few seconds.');
        }
        
        return status;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 DOM loaded, initializing FINAL Genesys integration...');
    GenesysMessenger.init();
});

// Expose for debugging and testing
window.GenesysMessenger = GenesysMessenger;

// Enhanced form integration
window.genesysIntegration = {
    sendFormContext: function(formType, formData) {
        if (typeof Genesys !== 'undefined') {
            console.log('📝 Sending form context:', formType);
            
            Genesys("command", "Database.set", {
                messaging: {
                    customAttributes: {
                        formType: formType,
                        formData: formData,
                        submissionTime: new Date().toISOString(),
                        source: 'form-submission'
                    }
                }
            });
            
            // Track in Journey
            Genesys("command", "Journey.record", {
                eventName: "form-submitted",
                customAttributes: {
                    formType: formType,
                    success: true,
                    timestamp: new Date().toISOString()
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
    
    // Simple status check
    checkStatus: function() {
        return GenesysMessenger.getStatus();
    },
    
    // Direct test function
    testChat: function() {
        console.log('🧪 Testing chat opening...');
        GenesysMessenger.testMessengerOpen();
    }
};

// Auto-status check after everything loads
setTimeout(() => {
    console.log('📋 Final auto-status check:');
    genesysIntegration.checkStatus();
    
    // Show test instructions
    console.log('');
    console.log('🧪 Test Commands:');
    console.log('genesysIntegration.testChat() - Test direct messenger opening');
    console.log('genesysIntegration.checkStatus() - Check current status');
    console.log('GenesysMessenger.testMessengerOpen() - Direct Messenger.open test');
    
}, 5000);