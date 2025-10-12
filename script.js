// Global Variables
let currentSection = 'home';
let isLoading = true;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupScrollAnimations();
    setupTimelineAnimations();
    setupInteractiveElements();
});

// Initialize App
function initializeApp() {
    // Show loading screen
    showLoadingScreen();
    
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        hideLoadingScreen();
        animateHeroSection();
    }, 2000);
    
    // Set initial active section
    updateActiveSection('home');
}

// Loading Screen
function showLoadingScreen() {
    const loadingHTML = `
        <div class="loading" id="loadingScreen">
            <div class="loading-spinner"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', loadingHTML);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
    isLoading = false;
}

// Navigation Functions
function setupEventListeners() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('href').substring(1);
            navigateToSection(targetSection);
            closeMobileMenu();
        });
    });
    
    // Logo click
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            navigateToSection('home');
            closeMobileMenu();
        });
    }
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // CTA Buttons
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetSection = e.target.getAttribute('onclick');
            if (targetSection && targetSection.includes('navigateToSection')) {
                const section = targetSection.match(/'([^']+)'/)[1];
                navigateToSection(section);
            }
        });
    });
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Resize events
    window.addEventListener('resize', handleResize);
}

function navigateToSection(sectionId) {
    if (isLoading) return;
    
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // Remove active class from all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Add active class to target section
    section.classList.add('active');
    
    // Update navigation
    updateActiveSection(sectionId);
    
    // Smooth scroll to section
    section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Animate section content
    animateSectionContent(section);
    
    currentSection = sectionId;
}

function updateActiveSection(sectionId) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('revealed')) {
                entry.target.classList.add('revealed');
                
                // Add delay for staggered animations
                setTimeout(() => {
                    // Special animations for different elements
                    if (entry.target.classList.contains('timeline-item')) {
                        animateTimelineItem(entry.target);
                    } else if (entry.target.classList.contains('beyond-card')) {
                        animateCard(entry.target);
                    } else if (entry.target.classList.contains('project-showcase')) {
                        animateProject(entry.target);
                    }
                }, 200);
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.scroll-reveal, .timeline-item, .beyond-card, .project-showcase, .reason-card').forEach(el => {
        observer.observe(el);
    });
}

// Timeline Animations
function setupTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        // Add hover effects
        item.addEventListener('mouseenter', () => {
            animateTimelineIcon(item);
        });
        
        // Add click to expand details
        item.addEventListener('click', () => {
            toggleTimelineDetails(item);
        });
    });
}

function animateTimelineItem(item) {
    const icon = item.querySelector('.timeline-icon');
    const content = item.querySelector('.timeline-content');
    
    // Animate icon
    if (icon) {
        icon.style.animation = 'pulse 0.6s ease-in-out';
    }
    
    // Animate content
    if (content) {
        content.style.animation = 'fadeInUp 0.8s ease-out';
    }
}

function animateTimelineIcon(item) {
    const icon = item.querySelector('.timeline-icon');
    if (icon) {
        icon.style.transform = 'translateX(-50%) scale(1.15) rotate(5deg)';
        icon.style.boxShadow = '0 0 40px rgba(116, 185, 255, 0.6)';
        
        setTimeout(() => {
            icon.style.transform = 'translateX(-50%) scale(1) rotate(0deg)';
            icon.style.boxShadow = '0 0 30px rgba(116, 185, 255, 0.4)';
        }, 400);
    }
}

function toggleTimelineDetails(item) {
    const content = item.querySelector('.timeline-content');
    const details = content.querySelector('.timeline-details');
    
    if (!details) {
        // Create expandable details
        const detailsHTML = `
            <div class="timeline-details" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                <div class="details-content" style="padding: 1rem 0;">
                    <h4>Additional Details</h4>
                    <p>Click to learn more about this phase of my journey...</p>
                    <div class="detail-stats">
                        <div class="stat-item">
                            <span class="stat-label">Impact</span>
                            <span class="stat-value">High</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Learning</span>
                            <span class="stat-value">Extensive</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        content.insertAdjacentHTML('beforeend', detailsHTML);
        
        // Animate expansion
        setTimeout(() => {
            const details = content.querySelector('.timeline-details');
            details.style.maxHeight = '200px';
        }, 100);
    } else {
        // Toggle existing details
        const currentHeight = details.style.maxHeight;
        details.style.maxHeight = currentHeight === '200px' ? '0' : '200px';
    }
}

