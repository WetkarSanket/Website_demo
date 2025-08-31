// Genesys Cloud Messenger SDK Integration
// This file handles Genesys Messenger deployment and Journey tracking

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

// Journey Tracking Implementation
Genesys("subscribe", "Journey.ready", function() {
    console.log('Genesys Journey tracking initialized');
    
    // Track page view on load
    setTimeout(function () {
        trackPageView();
    }, 100);
    
    // Track navigation changes for SPAs (if applicable)
    if (window.history && window.history.pushState) {
        const originalPushState = window.history.pushState;
        window.history.pushState = function() {
            originalPushState.apply(window.history, arguments);
            setTimeout(trackPageView, 100);
        };
        
        window.addEventListener('popstate', function() {
            setTimeout(trackPageView, 100);
        });
    }
});

// Enhanced page tracking function
function trackPageView() {
    let pathname = window.location.pathname;
    let pageTitle = document.title;
    
    // Handle root path
    if (!pathname || pathname === "/") {
        pathname = "/home";
        pageTitle = "Homepage - SecureLife Insurance";
    }
    
    // Extract meaningful page identifier
    let segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
        pathname = "/" + segments[segments.length - 1];
    }
    
    // Map HTML filenames to friendly names for tracking
    const pageMapping = {
        '/index.html': '/home',
        '/submit-claim.html': '/submit-claim',
        '/track-claims.html': '/track-claims', 
        '/contact.html': '/contact',
        '/home': '/home'
    };
    
    // Use mapped name if available
    if (pageMapping[pathname]) {
        pathname = pageMapping[pathname];
    }
    
    // Extract page context from title or URL
    let pageContext = {
        section: 'insurance-portal',
        category: getPageCategory(pathname)
    };
    
    console.log('Tracking page view:', {
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

// Genesys Messenger Widget Integration
const GenesysMessenger = {
    // Initialize messenger when DOM is ready
    init: function() {
        console.log('Initializing Genesys Messenger integration');
        
        // Wait for Genesys to be fully loaded
        this.waitForGenesys(() => {
            this.setupMessengerEvents();
            this.enhanceContactButtons();
        });
    },
    
    // Wait for Genesys SDK to be ready
    waitForGenesys: function(callback) {
        if (typeof Genesys !== 'undefined') {
            // Subscribe to Messenger ready event
            Genesys("subscribe", "Messenger.ready", function() {
                console.log('Genesys Messenger is ready');
                callback();
            });
        } else {
            setTimeout(() => this.waitForGenesys(callback), 100);
        }
    },
    
    // Set up messenger event listeners
    setupMessengerEvents: function() {
        // Track when messenger is opened
        Genesys("subscribe", "Messenger.opened", function() {
            console.log('Genesys Messenger opened');
            
            // Track as a Journey event
            Genesys("command", "Journey.record", {
                eventName: "messenger-opened",
                customAttributes: {
                    source: "insurance-portal",
                    page: window.location.pathname
                }
            });
        });
        
        // Track when messenger is closed
        Genesys("subscribe", "Messenger.closed", function() {
            console.log('Genesys Messenger closed');
        });
        
        // Track when conversation starts
        Genesys("subscribe", "Conversations.started", function(data) {
            console.log('Conversation started:', data);
            
            // Track conversation start in Journey
            Genesys("command", "Journey.record", {
                eventName: "conversation-started",
                customAttributes: {
                    source: "insurance-portal",
                    page: window.location.pathname,
                    conversationId: data.conversationId
                }
            });
        });
    },
    
    // Open messenger widget
    openMessenger: function(context = {}) {
        console.log('Opening Genesys Messenger with context:', context);
        
        // Set user context if provided
        if (context.userData) {
            Genesys("command", "Database.set", {
                messaging: {
                    customAttributes: context.userData
                }
            });
        }
        
        // Open the messenger
        Genesys("command", "Messenger.open");
        
        // Track the opening action
        Genesys("command", "Journey.record", {
            eventName: "messenger-triggered",
            customAttributes: {
                trigger: context.trigger || "manual",
                page: window.location.pathname,
                ...context.userData
            }
        });
    },
    
    // Close messenger widget
    closeMessenger: function() {
        Genesys("command", "Messenger.close");
    },
    
    // Enhance existing contact buttons with Genesys functionality
    enhanceContactButtons: function() {
        // Find all contact-related buttons and links
        const contactTriggers = document.querySelectorAll([
            'a[href="contact.html"]',
            '.contact-support',
            '.start-chat',
            '.live-chat',
            '[onclick*="contactSupport"]',
            '[onclick*="startLiveChat"]'
        ].join(','));
        
        contactTriggers.forEach(element => {
            // Don't override if already enhanced
            if (element.dataset.genesysEnhanced) return;
            
            element.dataset.genesysEnhanced = 'true';
            
            // Add click handler to open messenger
            element.addEventListener('click', (e) => {
                // For links to contact page, prevent default and open messenger instead
                if (element.getAttribute('href') === 'contact.html' || 
                    element.getAttribute('href') === '/contact.html') {
                    e.preventDefault();
                }
                
                // Extract context from the current page
                const context = this.getPageContext();
                
                // Open messenger with context
                this.openMessenger({
                    trigger: 'contact-button',
                    userData: context
                });
            });
            
            // Update button text/appearance to indicate live chat
            if (element.textContent.includes('Contact')) {
                element.innerHTML = element.innerHTML.replace('Contact', '💬 Live Chat');
                element.title = 'Start a live conversation with our support team';
            }
        });
        
        console.log(`Enhanced ${contactTriggers.length} contact buttons with Genesys integration`);
    },
    
    // Get current page context for messenger
    getPageContext: function() {
        const pathname = window.location.pathname;
        const context = {
            currentPage: pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
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
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    GenesysMessenger.init();
});

// Expose GenesysMessenger globally for manual usage
window.GenesysMessenger = GenesysMessenger;

// Utility functions for form integration
window.genesysIntegration = {
    // Send form data to Genesys for context
    sendFormContext: function(formType, formData) {
        if (typeof Genesys !== 'undefined') {
            Genesys("command", "Database.set", {
                messaging: {
                    customAttributes: {
                        formType: formType,
                        formData: formData,
                        submissionTime: new Date().toISOString()
                    }
                }
            });
            
            // Track form submission in Journey
            Genesys("command", "Journey.record", {
                eventName: "form-submitted",
                customAttributes: {
                    formType: formType,
                    page: window.location.pathname,
                    success: true
                }
            });
        }
    },
    
    // Open messenger with specific form context
    openMessengerWithForm: function(formType, formData) {
        GenesysMessenger.openMessenger({
            trigger: 'form-assistance',
            userData: {
                formType: formType,
                formData: formData,
                needsHelp: true
            }
        });
    }
};