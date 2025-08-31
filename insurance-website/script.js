// Global variables
let claims = [];
let claimCounter = 1;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load demo data
    loadDemoData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Load saved claims from localStorage
    loadClaimsFromStorage();
}

function loadDemoData() {
    // Demo claims data
    const demoClaims = [
        {
            id: 'CLM-2024-001234',
            type: 'auto',
            status: 'in-progress',
            dateFiled: '2024-03-15',
            incidentDate: '2024-03-10',
            amount: 3500,
            description: 'Rear-end collision at intersection',
            progress: 3
        },
        {
            id: 'CLM-2024-000987',
            type: 'home',
            status: 'approved',
            dateFiled: '2024-02-28',
            incidentDate: '2024-02-25',
            amount: 1250,
            description: 'Water damage from burst pipe',
            progress: 5
        },
        {
            id: 'CLM-2024-000756',
            type: 'health',
            status: 'pending',
            dateFiled: '2024-03-20',
            incidentDate: '2024-03-18',
            amount: 850,
            description: 'Emergency room visit',
            progress: 2
        }
    ];
    
    // Store demo data
    if (!localStorage.getItem('insurance_claims')) {
        localStorage.setItem('insurance_claims', JSON.stringify(demoClaims));
    }
}

function setupEventListeners() {
    // Login modal
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        const closeBtn = loginModal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideLoginModal);
        }
        
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                hideLoginModal();
            }
        });
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    }
    
    // Claim form
    const claimForm = document.getElementById('claimForm');
    if (claimForm) {
        claimForm.addEventListener('submit', handleClaimSubmission);
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
    
    // Set max date for incident date to today
    const incidentDateInput = document.getElementById('incidentDate');
    if (incidentDateInput) {
        const today = new Date().toISOString().split('T')[0];
        incidentDateInput.setAttribute('max', today);
    }
}

function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

function loadClaimsFromStorage() {
    const storedClaims = localStorage.getItem('insurance_claims');
    if (storedClaims) {
        claims = JSON.parse(storedClaims);
    }
}

function saveClaimsToStorage() {
    localStorage.setItem('insurance_claims', JSON.stringify(claims));
}

// Login Modal Functions
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    // In a real app, you would validate credentials with a server
    // For this demo, we'll accept any non-empty email/password
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (email && password) {
        showMessage('Login successful! Welcome back.', 'success');
        hideLoginModal();
        
        // Update UI to show logged-in state
        updateLoginButton(email);
    } else {
        showMessage('Please enter both email and password.', 'error');
    }
}

function updateLoginButton(email) {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.textContent = `Welcome, ${email.split('@')[0]}`;
        loginBtn.style.background = '#27ae60';
    }
}

// Claim Submission Functions
function handleClaimSubmission(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateClaimForm()) {
        return;
    }
    
    // Collect form data
    const formData = collectClaimFormData();
    
    // Generate claim ID
    const claimId = generateClaimId();
    
    // Create claim object
    const newClaim = {
        id: claimId,
        ...formData,
        dateFiled: new Date().toISOString().split('T')[0],
        status: 'pending',
        progress: 1
    };
    
    // Add to claims array
    claims.push(newClaim);
    saveClaimsToStorage();
    
    // Send context to Genesys if available
    if (typeof genesysIntegration !== 'undefined') {
        genesysIntegration.sendFormContext('claim-submission', {
            claimId: claimId,
            policyType: formData.type,
            claimAmount: formData.amount,
            priority: formData.priority
        });
    }
    
    // Show success message
    showClaimSuccessMessage(claimId);
    
    // Reset form
    document.getElementById('claimForm').reset();
}