// Interactive Elements
function setupInteractiveElements() {
    // Stats counter animation
    animateStats();
    
    // Project cards hover effects
    setupProjectInteractions();
    
    // Beyond cards interactions
    setupBeyondCardInteractions();
    
    // Parallax effects
    setupParallaxEffects();
}

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(stat);
    });
}

function animateCounter(element) {
    const target = element.textContent;
    const isNumber = /^\d+/.test(target);
    
    if (isNumber) {
        const finalValue = parseInt(target.replace(/[^\d]/g, ''));
        const suffix = target.replace(/[\d]/g, '');
        let currentValue = 0;
        const increment = finalValue / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                element.textContent = finalValue + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue) + suffix;
            }
        }, 50);
    }
}

function setupProjectInteractions() {
    const projects = document.querySelectorAll('.project-showcase');
    
    projects.forEach(project => {
        // Add expand/collapse functionality
        const header = project.querySelector('.project-header');
        const content = project.querySelector('.project-content');
        
        if (header && content) {
            header.addEventListener('click', () => {
                toggleProjectContent(project);
            });
            
            // Add cursor pointer
            header.style.cursor = 'pointer';
        }
    });
}

function toggleProjectContent(project) {
    const content = project.querySelector('.project-content');
    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';
    
    if (isExpanded) {
        content.style.maxHeight = '0';
        content.style.overflow = 'hidden';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.overflow = 'visible';
    }
}

function setupBeyondCardInteractions() {
    const cards = document.querySelectorAll('.beyond-card, .metric, .focus-item');
    
    cards.forEach(card => {
        // Add subtle tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

function setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-image, .timeline-icon');
    
    // Use throttled scroll handler for better performance
    const throttledScroll = throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const rate = (scrolled * -0.3) + (index * 10); // Vary the rate slightly
            element.style.transform = `translateY(${rate}px)`;
        });
    }, 16); // ~60fps
    
    window.addEventListener('scroll', throttledScroll);
}

// Section Animations
function animateHeroSection() {
    const heroElements = document.querySelectorAll('.hero-content > *');
    
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function animateSectionContent(section) {
    const elements = section.querySelectorAll('.scroll-reveal, .timeline-item, .beyond-card, .project-showcase');
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('revealed');
        }, index * 100);
    });
}

function animateCard(card) {
    card.style.animation = 'cardSlideIn 0.6s ease-out';
}

function animateProject(project) {
    project.style.animation = 'projectSlideIn 0.8s ease-out';
}

// Scroll Handling
function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar background opacity
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const opacity = Math.min(scrollY / 100, 0.95);
        navbar.style.background = `rgba(255, 255, 255, ${opacity * 0.1})`;
    }
    
    // Update active section based on scroll position
    updateActiveSectionOnScroll();
}

function updateActiveSectionOnScroll() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            const sectionId = section.id;
            if (sectionId !== currentSection) {
                updateActiveSection(sectionId);
                currentSection = sectionId;
            }
        }
    });
}

function handleResize() {
    // Recalculate animations on resize
    setupScrollAnimations();
    
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}

// Mobile Menu Functions
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    navLinks.classList.remove('active');
    mobileToggle.classList.remove('active');
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add CSS animations dynamically
const additionalStyles = `
    @keyframes pulse {
        0% { transform: translateX(-50%) scale(1); }
        50% { transform: translateX(-50%) scale(1.1); }
        100% { transform: translateX(-50%) scale(1); }
    }
    
    @keyframes cardSlideIn {
        from {
            opacity: 0;
            transform: translateY(30px) rotateX(10deg);
        }
        to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
        }
    }
    
    @keyframes projectSlideIn {
        from {
            opacity: 0;
            transform: translateX(-50px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
    }
    
    .timeline-details {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        margin-top: 1rem;
    }
    
    .detail-stats {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
    }
    
    .stat-label {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    .stat-value {
        font-size: 1rem;
        color: var(--text-accent);
        font-weight: 600;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add intersection observer for performance
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Performance optimization
const optimizedScrollHandler = throttle(handleScroll, 16);
window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', optimizedScrollHandler);
