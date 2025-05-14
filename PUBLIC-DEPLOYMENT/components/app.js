// KLOUD BUGS Public Interface JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize token distribution chart
    initializeChart();
    
    // Modal functionality
    setupModals();
    
    // Form submissions
    setupForms();
    
    // Create stars animation
    createStarsAnimation();
});

// Initialize token distribution chart using Chart.js
function initializeChart() {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Mining Rewards', 'Justice Initiatives', 'Platform Development', 'Community Growth'],
            datasets: [{
                data: [50, 25, 15, 10],
                backgroundColor: [
                    '#6e4dff', // Primary color - mining
                    '#18dcff', // Secondary color - justice
                    '#ff6b6b', // Platform
                    '#46bd78'  // Community
                ],
                borderColor: 'rgba(20, 20, 43, 0.8)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 20, 43, 0.9)',
                    titleFont: {
                        family: 'Montserrat',
                        size: 14
                    },
                    bodyFont: {
                        family: 'Montserrat',
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 6,
                    displayColors: false
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    });
}

// Set up modal functionality
function setupModals() {
    // Get all modals
    const loginModal = document.getElementById('loginModal');
    const termsModal = document.getElementById('termsModal');
    const thankYouModal = document.getElementById('thankYouModal');
    
    // Get buttons that open the modals
    const loginBtn = document.getElementById('loginBtn');
    const waitlistBtn = document.getElementById('waitlistBtn');
    const termsLink = document.getElementById('termsLink');
    const termsFooterLink = document.getElementById('termsFooterLink');
    
    // Get close button elements
    const closeButtons = document.getElementsByClassName('close');
    
    // When the user clicks the login button, open the modal
    loginBtn.addEventListener('click', function() {
        loginModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // When the user clicks on the waitlist button in hero section, scroll to waitlist
    waitlistBtn.addEventListener('click', function() {
        document.getElementById('waitlist').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
    
    // When the user clicks the terms links, open the terms modal
    termsLink.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    termsFooterLink.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // When the user clicks accept in terms modal
    document.getElementById('acceptTerms').addEventListener('click', function() {
        termsModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        
        // If the terms checkbox exists, check it
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox) {
            termsCheckbox.checked = true;
        }
    });
    
    // When the user clicks on the close button or outside the modal, close it
    for (let i = 0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener('click', function() {
            loginModal.style.display = 'none';
            termsModal.style.display = 'none';
            thankYouModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        } else if (event.target == termsModal) {
            termsModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        } else if (event.target == thankYouModal) {
            thankYouModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }
    });
}

// Set up form submission handlers
function setupForms() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Show message indicating that only approved users can login
            alert('This is a controlled access platform. Please contact an administrator if you need access.');
            
            // Close the modal
            document.getElementById('loginModal').style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }
    
    // Waitlist form submission
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const reason = document.getElementById('reason').value;
            const mining = document.getElementById('mining').value;
            const terms = document.getElementById('terms').checked;
            
            // In a real implementation, this would send the data to your server
            // For demonstration, we'll just show a success message
            
            // Reset form
            waitlistForm.reset();
            
            // Show thank you modal
            document.getElementById('thankYouModal').style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Log submission (would be replaced with actual API call)
            console.log('Waitlist submission:', { name, email, reason, mining, terms });
        });
    }
}

// Create stars animation in background
function createStarsAnimation() {
    const starsBackground = document.querySelector('.stars-background');
    
    // Create shooting stars occasionally
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance to create a shooting star
            createShootingStar(starsBackground);
        }
    }, 3000);
    
    // Create initial shooting stars
    for (let i = 0; i < 2; i++) {
        setTimeout(() => {
            createShootingStar(starsBackground);
        }, Math.random() * 5000);
    }
}

// Create a shooting star animation
function createShootingStar(container) {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    
    // Random position and angle
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const angle = Math.random() * 45 + 15; // 15-60 degrees
    
    // Set CSS variables for the animation
    shootingStar.style.setProperty('--start-x', `${startX}vw`);
    shootingStar.style.setProperty('--start-y', `${startY}vh`);
    shootingStar.style.setProperty('--angle', `${angle}deg`);
    
    // Random animation duration
    const duration = Math.random() * 1.5 + 1; // 1-2.5 seconds
    shootingStar.style.setProperty('--duration', `${duration}s`);
    
    // Add shooting star to the container
    container.appendChild(shootingStar);
    
    // Remove the element after animation completes
    setTimeout(() => {
        container.removeChild(shootingStar);
    }, duration * 1000 + 100);
}

// Add a CSS rule for shooting stars
const style = document.createElement('style');
style.textContent = `
    .shooting-star {
        position: absolute;
        top: var(--start-y);
        left: var(--start-x);
        width: 100px;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), rgba(255,255,255,0.8), rgba(255,255,255,0.3), transparent);
        transform: rotate(var(--angle));
        animation: shooting-star var(--duration) linear;
        z-index: 2;
    }
    
    @keyframes shooting-star {
        0% {
            transform: rotate(var(--angle)) translateX(0) scale(0);
            opacity: 0;
        }
        5% {
            opacity: 1;
        }
        80% {
            transform: rotate(var(--angle)) translateX(calc(100vw / cos(var(--angle)))) scale(1);
            opacity: 1;
        }
        100% {
            transform: rotate(var(--angle)) translateX(calc(120vw / cos(var(--angle)))) scale(0.2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Skip if it's the terms link (handled separately)
        if (this.id === 'termsLink' || this.id === 'termsFooterLink') return;
        
        e.preventDefault();
        
        // Get the target element
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        // Scroll to the target element
        targetElement.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Create logo glow effect
const logo = document.getElementById('logo');
if (logo) {
    // Add glow effect on hover
    logo.addEventListener('mouseenter', function() {
        this.style.filter = 'drop-shadow(0 0 8px rgba(110, 77, 255, 0.8))';
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'filter 0.3s ease, transform 0.3s ease';
    });
    
    logo.addEventListener('mouseleave', function() {
        this.style.filter = '';
        this.style.transform = '';
    });
}