function validateClaimForm() {
    const requiredFields = [
        'policyNumber', 'policyType', 'firstName', 'lastName', 
        'phone', 'email', 'incidentDate', 'incidentLocation', 'incidentDescription'
    ];
    
    for (let field of requiredFields) {
        const element = document.getElementById(field);
        if (!element || !element.value.trim()) {
            showMessage(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`, 'error');
            element?.focus();
            return false;
        }
    }
    
    // Validate email
    const email = document.getElementById('email').value;
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Validate incident date (not in future)
    const incidentDate = new Date(document.getElementById('incidentDate').value);
    const today = new Date();
    if (incidentDate > today) {
        showMessage('Incident date cannot be in the future.', 'error');
        return false;
    }
    
    return true;
}

function collectClaimFormData() {
    return {
        policyNumber: document.getElementById('policyNumber').value.trim(),
        type: document.getElementById('policyType').value,
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        incidentDate: document.getElementById('incidentDate').value,
        incidentTime: document.getElementById('incidentTime').value || 'Not specified',
        incidentLocation: document.getElementById('incidentLocation').value.trim(),
        description: document.getElementById('incidentDescription').value.trim(),
        amount: parseFloat(document.getElementById('estimatedAmount').value) || 0,
        priority: document.getElementById('priority').value,
        witnesses: document.getElementById('witnesses').value.trim(),
        policeReport: document.getElementById('policeReport').value,
        additionalNotes: document.getElementById('additionalNotes').value.trim()
    };
}

function generateClaimId() {
    const year = new Date().getFullYear();
    const number = String(Math.floor(Math.random() * 999999) + 100000);
    return `CLM-${year}-${number}`;
}

function showClaimSuccessMessage(claimId) {
    const chatButton = (typeof GenesysMessenger !== 'undefined') 
        ? `<button class="btn btn-primary" onclick="GenesysMessenger.openMessenger({trigger: 'claim-submitted', userData: {claimId: '${claimId}'}})">💬 Chat with Support</button>`
        : '';
    
    const message = `
        <div class="message success">
            <h3>Claim Submitted Successfully!</h3>
            <p><strong>Claim Number:</strong> ${claimId}</p>
            <p>Your claim has been submitted and is being reviewed. You can track its progress on the <a href="track-claims.html">Track Claims</a> page.</p>
            <p>We'll contact you within 24-48 hours with next steps.</p>
            <div style="margin-top: 15px;">
                ${chatButton}
                <p style="font-size: 0.9rem; margin-top: 10px; color: #666;">Need immediate assistance? Our support team is ready to help!</p>
            </div>
        </div>
    `;
    
    // Insert message at top of form
    const form = document.getElementById('claimForm');
    form.insertAdjacentHTML('beforebegin', message);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Contact Form Functions
function handleContactSubmission(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateContactForm()) {
        return;
    }
    
    // Collect form data
    const formData = collectContactFormData();
    
    // Generate ticket ID
    const ticketId = generateTicketId();
    
    // Send context to Genesys if available
    if (typeof genesysIntegration !== 'undefined') {
        genesysIntegration.sendFormContext('contact-form', {
            ticketId: ticketId,
            inquiryType: formData.inquiryType,
            priority: formData.priority,
            subject: formData.subject
        });
    }
    
    // Show success message
    showContactSuccessMessage(ticketId);
    
    // Reset form
    document.getElementById('contactForm').reset();
}

function validateContactForm() {
    const requiredFields = ['firstName', 'lastName', 'email', 'inquiryType', 'subject', 'message'];
    
    for (let field of requiredFields) {
        const element = document.getElementById(field);
        if (!element || !element.value.trim()) {
            showMessage(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`, 'error');
            element?.focus();
            return false;
        }
    }
    
    // Validate email
    const email = document.getElementById('email').value;
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }
    
    return true;
}

function collectContactFormData() {
    return {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        policyNumber: document.getElementById('policyNumber').value.trim(),
        inquiryType: document.getElementById('inquiryType').value,
        priority: document.getElementById('priority').value,
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim(),
        newsletter: document.getElementById('newsletter').checked
    };
}

function generateTicketId() {
    return `TKT-${Date.now()}`;
}

