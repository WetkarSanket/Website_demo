// Enhanced Genesys Cloud Messenger SDK Integration with Flow Activation
// This file handles Genesys Messenger deployment, Journey tracking, and flow triggering

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

// Enhanced Journey Tracking Implementation
Genesys("subscribe", "Journey.ready", function() {
    console.log('✅ Genesys Journey tracking initialized');
    
    // Track page view on load with delay to ensure proper initialization
    setTimeout(function () {
        trackPageView();
        
        // Also trigger a welcome flow if configured
        triggerWelcomeFlow();
    }, 500);
    
    // Track navigation changes for SPAs (if applicable)
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

// Enhanced page tracking function
function trackPageView() {
    let pathname = window.location.pathname;
    let pageTitle = document.title;
    
    // Handle root path
    if (!pathname || pathname === "/" || pathname === "/index.html") {
        pathname = "/home";
        pageTitle = "Homepage - SecureLife Insurance";
    }
    
    // Extract meaningful page identifier
    let segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
        pathname = "/" + segments[segments.length - 1].replace('.html', '');
    }
    
    // Map HTML filenames to friendly names for tracking
    const pageMapping = {
        '/index': '/home',
        '/submit-claim': '/submit-claim',
        '/track-claims': '/track-claims', 
        '/contact': '/contact'
    };
    
    // Use mapped name if available
    if (pageMapping[pathname]) {
        pathname = pageMapping[pathname];
    }
    
    // Extract page context
    let pageContext = {
        section: 'insurance-portal',
        category: getPageCategory(pathname),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent.substring(0, 100) // Truncate for cleaner data
    };
    
    console.log('📊 Tracking page view:', {
        pathname: pathname,
        pageTitle: pageTitle,
        context: pageContext
    });
    
    // Send Journey pageview event
    Genesys("command", "Journey.pageview", {
        pageTitle: pathname,
        pageUrl: window.location.href,
        customAttributes: pageContext
    });
    
    // Also set custom attributes for messenger context
    Genesys("command", "Database.set", {
        messaging: {
            customAttributes: {
                currentPage: pathname,
                pageCategory: pageContext.category,
                visitTime: new Date().toISOString(),
                source: 'insurance-website'
            }
        }
    });
}

// Trigger welcome flow based on page
function triggerWelcomeFlow() {
    const pathname = window.location.pathname;
    let flowTrigger = null;
    
    // Define flow triggers based on page
    if (pathname.includes('contact')) {
        flowTrigger = 'contact-page-visit';
    } else if (pathname.includes('submit-claim')) {
        flowTrigger = 'claim-submission-page';
    } else if (pathname.includes('track-claims')) {
        flowTrigger = 'claim-tracking-page';
    } else {
        flowTrigger = 'homepage-visit';
    }
    
    // Record the page visit as a Journey event that can trigger flows
    if (flowTrigger) {
        console.log('🎯 Triggering flow for:', flowTrigger);
        Genesys("command", "Journey.record", {
            eventName: flowTrigger,
            customAttributes: {
                source: 'page-visit',
                page: pathname,
                timestamp: new Date().toISOString()
            }
        });
    }
}

// Determine page category for better analytics
function getPageCategory(pathname) {
    const categoryMap = {
        '/home': 'landing',
        '/submit-claim': 'claims-submission',
        '/track-claims': 'claims-tracking',
        '/contact': 'customer-support'
    };
    
    return categoryMap[pathname] || 'other';
}

// Enhanced Genesys Messenger Widget Integration
const GenesysMessenger = {
    isReady: false,
    
    // Initialize messenger when DOM is ready
    init: function() {
        console.log('🚀 Initializing Genesys Messenger integration...');
        
        // Wait for Genesys to be fully loaded
        this.waitForGenesys(() => {
            this.setupMessengerEvents();
            this.enhanceContactButtons();
            this.isReady = true;
            console.log('✅ Genesys Messenger integration ready!');
        });
    },
    
    // Wait for Genesys SDK to be ready
    waitForGenesys: function(callback) {
        if (typeof Genesys !== 'undefined') {
            // Subscribe to Messenger ready event
            Genesys("subscribe", "Messenger.ready", function() {
                console.log('✅ Genesys Messenger is ready');
                
                // Configure messenger settings
                Genesys("command", "Messenger.configure", {
                    welcomeMessage: {
                        enabled: true
                    },
                    fileUpload: {
                        enabled: true
                    },
                    launcher: {
                        enabled: true
                    }
                });
                
                callback();
            });
            
            // Also subscribe to other important events
            Genesys("subscribe", "Journey.ready", function() {
                console.log('✅ Genesys Journey is ready');
            });
            
        } else {
            console.log('⏳ Waiting for Genesys SDK to load...');
            setTimeout(() => this.waitForGenesys(callback), 500);
        }
    },
    
    // Set up messenger event listeners
    setupMessengerEvents: function() {
        console.log('🔧 Setting up Genesys event listeners...');
        
        // Track when messenger is opened
        Genesys("subscribe", "Messenger.opened", function() {
            console.log('💬 Genesys Messenger opened');
            
            // Track as a Journey event - this can trigger flows
            Genesys("command", "Journey.record", {
                eventName: "messenger-opened",
                customAttributes: {
                    source: "insurance-portal",
                    page: window.location.pathname,
                    timestamp: new Date().toISOString()
                }
            });
            
            // Also send a specific event to potentially trigger welcome flows
            setTimeout(() => {
                Genesys("command", "Journey.record", {
                    eventName: "chat-session-started",
                    customAttributes: {
                        source: "manual-trigger",
                        intent: "customer-support",
                        page: window.location.pathname
                    }
                });
            }, 1000);
        });
        
        // Track when messenger is closed
        Genesys("subscribe", "Messenger.closed", function() {
            console.log('❌ Genesys Messenger closed');
        });
        
        // Track when conversation starts
        Genesys("subscribe", "Conversations.started", function(data) {
            console.log('🎉 Conversation started:', data);
            
            // Track conversation start in Journey
            Genesys("command", "Journey.record", {
                eventName: "conversation-started",
                customAttributes: {
                    source: "insurance-portal",
                    page: window.location.pathname,
                    conversationId: data.conversationId || 'unknown'
                }
            });
        });
        
        // Track when messages are sent/received
        Genesys("subscribe", "Conversations.message", function(data) {
            console.log('💬 Message activity:', data);
        });
    },
    
    // Enhanced messenger opening with flow triggers
    openMessenger: function(context = {}) {
        if (!this.isReady) {
            console.warn('⚠️ Genesys not ready yet, waiting...');
            setTimeout(() => this.openMessenger(context), 1000);
            return;
        }
        
        console.log('🚀 Opening Genesys Messenger with context:', context);
        
        // Set comprehensive user context
        const userContext = {
            currentPage: window.location.pathname,
            pageTitle: document.title,
            timestamp: new Date().toISOString(),
            trigger: context.trigger || "manual",
            source: "insurance-website",
            ...context.userData
        };
        
        // Set user context for agents
        Genesys("command", "Database.set", {
            messaging: {
                customAttributes: userContext
            }
        });
        
        // Record the trigger event - this is key for flow activation
        Genesys("command", "Journey.record", {
            eventName: "messenger-triggered",
            customAttributes: userContext
        });
        
        // Open the messenger
        Genesys("command", "Messenger.open");
        
        // Send additional trigger after opening to ensure flow activation
        setTimeout(() => {
            console.log('🎯 Sending flow activation trigger...');
            
            // Try multiple approaches to trigger flows
            Genesys("command", "Journey.record", {
                eventName: "chat-initiated",
                customAttributes: {
                    ...userContext,
                    flowTrigger: true,
                    actionType: "start-conversation"
                }
            });
            
            // Also try triggering based on page context
            let pageSpecificEvent = "general-inquiry";
            if (context.trigger === "claim-support" || window.location.pathname.includes("claim")) {
                pageSpecificEvent = "claims-assistance";
            } else if (window.location.pathname.includes("contact")) {
                pageSpecificEvent = "contact-support";
            }
            
            Genesys("command", "Journey.record", {
                eventName: pageSpecificEvent,
                customAttributes: userContext
            });
            
        }, 2000);
    },
    
    // Close messenger widget
    closeMessenger: function() {
        Genesys("command", "Messenger.close");
    },
    
    // Enhance existing contact buttons with Genesys functionality
    enhanceContactButtons: function() {
        console.log('🔧 Enhancing contact buttons...');
        
        // Find all contact-related buttons and links
        const contactTriggers = document.querySelectorAll([
            'a[href="contact.html"]',
            'a[href="/contact.html"]',
            '.contact-support',
            '.start-chat',
            '.live-chat',
            '[onclick*="contactSupport"]',
            '[onclick*="startLiveChat"]',
            '[onclick*="GenesysMessenger"]'
        ].join(','));
        
        console.log(`🔍 Found ${contactTriggers.length} contact elements to enhance`);
        
        contactTriggers.forEach((element, index) => {
            // Don't override if already enhanced
            if (element.dataset.genesysEnhanced) return;
            
            element.dataset.genesysEnhanced = 'true';
            
            // Add click handler to open messenger
            element.addEventListener('click', (e) => {
                console.log(`🖱️ Contact button ${index + 1} clicked`);
                
                // For links to contact page, prevent default and open messenger instead
                if (element.getAttribute('href') === 'contact.html' || 
                    element.getAttribute('href') === '/contact.html') {
                    e.preventDefault();
                }
                
                // Extract context from the current page
                const context = this.getPageContext();
                
                // Open messenger with context
                this.openMessenger({
                    trigger: 'contact-button-' + (index + 1),
                    userData: context
                });
            });
            
            // Update button text/appearance to indicate live chat
            if (element.textContent.includes('Contact') && !element.textContent.includes('💬')) {
                element.innerHTML = element.innerHTML.replace('Contact', '💬 Live Chat');
                element.title = 'Start a live conversation with our support team';
            }
        });
        
        console.log(`✅ Enhanced ${contactTriggers.length} contact buttons with Genesys integration`);
    },
    
    // Get current page context for messenger
    getPageContext: function() {
        const pathname = window.location.pathname;
        const context = {
            currentPage: pathname,
            pageTitle: document.title,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 100),
            referrer: document.referrer
        };
        
        // Add page-specific context
        if (pathname.includes('submit-claim')) {
            context.intent = 'file-claim';
            context.section = 'claims';
            context.priority = 'medium';
        } else if (pathname.includes('track-claims')) {
            context.intent = 'track-claim';
            context.section = 'claims';
            context.priority = 'high';
        } else if (pathname.includes('contact')) {
            context.intent = 'general-support';
            context.section = 'support';
            context.priority = 'medium';
        } else {
            context.intent = 'general-inquiry';
            context.section = 'general';
            context.priority = 'low';
        }
        
        return context;
    },
    
    // Debug function to test flow triggering
    debugFlowTrigger: function(eventName = 'test-flow-trigger') {
        console.log('🐛 DEBUG: Manually triggering flow event:', eventName);
        
        Genesys("command", "Journey.record", {
            eventName: eventName,
            customAttributes: {
                debug: true,
                source: 'manual-debug',
                timestamp: new Date().toISOString(),
                page: window.location.pathname
            }
        });
        
        console.log('🐛 DEBUG: Flow trigger sent. Check Genesys Cloud for event reception.');
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 DOM loaded, initializing Genesys integration...');
    GenesysMessenger.init();
});

