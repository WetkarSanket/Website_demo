// MINIMAL Genesys Integration - Single loading point to avoid conflicts
// Load Genesys SDK here ONLY (not in HTML)

console.log('🚀 Starting MINIMAL Genesys integration...');

// Load Genesys SDK Bootstrap (ONLY HERE to avoid conflicts)
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

// Simple messenger integration without conflicts
const MinimalGenesys = {
    ready: false,
    
    init: function() {
        console.log('⚡ Initializing minimal Genesys integration...');
        
        // Wait for Genesys SDK to load (since we just loaded it above)
        this.waitForGenesys(() => {
            console.log('✅ Genesys SDK loaded, setting up minimal integration...');
            this.setupBasicIntegration();
        });
    },
    
    waitForGenesys: function(callback) {
        if (typeof Genesys !== 'undefined') {
            callback();
        } else {
            console.log('⏳ Waiting for Genesys SDK to load...');
            setTimeout(() => this.waitForGenesys(callback), 500);
        }
    },
    
    setupBasicIntegration: function() {
        // Only set up minimal event listeners
        try {
            Genesys("subscribe", "Messenger.ready", () => {
                console.log('✅ Messenger ready');
                this.ready = true;
                this.enhanceButtons();
            });
            
            Genesys("subscribe", "Messenger.opened", () => {
                console.log('💬 Messenger opened');
            });
            
            console.log('✅ Basic event listeners set up');
            
        } catch (error) {
            console.error('❌ Error setting up Genesys events:', error);
        }
    },
    
    // Simple button enhancement
    enhanceButtons: function() {
        console.log('🔧 Enhancing buttons...');
        
        const buttons = document.querySelectorAll('a[href*="contact"], .start-chat, .live-chat');
        console.log(`Found ${buttons.length} buttons to enhance`);
        
        buttons.forEach((button, index) => {
            if (button.dataset.enhanced) return;
            
            button.dataset.enhanced = 'true';
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`🖱️ Button ${index + 1} clicked`);
                this.openChat();
            });
            
            // Update text
            if (button.textContent.includes('Contact')) {
                button.textContent = '💬 Live Chat';
            }
        });
        
        console.log(`✅ Enhanced ${buttons.length} buttons`);
    },
    
    // Simple chat opening
    openChat: function() {
        if (!this.ready) {
            console.warn('⚠️ Messenger not ready yet');
            return;
        }
        
        console.log('🚀 Opening messenger...');
        
        try {
            // Set minimal context
            Genesys("command", "Database.set", {
                messaging: {
                    customAttributes: {
                        source: 'website-button',
                        page: window.location.pathname,
                        timestamp: new Date().toISOString()
                    }
                }
            });
            
            // Open messenger
            Genesys("command", "Messenger.open");
            
        } catch (error) {
            console.error('❌ Error opening messenger:', error);
        }
    },
    
    // Simple status check
    status: function() {
        console.log('📊 Status:', {
            genesysLoaded: typeof Genesys !== 'undefined',
            messengerReady: this.ready,
            buttonsEnhanced: document.querySelectorAll('[data-enhanced="true"]').length
        });
    }
};

// Simple Journey tracking (separate from messenger)
function setupJourneyTracking() {
    if (typeof Genesys === 'undefined') return;
    
    try {
        Genesys("subscribe", "Journey.ready", function() {
            console.log('✅ Journey ready');
            
            // Simple page tracking
            setTimeout(() => {
                let path = window.location.pathname;
                if (path === '/' || path === '/index.html') path = '/home';
                
                console.log('📊 Tracking:', path);
                
                Genesys("command", "Journey.pageview", {
                    pageTitle: path,
                    pageUrl: window.location.href
                });
            }, 1000);
        });
    } catch (error) {
        console.error('❌ Journey tracking error:', error);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 DOM ready, starting minimal integration...');
    
    // Small delay to ensure Genesys is fully loaded
    setTimeout(() => {
        MinimalGenesys.init();
        setupJourneyTracking();
        
        // Status check
        setTimeout(() => {
            MinimalGenesys.status();
        }, 2000);
        
    }, 1000);
});

// Expose for testing
window.MinimalGenesys = MinimalGenesys;

// Test function
window.testGenesysChat = function() {
    console.log('🧪 Testing chat...');
    MinimalGenesys.openChat();
};