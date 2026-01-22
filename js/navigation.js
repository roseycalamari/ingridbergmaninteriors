/**
 * Advanced Navigation System
 * Provides smooth, performant navigation with enhanced mobile support
 * Optimized for all device sizes and orientations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Navigation elements
    const logoTrigger = document.querySelector('.logo-container');
    const offCanvasNav = document.getElementById('offCanvasNav');
    const offCanvasOverlay = document.getElementById('offCanvasOverlay');
    const body = document.body;
    const menuItems = document.querySelectorAll('.off-canvas-menu-item');
    
    // Current page path for active state
    const currentPath = window.location.pathname;
    
    /**
     * Initialize the navigation system
     */
    const initNavigation = () => {
        // Toggle navigation when clicking the logo
        if (logoTrigger) {
            logoTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                offCanvasNav.classList.toggle('active');
                offCanvasOverlay.classList.toggle('active');
                body.classList.toggle('no-scroll');
                logoTrigger.classList.toggle('active');
            });
        }
        
        // Close when clicking overlay
        if (offCanvasOverlay) {
            offCanvasOverlay.addEventListener('click', () => {
                offCanvasNav.classList.remove('active');
                offCanvasOverlay.classList.remove('active');
                body.classList.remove('no-scroll');
                if (logoTrigger) {
                    logoTrigger.classList.remove('active');
                }
            });
        }
        
        // Set active menu item based on current page
        setActiveMenuItem();
        
        // Handle menu item clicks
        setupMenuItemClicks();
        
        // Close navigation with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && offCanvasNav && offCanvasNav.classList.contains('active')) {
                offCanvasNav.classList.remove('active');
                offCanvasOverlay.classList.remove('active');
                body.classList.remove('no-scroll');
                if (logoTrigger) {
                    logoTrigger.classList.remove('active');
                }
            }
        });
        
        // Prevent content shift when opening menu
        preventContentShift();
        
        // Add background elements for visual interest
        addBackgroundElements();
    };
    
    /**
     * Add interactive background elements to the menu
     */
    const addBackgroundElements = () => {
        if (!offCanvasNav) return;
        
        // Create first background element
        const bg1 = document.createElement('div');
        bg1.classList.add('menu-background-element', 'menu-bg-1');
        offCanvasNav.appendChild(bg1);
        
        // Create second background element
        const bg2 = document.createElement('div');
        bg2.classList.add('menu-background-element', 'menu-bg-2');
        offCanvasNav.appendChild(bg2);
        
        // Add subtle movement to background elements on mouse move
        offCanvasNav.addEventListener('mousemove', (e) => {
            if (!offCanvasNav.classList.contains('active')) return;
            
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 20;
            const yPos = (clientY / window.innerHeight - 0.5) * 20;
            
            // Use requestAnimationFrame for smooth animation
            requestAnimationFrame(() => {
                bg1.style.transform = `translate(${xPos * 0.5}px, ${yPos * 0.5}px) scale(1)`;
                bg2.style.transform = `translate(${-xPos * 0.3}px, ${-yPos * 0.3}px) scale(1)`;
            });
        });
    };
    
    /**
     * Prevent content shift when navigation is opened (modal effect)
     */
    const preventContentShift = () => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        
        // Store the original padding of body
        const originalPadding = window.getComputedStyle(document.body).paddingRight;
        
        // Store functions that will be used in the event listeners
        const handleBeforeToggle = () => {
            if (!document.body.classList.contains('no-scroll')) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
        };
        
        const handleAfterToggle = () => {
            if (!document.body.classList.contains('no-scroll')) {
                document.body.style.paddingRight = originalPadding;
            }
        };
        
        // Add event listeners for logo
        logoTrigger.addEventListener('click', handleBeforeToggle, { capture: true });
        logoTrigger.addEventListener('click', () => {
            if (!document.body.classList.contains('no-scroll')) {
                setTimeout(handleAfterToggle, 10);
            }
        }, { capture: false });
    };
    
    /**
     * Set the active menu item based on current page
     */
    const setActiveMenuItem = () => {
        menuItems.forEach(item => {
            const section = item.getAttribute('data-section');
            if (section === 'home' && currentPath === '/') {
                item.classList.add('active');
            } else if (currentPath.includes(section)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };
    
    /**
     * Setup event handlers for menu item clicks
     */
    const setupMenuItemClicks = () => {
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.getAttribute('data-section');
                if (section) {
                    offCanvasNav.classList.remove('active');
                    offCanvasOverlay.classList.remove('active');
                    body.classList.remove('no-scroll');
                    if (logoTrigger) {
                        logoTrigger.classList.remove('active');
                    }
                    // Handle section navigation here
                }
            });
        });
    };
    
    // Initialize the navigation system
    initNavigation();
    
    // Make functions available globally if needed
    window.navigationSystem = {
        toggleNavigation: () => {
            offCanvasNav.classList.toggle('active');
            offCanvasOverlay.classList.toggle('active');
            body.classList.toggle('no-scroll');
            logoTrigger.classList.toggle('active');
        },
        closeNavigation: () => {
            offCanvasNav.classList.remove('active');
            offCanvasOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
            if (logoTrigger) {
                logoTrigger.classList.remove('active');
            }
        },
        initNavigation: initNavigation
    };
});

// Function to handle section activation
function activateSection(section) {
    // Remove active class from all sections
    document.querySelectorAll('.about-section, .service-section, .brands-section, .contact-section').forEach(s => {
        s.classList.remove('active');
    });
    
    // Add active class to the selected section
    if (section) {
        section.classList.add('active');
        document.body.classList.add('section-active');
    } else {
        document.body.classList.remove('section-active');
    }
}

// Update event listeners to use the new function
document.querySelectorAll('.off-canvas-menu-item, .contact-btn').forEach(item => {
    item.addEventListener('click', function() {
        const section = this.dataset.section;
        if (section === 'home') {
            activateSection(null);
        } else if (section === 'person') {
            activateSection(document.querySelector('.about-section'));
        } else if (section === 'service') {
            activateSection(document.querySelector('.service-section'));
        } else if (section === 'brands') {
            activateSection(document.querySelector('.brands-section'));
        } else if (section === 'contact') {
            activateSection(document.querySelector('.contact-section'));
        }
    });
});

// Update close button handlers
document.querySelectorAll('.close-about, .close-service, .close-brands, .close-contact').forEach(button => {
    button.addEventListener('click', function() {
        // Stop video if it's playing
        const video = document.getElementById('collections-video');
        if (video) {
            video.pause();
            video.currentTime = 0;
            const playButton = document.querySelector('.video-play-btn');
            if (playButton) {
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
            const videoWrapper = document.querySelector('.luxury-video-wrapper');
            if (videoWrapper) {
                videoWrapper.classList.remove('video-playing');
            }
        }
        activateSection(null);
    });
});