function showContactSuccessMessage(ticketId) {
    const message = `
        <div class="message success">
            <h3>Message Sent Successfully!</h3>
            <p><strong>Ticket Number:</strong> ${ticketId}</p>
            <p>Thank you for contacting us. We've received your message and will respond within 24 hours.</p>
        </div>
    `;
    
    // Insert message at top of form
    const form = document.getElementById('contactForm');
    form.insertAdjacentHTML('beforebegin', message);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Claims Search Functions
function searchClaims() {
    const searchType = document.getElementById('searchType').value;
    const searchValue = document.getElementById('searchValue').value.trim();
    
    if (!searchValue) {
        showMessage('Please enter a search value.', 'error');
        return;
    }
    
    // Load claims from storage
    loadClaimsFromStorage();
    
    let foundClaims = [];
    
    if (searchType === 'claim') {
        foundClaims = claims.filter(claim => 
            claim.id.toLowerCase().includes(searchValue.toLowerCase())
        );
    } else if (searchType === 'policy') {
        foundClaims = claims.filter(claim => 
            claim.policyNumber && claim.policyNumber.toLowerCase().includes(searchValue.toLowerCase())
        );
    }
    
    displaySearchResults(foundClaims, searchValue);
}

function displaySearchResults(foundClaims, searchValue) {
    const resultsContainer = document.getElementById('claimsResults');
    
    if (foundClaims.length === 0) {
        resultsContainer.innerHTML = `
            <div class="message info">
                <h3>No Claims Found</h3>
                <p>No claims were found matching "${searchValue}". Please check your search criteria and try again.</p>
            </div>
        `;
        return;
    }
    
    let html = `<div class="claims-list"><h2>Search Results (${foundClaims.length} found)</h2>`;
    
    foundClaims.forEach(claim => {
        html += generateClaimCardHTML(claim);
    });
    
    html += '</div>';
    resultsContainer.innerHTML = html;
}

function generateClaimCardHTML(claim) {
    const statusClass = `status-${claim.status.replace(' ', '-')}`;
    const statusText = claim.status.charAt(0).toUpperCase() + claim.status.slice(1).replace('-', ' ');
    const typeText = claim.type.charAt(0).toUpperCase() + claim.type.slice(1) + ' Insurance';
    
    return `
        <div class="claim-card">
            <div class="claim-header">
                <div class="claim-info">
                    <h3>Claim #${claim.id}</h3>
                    <span class="claim-type">${typeText}</span>
                </div>
                <div class="claim-status ${statusClass}">${statusText}</div>
            </div>
            <div class="claim-details">
                <div class="claim-detail">
                    <strong>Date Filed:</strong> ${formatDate(claim.dateFiled)}
                </div>
                <div class="claim-detail">
                    <strong>Incident Date:</strong> ${formatDate(claim.incidentDate)}
                </div>
                <div class="claim-detail">
                    <strong>Claim Amount:</strong> $${claim.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
                </div>
                <div class="claim-detail">
                    <strong>Description:</strong> ${claim.description}
                </div>
            </div>
            ${generateProgressHTML(claim.progress)}
            <div class="claim-actions">
                <button class="btn btn-secondary" onclick="viewClaimDetails('${claim.id}')">View Details</button>
                <button class="btn btn-outline" onclick="contactSupport('${claim.id}')">Contact Support</button>
            </div>
        </div>
    `;
}

function generateProgressHTML(progress) {
    const steps = [
        'Claim Submitted',
        'Initial Review',
        'Investigation',
        'Settlement',
        'Payment'
    ];
    
    let html = `
        <div class="claim-progress">
            <h4>Claim Progress</h4>
            <div class="progress-steps">
    `;
    
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        let stepClass = 'pending';
        
        if (stepNumber < progress) {
            stepClass = 'completed';
        } else if (stepNumber === progress) {
            stepClass = 'active';
        }
        
        html += `
            <div class="step ${stepClass}">
                <div class="step-number">${stepNumber}</div>
                <div class="step-title">${step}</div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

// FAQ Functions
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const toggle = element.querySelector('.faq-toggle');
    
    if (answer.classList.contains('active')) {
        answer.classList.remove('active');
        toggle.textContent = '+';
        toggle.style.transform = 'rotate(0deg)';
    } else {
        // Close all other FAQ items
        document.querySelectorAll('.faq-answer.active').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.faq-toggle').forEach(item => {
            item.textContent = '+';
            item.style.transform = 'rotate(0deg)';
        });
        
        // Open clicked item
        answer.classList.add('active');
        toggle.textContent = '−';
        toggle.style.transform = 'rotate(180deg)';
    }
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    document.querySelectorAll('.message').forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    
    // Insert at top of main content
    const main = document.querySelector('main');
    if (main) {
        main.insertAdjacentElement('afterbegin', messageDiv);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

function clearForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.reset();
        showMessage('Form cleared successfully.', 'info');
    }
}

function viewClaimDetails(claimId) {
    showMessage(`Viewing details for claim ${claimId}. This feature would open a detailed view in a real application.`, 'info');
}

function contactSupport(claimId) {
    // Use Genesys Messenger if available
    if (typeof GenesysMessenger !== 'undefined') {
        GenesysMessenger.openMessenger({
            trigger: 'claim-support',
            userData: {
                claimId: claimId,
                page: 'track-claims',
                intent: 'claim-assistance'
            }
        });
    } else {
        showMessage(`Opening support chat for claim ${claimId}...`, 'info');
    }
}

function startLiveChat() {
    // Use Genesys Messenger if available, otherwise show fallback
    if (typeof GenesysMessenger !== 'undefined') {
        GenesysMessenger.openMessenger({
            trigger: 'legacy-chat-button',
            userData: {
                source: 'startLiveChat-function',
                page: window.location.pathname
            }
        });
    } else {
        showMessage('Live chat is loading... Please wait a moment and try again.', 'info');
        // Try again in 2 seconds if Genesys hasn't loaded yet
        setTimeout(() => {
            if (typeof GenesysMessenger !== 'undefined') {
                GenesysMessenger.openMessenger({
                    trigger: 'delayed-chat-button'
                });
            }
        }, 2000);
    }
}

// Mobile menu functionality
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (navMenu && hamburger) {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }
}