// Expose GenesysMessenger globally for manual usage and debugging
window.GenesysMessenger = GenesysMessenger;

// Enhanced utility functions for form integration
window.genesysIntegration = {
    // Send form data to Genesys for context
    sendFormContext: function(formType, formData) {
        if (typeof Genesys !== 'undefined') {
            console.log('📝 Sending form context to Genesys:', formType);
            
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
            
            // Track form submission in Journey with potential flow trigger
            Genesys("command", "Journey.record", {
                eventName: "form-submitted",
                customAttributes: {
                    formType: formType,
                    page: window.location.pathname,
                    success: true,
                    timestamp: new Date().toISOString()
                }
            });
            
            // Try to trigger a form-specific flow
            const flowEvent = formType === 'claim-submission' ? 'claim-form-completed' : 'contact-form-completed';
            setTimeout(() => {
                Genesys("command", "Journey.record", {
                    eventName: flowEvent,
                    customAttributes: {
                        formType: formType,
                        needsFollowup: true
                    }
                });
            }, 1000);
        }
    },
    
    // Open messenger with specific form context and flow trigger
    openMessengerWithForm: function(formType, formData) {
        console.log('💬 Opening messenger with form context:', formType);
        
        GenesysMessenger.openMessenger({
            trigger: 'form-assistance',
            userData: {
                formType: formType,
                formData: formData,
                needsHelp: true,
                context: 'post-form-submission'
            }
        });
    },
    
    // Debug function accessible from browser console
    testFlowTrigger: function(eventName) {
        GenesysMessenger.debugFlowTrigger(eventName);
    },
    
    // Function to check Genesys status
    checkStatus: function() {
        console.log('🔍 Genesys Integration Status:');
        console.log('- Genesys SDK loaded:', typeof Genesys !== 'undefined');
        console.log('- Messenger ready:', GenesysMessenger.isReady);
        console.log('- Environment: prod-euw2');
        console.log('- Deployment ID: 7953b9f3-bac3-4b1d-95e4-9d489c49af26');
        console.log('- Current page tracked:', window.location.pathname);
        
        if (typeof Genesys !== 'undefined') {
            console.log('✅ Try: genesysIntegration.testFlowTrigger("welcome-message")');
        }
        
        return GenesysMessenger.isReady;
    }
};

// Auto-check status after 3 seconds
setTimeout(() => {
    console.log('📋 Genesys Integration Auto-Status Check:');
    window.genesysIntegration.checkStatus();
}, 3000);