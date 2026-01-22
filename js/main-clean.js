/**
 * Core JavaScript for Luxury Interior Design Website
 * High-performance interactions with mobile-first approach
 * Uses advanced animation techniques and performance optimizations
 */

// Debug function - disabled in production
function debugLog(message, data) {
    const DEBUG = false;
    if (DEBUG && data) console.log(`[DEBUG] ${message}`, data);
    else if (DEBUG) console.log(`[DEBUG] ${message}`);
}

// Gallery images data
const galleryImages = [
    "images/cali project/IBICali2019-1 - Copy - Copy.jpg",
    "images/cali project/IBICali2019-4.jpg",
    "images/cali project/IBICali2019-5.jpg",
    "images/cali project/IBICali2019-6.jpg",
    "images/cali project/IBICali2019-9 - Copy.jpg",
    "images/cali project/IBICali2019-10 - Copy - Copy.jpg",
    "images/cali project/IBICali2019-12.jpg",
    "images/cali project/IBICali2019-15.jpg",
    "images/cali project/IBICali2019-17.jpg",
    "images/cali project/IBICali2019-26.jpg",
    "images/cali project/IBICali2019-29.jpg",
    "images/cali project/IBICali2019-30.jpg",
    "images/cali project/IBICali2019-33.jpg",
    "images/cali project/IBICali2019-39.jpg",
    "images/cali project/IBICali2019-40.jpg",
    "images/cali project/IBICali2019-42.jpg",
    "images/cali project/IBICali2019-43.jpg",
    "images/cali project/IBICali2019-71.jpg",
    "images/cali project/IBICali2019-351.jpg",
    "images/cali project/IBICali2019-441.jpg"
];

let currentSlide = 0;
let slideInterval;

// REMOVING UNUSED GALLERY INIT - This is now handled by projects.js

document.addEventListener('DOMContentLoaded', () => {
    // ===== ELEMENTS =====
    // Sections
    const sections = document.querySelectorAll('.section');
    const leftSection = document.querySelector('.section-left');
    const rightSection = document.querySelector('.section-right');
    
    // Portrait
    const portraitContainer = document.querySelector('.portrait-container');
    const portraitImage = document.querySelector('.portrait-image');
    const aboutBtn = document.querySelector('.about-btn');
    const bwLeft = document.querySelector('.bw-left');
    const bwRight = document.querySelector('.bw-right');
    
    // Content sections
    const aboutSection = document.querySelector('.about-section');
    const serviceSection = document.querySelector('.service-section');
    const brandsSection = document.querySelector('.brands-section');
    const contactSection = document.querySelector('.contact-section');
    const closeAboutBtn = document.querySelector('.close-about');
    const closeServiceBtn = document.querySelector('.close-service');
    const closeBrandsBtn = document.querySelector('.close-brands');
    const closeContactBtn = document.querySelector('.close-contact');
    const aboutBackHomeBtn = document.querySelector('.about-back-home-btn');
    const serviceBackHomeBtn = document.querySelector('.service-back-home-btn');
    const brandsBackHomeBtn = document.querySelector('.brands-back-home-btn');
    const contactBackHomeBtn = document.querySelector('.contact-back-home-btn');
    
    // Expand buttons
    const serviceExpandBtn = document.getElementById('serviceExpandBtn');
    const brandsExpandBtn = document.getElementById('brandsExpandBtn');
    
    // Language switch
    const langBtns = document.querySelectorAll('.lang-btn');
    const langTransitionOverlay = document.querySelector('.language-transition-overlay');
    
    // Check if we're in a reduced motion environment
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check if we're on a touch device
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    // Get viewport dimensions for responsive calculations
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    
    // ===== PERFORMANCE OPTIMIZATION FUNCTIONS =====
    
    /**
     * Enhanced debounce function for improved performance
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @param {boolean} immediate - Whether to execute immediately
     * @returns {Function} - Debounced function
     */
    const debounce = (func, wait = 20, immediate = true) => {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    
    /**
     * Throttle function for high-frequency events
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in ms
     * @returns {Function} - Throttled function
     */
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };
    
    /**
     * Stop transitions during window resize to prevent jumpy behavior
     */
    const stopTransitionsOnResize = () => {
        const resizeTimer = debounce(() => {
            document.body.classList.add('resize-animation-stopper');
            
            // Update viewport dimensions
            viewportWidth = window.innerWidth;
            viewportHeight = window.innerHeight;
            
            // Update layout based on new dimensions
            updateResponsiveLayout();
            
            setTimeout(() => {
                document.body.classList.remove('resize-animation-stopper');
            }, 300);
        }, 250);
        
        window.addEventListener('resize', resizeTimer);
        
        // Also handle orientation changes for mobile
        window.addEventListener('orientationchange', () => {
            document.body.classList.add('resize-animation-stopper');
            
            // Slight delay to ensure dimensions are updated after orientation change
            setTimeout(() => {
                // Update viewport dimensions
                viewportWidth = window.innerWidth;
                viewportHeight = window.innerHeight;
                
                // Update layout based on new dimensions
                updateResponsiveLayout();
                
                setTimeout(() => {
                    document.body.classList.remove('resize-animation-stopper');
                }, 300);
            }, 200);
        });
    };
    
    /**
     * Update layout based on current viewport dimensions
     * Manage layout changes that can't be handled by CSS alone
     * NOTE: Avoid setting inline styles to prevent conflicts when toggling dev tools
     */
    const updateResponsiveLayout = () => {
        const isMobileView = viewportWidth < 768;
        
        // Use classes instead of inline styles to let CSS handle the layout
        document.body.classList.toggle('mobile-viewport', isMobileView);
        document.body.classList.toggle('desktop-viewport', !isMobileView);
        
        // Reset any stale inline styles on portrait container when switching viewports
        if (portraitContainer) {
            // Clear inline styles and let CSS handle positioning
            portraitContainer.style.cssText = '';
        }
        
        // Special case for 13-14" laptops (1200px - 1440px)
        if (viewportWidth >= 1200 && viewportWidth <= 1440) {
            document.body.classList.add('laptop-14-inch');
        } else {
            document.body.classList.remove('laptop-14-inch');
        }
        
        // Adjust for devices with notches or UI elements that intrude
        const hasDynamicViewport = CSS.supports('padding-top: env(safe-area-inset-top)');
        if (hasDynamicViewport && isTouchDevice) {
            document.documentElement.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
            document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
        }
    };
    
    /**
     * Detect device capability for animation performance
     * @returns {string} - 'high', 'medium', or 'low'
     */
    const detectDeviceCapability = () => {
        // Check if we can use requestAnimationFrame as a basic capability test
        const hasRAF = typeof window.requestAnimationFrame === 'function';
        
        // Check device memory if available (Chrome-specific)
        const deviceMemory = navigator.deviceMemory || 4; // Default to middle value if not available
        
        // Check for mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Check hardware concurrency (number of cores)
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        
        // Check for low-end devices
        const isLowEnd = (() => {
            // Test rendering performance with a quick benchmark
            const start = performance.now();
            let count = 0;
            while (performance.now() - start < 5) {
                count++;
            }
            return count < 1000; // Arbitrary threshold based on testing
        })();
        
        if (!hasRAF || deviceMemory <= 2 || (isMobile && hardwareConcurrency <= 4) || isLowEnd) {
            return 'low';
        } else if (deviceMemory <= 4 || (isMobile && hardwareConcurrency <= 6)) {
            return 'medium';
        } else {
            return 'high';
        }
    };
    
    // Determine device capability for adaptive performance
    const deviceCapability = detectDeviceCapability();
    
    /**
     * Apply performance optimizations based on device capability
     */
    const applyAdaptivePerformance = () => {
        // Add a class to body for CSS optimizations
        document.body.classList.add(`performance-${deviceCapability}`);
        
        // If low-end device, disable some effects
        if (deviceCapability === 'low') {
            // Disable parallax completely on low-end devices
            window.disableParallax = true;
            
            // Simplify animations by removing some effects
            document.documentElement.style.setProperty('--transition-ultra-slow', '1s ease');
            document.documentElement.style.setProperty('--transition-slow', '0.7s ease');
            document.documentElement.style.setProperty('--transition-medium', '0.4s ease');
            document.documentElement.style.setProperty('--transition-fast', '0.3s ease');
            
            // Reduce backdrop-filter blur amount
            document.documentElement.style.setProperty('--glass-blur', '5px');
        } else if (deviceCapability === 'medium') {
            // On medium devices, throttle parallax more aggressively
            window.parallaxIntensity = 0.5;
            
            // Slightly simplify transitions
            document.documentElement.style.setProperty('--transition-ultra-slow', '1.2s cubic-bezier(0.22, 1, 0.36, 1)');
            document.documentElement.style.setProperty('--transition-slow', '0.8s cubic-bezier(0.33, 1, 0.68, 1)');
        } else {
            // Full effects on high-end devices
            window.parallaxIntensity = 1;
        }
    };
    
    /**
     * Initialize portrait with proper image dynamics for black and white split effect
     */
    const initPortrait = () => {
        const portrait = document.querySelector('.portrait');
        
        // The most important thing: set the correct image path for the B&W versions
        if (portraitImage && portraitImage.complete && bwLeft && bwRight) {
            // Get the correct absolute path from the loaded image
            const imageSrc = portraitImage.src;
            
            // Apply it directly to both halves
            bwLeft.style.backgroundImage = `url('${imageSrc}')`;
            bwRight.style.backgroundImage = `url('${imageSrc}')`;
        }
        
        // Add click handler for desktop portrait
        if (portrait && aboutBtn) {
            portrait.addEventListener('click', () => {
                openAboutSection();
            });
        }
        
        // Add click handler for mobile portrait container (when viewed as a panel)
        if (portraitContainer) {
            portraitContainer.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    openAboutSection();
                }
            });
        }
    };
    
    /**
     * Optimize image loading with lazy loading and progressive enhancement
     */
    const optimizeImageLoading = () => {
        // All background images in sections
        const bgElements = document.querySelectorAll('.section-background, .about-background, .service-background, .brands-background, .contact-background');
        
        bgElements.forEach(bg => {
            // Extract background image URL
            const style = window.getComputedStyle(bg);
            const bgImage = style.backgroundImage;
            
            if (bgImage && bgImage !== 'none') {
                // Extract URL - handle cases with gradients
                // Match url() patterns only
                const urlMatch = bgImage.match(/url\(['"]?([^'")\s]+)['"]?\)/i);
                
                if (urlMatch && urlMatch[1]) {
                    const url = urlMatch[1];
                    
                    // Skip if it's not a real image URL (e.g., data URLs or invalid paths)
                    if (url.startsWith('data:') || url.includes('linear-gradient')) {
                        bg.classList.add('bg-loaded');
                        return;
                    }
                    
                    // Create image element to preload
                    const img = new Image();
                    
                    // Set load events
                    img.onload = () => {
                        // Add a loaded class for CSS transitions
                        bg.classList.add('bg-loaded');
                    };
                    
                    // Error handling for background images
                    img.onerror = () => {
                        // Silently fail and apply fallback
                        bg.classList.add('bg-loaded');
                        bg.style.backgroundColor = 'var(--color-secondary)';
                    };
                    
                    // Start loading with responsiveness in mind
                    if (viewportWidth <= 768 && url.includes('.')) {
                        const fileExt = url.substring(url.lastIndexOf('.'));
                        const fileBase = url.substring(0, url.lastIndexOf('.'));
                        const mobileUrl = `${fileBase}-mobile${fileExt}`;
                        
                        // Try to load mobile version first
                        const checkMobileImage = new Image();
                        checkMobileImage.onload = () => {
                            img.src = mobileUrl;
                        };
                        checkMobileImage.onerror = () => {
                            img.src = url;
                        };
                        checkMobileImage.src = mobileUrl;
                    } else {
                        img.src = url;
                    }
                } else {
                    // No URL found, just mark as loaded (gradient only)
                    bg.classList.add('bg-loaded');
                }
            }
        });
        
        // Add loading="lazy" to all images in the document
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
        
        // Use IntersectionObserver for lazyloading if available
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            // Find all images with data-src attribute
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    };
    
    /**
     * Prevent scrolling on homepage and fullscreen components
     */
    const setupScrollPrevention = () => {
        // Always add no-scroll to body to prevent homepage scrolling
        if (document.querySelector('.main-content')) {
            document.body.classList.add('no-scroll');
        }
        
        // Setup proper overflow for expanded content sections
        const expandedSections = document.querySelectorAll('.about-section, .service-section, .brands-section, .contact-section');
        
        expandedSections.forEach(section => {
            section.addEventListener('wheel', e => {
                if (!section.classList.contains('active')) {
                    e.preventDefault();
                }
            });
            
            // Also prevent touch scrolling on mobile when content isn't active
            section.addEventListener('touchmove', e => {
                if (!section.classList.contains('active')) {
                    e.preventDefault();
                }
            }, { passive: false });
        });
    };
    
    /**
     * Initialize portfolio and team items
     */
    initializePortfolioAndTeam();
    
    // Initialize contact form
    const initializeContactForm = () => {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Add loading state
                contactForm.classList.add('loading');
                
                try {
                    const response = await fetch(contactForm.action, {
                        method: 'POST',
                        body: new FormData(contactForm),
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        // Success state
                        contactForm.classList.remove('loading');
                        contactForm.classList.add('success');
                        contactForm.reset();
                        
                        // Show success message
                        const submitBtn = contactForm.querySelector('.submit-btn');
                        const originalText = submitBtn.textContent;
                        submitBtn.textContent = 'Message Sent!';
                        
                        // Reset button after 3 seconds
                        setTimeout(() => {
                            contactForm.classList.remove('success');
                            submitBtn.textContent = originalText;
                        }, 3000);
                    } else {
                        throw new Error('Form submission failed');
                    }
                } catch (error) {
                    // Error state
                    contactForm.classList.remove('loading');
                    contactForm.classList.add('error');
                    
                    // Show error message
                    const submitBtn = contactForm.querySelector('.submit-btn');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Error - Try Again';
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        contactForm.classList.remove('error');
                        submitBtn.textContent = originalText;
                    }, 3000);
                }
            });
        }
    };
    
    // ===== EVENT HANDLERS =====
    
    /**
     * Open the about section with optimized smooth transitions
     */
    const openAboutSection = () => {
        // Prevent multiple activations for stability
        if (!aboutSection || 
            aboutSection.classList.contains('transition-in-progress') || 
            document.body.classList.contains('transition-in-progress')) return;
        
        document.body.classList.add('transition-in-progress');
        
        // Start by hiding other elements
        sections.forEach(section => {
            section.classList.add('section-transitioning');
        });
        
        // Handle different layouts for mobile vs desktop
        if (viewportWidth < 768) {
            // On mobile, no need to fade out the portrait as it's part of the flow
            // Just scroll to top to ensure proper view of the content
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // On desktop, fade out portrait with a slight delay before showing about section
            if (portraitContainer) {
                portraitContainer.style.opacity = '0';
            }
        }
        
        // Show about section with optimized timing
        setTimeout(() => {
            aboutSection.classList.add('active');
            document.body.classList.add('no-scroll');
            
            // Remove transition flag after completion
            setTimeout(() => {
                document.body.classList.remove('transition-in-progress');
                
                // Update active menu item
                updateActiveMenuItem();
            }, 600);
        }, 200);
    };
    
    /**
     * Open the service section with optimized transitions
     */
    const openServiceSection = () => {
        if (!serviceSection || 
            serviceSection.classList.contains('transition-in-progress') || 
            document.body.classList.contains('transition-in-progress')) return;
        
        document.body.classList.add('transition-in-progress');
        
        sections.forEach(section => {
            section.classList.add('section-transitioning');
        });
        
        // Handle different layouts for mobile vs desktop
        if (viewportWidth < 768) {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        } else {
            if (portraitContainer) {
                portraitContainer.style.opacity = '0';
            }
        }
        
        setTimeout(() => {
            serviceSection.classList.add('active');
            document.body.classList.add('no-scroll');
            
            setTimeout(() => {
                document.body.classList.remove('transition-in-progress');
                updateActiveMenuItem();
            }, 600);
        }, 200);
    };
    
    /**
     * Open the brands section with optimized transitions
     */
    const openBrandsSection = () => {
        if (!brandsSection || 
            brandsSection.classList.contains('transition-in-progress') || 
            document.body.classList.contains('transition-in-progress')) return;
        
        document.body.classList.add('transition-in-progress');
        
        sections.forEach(section => {
            section.classList.add('section-transitioning');
        });
        
        // Handle different layouts for mobile vs desktop
        if (viewportWidth < 768) {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        } else {
            if (portraitContainer) {
                portraitContainer.style.opacity = '0';
            }
        }
        
        setTimeout(() => {
            brandsSection.classList.add('active');
            document.body.classList.add('no-scroll');
            
            setTimeout(() => {
                document.body.classList.remove('transition-in-progress');
                updateActiveMenuItem();
            }, 600);
        }, 200);
    };
    
    /**
     * Open the contact section with optimized transitions
     */
    const openContactSection = () => {
        if (!contactSection || 
            contactSection.classList.contains('transition-in-progress') || 
            document.body.classList.contains('transition-in-progress')) return;
        
        document.body.classList.add('transition-in-progress');
        
        sections.forEach(section => {
            section.classList.add('section-transitioning');
        });
        
        // Handle different layouts for mobile vs desktop
        if (viewportWidth < 768) {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        } else {
            if (portraitContainer) {
                portraitContainer.style.opacity = '0';
            }
        }
        
        setTimeout(() => {
            contactSection.classList.add('active');
            document.body.classList.add('no-scroll');
            
            setTimeout(() => {
                document.body.classList.remove('transition-in-progress');
                updateActiveMenuItem();
            }, 600);
        }, 200);
    };
    
    /**
     * Close any expanded content and return to home with optimized transitions
     */
    const closeExpandedContent = () => {
        // Prevent multiple transitions
        if (document.body.classList.contains('transition-in-progress')) return;
        document.body.classList.add('transition-in-progress');
        
        // Handle all expanded sections with consistent animations
        const activeSections = document.querySelectorAll('.about-section.active, .service-section.active, .brands-section.active, .contact-section.active');
        
        if (activeSections.length > 0) {
            activeSections.forEach(section => {
                const content = section.querySelector('.about-content, .service-content, .brands-content, .contact-content');
                
                // Stop videos in brands section when closing
                if (section.classList.contains('brands-section')) {
                    // Find and stop all videos in the brands section
                    const videos = section.querySelectorAll('video, iframe');
                    videos.forEach(video => {
                        if (video.tagName === 'VIDEO') {
                            // HTML5 video element
                            video.pause();
                            video.currentTime = 0;
                        } else if (video.tagName === 'IFRAME') {
                            // iframe videos (YouTube, Vimeo, etc.)
                            // We need to reload the iframe to stop the video
                            const videoSrc = video.src;
                            video.src = videoSrc;
                        }
                    });
                }
                
                // First fade out the content with nice easing
                if (content) {
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(1.875rem)'; // 30px to rem
                }
                
                // Then fade out the background
                setTimeout(() => {
                    section.style.opacity = '0';
                    
                    // Finally remove active class once faded
                    setTimeout(() => {
                        section.classList.remove('active');
                        section.style.opacity = ''; // Reset for next opening
                        
                        if (content) {
                            content.style.opacity = '';
                            content.style.transform = '';
                        }
                    }, 300);
                }, 200);
            });
        }
        
        // Reset other elements
        sections.forEach(section => {
            section.classList.remove('section-transitioning');
        });
        
        // Restore portrait with enhanced transitions
        setTimeout(() => {
            // Handle different layouts for mobile vs desktop
            if (viewportWidth >= 768) {
                if (portraitContainer) {
                    portraitContainer.style.opacity = '1';
                }
            }
            
            // Reset transition flag after completion
            setTimeout(() => {
                document.body.classList.remove('transition-in-progress');
                updateActiveMenuItem();
            }, 600);
        }, 300);
    };
    
    /**
     * Switch between languages with visual feedback
     * @param {Event} e - The click event
     */
    const switchLanguage = (event) => {
        // Get the clicked button
        const button = event.currentTarget;
        
        // Skip if already active
        if (button.classList.contains('active')) return;
        
        // Update active state of language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Get the new language
        const newLang = button.dataset.lang;

        // Apply translations without transition animation
        applyLanguage(newLang, false);
    };
    
    /**
     * Navigate to specific section based on menu item
     * @param {string} section - Section identifier
     */
    const navigateToSection = (section) => {
        // Close the menu
        const logo = document.querySelector('.logo-container');
        if (logo && logo.classList.contains('active')) {
            logo.click();
        }
        
        // Navigate to the specified section
        switch (section) {
            case 'person':
                openAboutSection();
                break;
            case 'service':
                openServiceSection();
                break;
            case 'brands':
                openBrandsSection();
                break;
            case 'contact':
                openContactSection();
                break;
            case 'home':
            default:
                closeExpandedContent();
                break;
        }
    };

    /**
     * Highlight active menu based on currently visible section
     */
    const updateActiveMenuItem = () => {
        const menuItems = document.querySelectorAll('.off-canvas-menu-item');
        
        // Reset all active states
        menuItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Set active based on current visible section
        if (aboutSection && aboutSection.classList.contains('active')) {
            document.querySelector('[data-section="person"]')?.classList.add('active');
        } else if (serviceSection && serviceSection.classList.contains('active')) {
            document.querySelector('[data-section="service"]')?.classList.add('active');
        } else if (brandsSection && brandsSection.classList.contains('active')) {
            document.querySelector('[data-section="brands"]')?.classList.add('active');
        } else if (contactSection && contactSection.classList.contains('active')) {
            document.querySelector('[data-section="contact"]')?.classList.add('active');
        } else {
            document.querySelector('[data-section="home"]')?.classList.add('active');
        }
    };
    
    /**
     * Setup section navigation from menu items
     */
    const setupSectionNavigation = () => {
        const sectionLinks = document.querySelectorAll('.off-canvas-menu-item[data-section]');
        
        sectionLinks.forEach(link => {
            link.addEventListener('click', () => {
                const section = link.getAttribute('data-section');
                navigateToSection(section);
            });
        });
    };

    /**
     * Enable subtle parallax effects that scale based on device capability
     */
    const setupParallaxEffects = () => {
        // Skip on reduced motion settings or low-end devices or if explicitly disabled
        if (prefersReducedMotion || deviceCapability === 'low' || isTouchDevice || window.disableParallax) return;
        
        // Determine parallax intensity based on device capability
        const intensityFactor = window.parallaxIntensity || (deviceCapability === 'high' ? 1 : 0.5);
        
        const handleMouseMove = throttle((e) => {
            // For better performance, use pointer position relative to viewport size
            // instead of absolute pixels
            const { clientX, clientY } = e;
            const xRatio = clientX / viewportWidth;
            const yRatio = clientY / viewportHeight;
            
            // Calculate offsets using ratios for more consistent behavior across screen sizes
            const xOffset = (xRatio - 0.5) * 15 * intensityFactor;
            const yOffset = (yRatio - 0.5) * 15 * intensityFactor;
            
            // Apply parallax to section backgrounds with better performance
            requestAnimationFrame(() => {
                document.querySelectorAll('.section-background').forEach(bg => {
                    bg.style.transform = `translate(${xOffset * 0.15}px, ${yOffset * 0.15}px) scale(1.05)`;
                });
                
                // Apply parallax to active section backgrounds
                const activeBgs = document.querySelectorAll('.about-section.active .about-background, .service-section.active .service-background, .brands-section.active .brands-background, .contact-section.active .contact-background');
                activeBgs.forEach(bg => {
                    bg.style.transform = `translate(${xOffset * 0.08}px, ${yOffset * 0.08}px) scale(1.02)`;
                });
            });
        }, 16); // approximately 60fps
        
        document.addEventListener('mousemove', handleMouseMove);
    };
    
    /**
     * Setup touch-friendly interactions for mobile devices
     */
    const setupTouchInteractions = () => {
        // Skip if not a touch device
        if (!isTouchDevice) return;
        
        // Make portrait touch-friendly
        if (portraitContainer) {
            // For touch devices, make the about button always visible but subtle
            const aboutButton = portraitContainer.querySelector('.about-btn');
            if (aboutButton) {
                aboutButton.style.opacity = '0.9';
                aboutButton.style.transform = 'translate(-50%, -50%) scale(0.9)';
            }
            
            // Add touch event handling
            portraitContainer.addEventListener('touchstart', () => {
                portraitContainer.classList.add('touch-active');
            }, { passive: true });
            
            document.addEventListener('touchstart', (e) => {
                if (!portraitContainer.contains(e.target)) {
                    portraitContainer.classList.remove('touch-active');
                }
            }, { passive: true });
        }
        
        // Improve section hover states on touch devices
        sections.forEach(section => {
            section.addEventListener('touchstart', () => {
                sections.forEach(s => s.classList.remove('touch-active'));
                section.classList.add('touch-active');
            }, { passive: true });
        });
        
        // Add swipe detection for navigation on small screens
        if (viewportWidth < 768) {
            let touchStartX = 0;
            let touchEndX = 0;
            
            document.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            document.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
            
            const handleSwipe = () => {
                // Minimum swipe distance required (adjusted for screen width)
                const minSwipeDistance = viewportWidth * 0.2;
                
                // Skip handling if we're in a transition
                if (document.body.classList.contains('transition-in-progress')) return;
                
                // Left swipe
                if (touchEndX < touchStartX - minSwipeDistance) {
                    // Check which section is active and navigate accordingly
                    if (aboutSection?.classList.contains('active')) {
                        openServiceSection();
                    } else if (serviceSection?.classList.contains('active')) {
                        openBrandsSection();
                    } else if (brandsSection?.classList.contains('active')) {
                        openContactSection();
                    }
                }
                // Right swipe
                else if (touchEndX > touchStartX + minSwipeDistance) {
                    if (contactSection?.classList.contains('active')) {
                        openBrandsSection();
                    } else if (brandsSection?.classList.contains('active')) {
                        openServiceSection();
                    } else if (serviceSection?.classList.contains('active')) {
                        openAboutSection();
                    } else if (aboutSection?.classList.contains('active')) {
                        closeExpandedContent();
                    }
                }
            };
        }
    };
    
    /**
     * Add intersection observer for animation performance
     */
    const setupIntersectionObserver = () => {
        // Only run animations for elements in viewport
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-viewport');
                    } else {
                        // Only remove class if it's far out of viewport
                        if (entry.intersectionRatio < 0.1) {
                            entry.target.classList.remove('in-viewport');
                        }
                    }
                });
            }, { threshold: [0.1, 0.5] });
            
            // Observe all animated elements
            document.querySelectorAll('.section, .portrait-container, .about-section, .service-section, .brands-section, .contact-section')
                .forEach(el => observer.observe(el));
            
            // Additional observer for portfolio and team items to animate them
            // with staggered effects when they come into view
            const contentObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add animate class with delay based on index
                        const index = parseInt(entry.target.style.getPropertyValue('--index') || 0);
                        entry.target.style.transitionDelay = `${index * 0.1}s`;
                        entry.target.classList.add('animate-in');
                        
                        // Unobserve after animation is triggered
                        contentObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            // Observe portfolio and team items
            document.querySelectorAll('.portfolio-item, .team-member, .brand-item, .contact-item')
                .forEach(el => contentObserver.observe(el));
        }
    };

    // ===== EVENT LISTENERS =====
    
    // Set up event listeners for opening content sections
    if (aboutBtn) {
        aboutBtn.addEventListener('click', openAboutSection);
    }
    
    if (serviceExpandBtn) {
        serviceExpandBtn.addEventListener('click', openServiceSection);
    }
    
    if (brandsExpandBtn) {
        brandsExpandBtn.addEventListener('click', openBrandsSection);
    }
    
    // Make section panels clickable on mobile
    if (leftSection) {
        leftSection.addEventListener('click', (e) => {
            // Only trigger full panel click on mobile view
            if (window.innerWidth < 768 && !e.target.classList.contains('expand-btn')) {
                openServiceSection();
            }
        });
    }
    
    if (rightSection) {
        rightSection.addEventListener('click', (e) => {
            // Only trigger full panel click on mobile view
            if (window.innerWidth < 768 && !e.target.classList.contains('expand-btn')) {
                openBrandsSection();
            }
        });
    }
    
    // Make portrait container clickable on mobile
    if (portraitContainer) {
        portraitContainer.addEventListener('click', (e) => {
            // Only trigger full panel click on mobile view
            if (window.innerWidth < 768 && !e.target.classList.contains('about-btn')) {
                openAboutSection();
            }
        });
    }
    
    // Set up event listeners for closing content sections
    if (closeAboutBtn) {
        closeAboutBtn.addEventListener('click', closeExpandedContent);
    }
    
    if (closeServiceBtn) {
        closeServiceBtn.addEventListener('click', closeExpandedContent);
    }
    
    if (closeBrandsBtn) {
        closeBrandsBtn.addEventListener('click', () => {
            // Stop all videos in brands section before closing
            const brandsSection = document.querySelector('.brands-section');
            if (brandsSection) {
                const videos = brandsSection.querySelectorAll('video, iframe');
                videos.forEach(video => {
                    if (video.tagName === 'VIDEO') {
                        // HTML5 video element
                        video.pause();
                        video.currentTime = 0;
                    } else if (video.tagName === 'IFRAME') {
                        // iframe videos (YouTube, Vimeo, etc.)
                        // We need to reload the iframe to stop the video
                        const videoSrc = video.src;
                        video.src = videoSrc;
                    }
                });
            }
            
            closeExpandedContent();
        });
    }
    
    if (closeContactBtn) {
        closeContactBtn.addEventListener('click', closeExpandedContent);
    }
    
    // Set up return to home buttons
    if (aboutBackHomeBtn) {
        aboutBackHomeBtn.addEventListener('click', closeExpandedContent);
    }
    
    if (serviceBackHomeBtn) {
        serviceBackHomeBtn.addEventListener('click', closeExpandedContent);
    }
    
    if (brandsBackHomeBtn) {
        brandsBackHomeBtn.addEventListener('click', () => {
            // Stop all videos in brands section before closing
            const brandsSection = document.querySelector('.brands-section');
            if (brandsSection) {
                const videos = brandsSection.querySelectorAll('video, iframe');
                videos.forEach(video => {
                    if (video.tagName === 'VIDEO') {
                        // HTML5 video element
                        video.pause();
                        video.currentTime = 0;
                    } else if (video.tagName === 'IFRAME') {
                        // iframe videos (YouTube, Vimeo, etc.)
                        // We need to reload the iframe to stop the video
                        const videoSrc = video.src;
                        video.src = videoSrc;
                    }
                });
            }
            
            closeExpandedContent();
        });
    }
    
    if (contactBackHomeBtn) {
        contactBackHomeBtn.addEventListener('click', closeExpandedContent);
    }
    
    // Language switcher
    langBtns.forEach(btn => {
        btn.addEventListener('click', switchLanguage);
    });
    
    // Close expanded content when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (aboutSection?.classList.contains('active') || 
                serviceSection?.classList.contains('active') ||
                brandsSection?.classList.contains('active') || 
                contactSection?.classList.contains('active')) {
                closeExpandedContent();
            }
        }
    });
    
    // Handle browser back button
    window.addEventListener('popstate', (e) => {
        // If any section is open, close it instead of navigating away
        if (aboutSection?.classList.contains('active') || 
            serviceSection?.classList.contains('active') ||
            brandsSection?.classList.contains('active') || 
            contactSection?.classList.contains('active')) {
            closeExpandedContent();
            // Prevent default navigation
            history.pushState(null, '', window.location.pathname);
            e.preventDefault();
        }
    });
    
    // Special handling for Firefox which doesn't support backdrop-filter well
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
        document.documentElement.classList.add('firefox');
    }
    
    // Special handling for Safari which has specific backdrop-filter issues
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
        document.documentElement.classList.add('safari');
    }
    
    /**
     * Handle adaptive layout for various device screen sizes
     */
    const setupAdaptiveLayout = () => {
        // Check for notch presence
        const hasNotch = (window.screen && (window.screen.height >= 812 || window.screen.width >= 812)) ||
                         ('CSS' in window && CSS.supports('padding-top: env(safe-area-inset-top)'));
        
        if (hasNotch) {
            document.body.classList.add('has-notch');
        }

        // For tablets and laptops, optimize space utilization
        if (viewportWidth >= 768 && viewportWidth <= 1200) {
            // This will apply specific adjustments for mid-size screens
            document.body.classList.add('mid-size-screen');
        }

        // Handle orientation
        if (viewportWidth < viewportHeight) {
            document.body.classList.add('portrait-orientation');
            document.body.classList.remove('landscape-orientation');
        } else {
            document.body.classList.add('landscape-orientation');
            document.body.classList.remove('portrait-orientation');
        }
    };
    
    // ===== INITIALIZATION =====
    
    // Expose functions that need to be accessible to other scripts
    window.openAboutSection = openAboutSection;
    window.openServiceSection = openServiceSection;
    window.openBrandsSection = openBrandsSection;
    window.openContactSection = openContactSection;
    window.closeExpandedContent = closeExpandedContent;
    window.navigateToSection = navigateToSection;
    window.updateActiveMenuItem = updateActiveMenuItem;
    
    /**
     * Initialize components in performance-optimized sequence
     */
    const initializeWebsite = () => {
        // Apply performance optimizations first
        applyAdaptivePerformance();
        
        // Set up layout management
        setupAdaptiveLayout();
        
        // Critical path initialization - these must happen immediately
        initPortrait();
        setupScrollPrevention();
        
        // Initialize content
        initializePortfolioAndTeam();
        initializeContactForm();
        
        // Setup navigation
        setupSectionNavigation();
        
        // Apply initial responsive layout adjustments
        updateResponsiveLayout();
        
        // Secondary initialization - slight delay for better initial load performance
        setTimeout(() => {
            optimizeImageLoading();
            setupTouchInteractions();
            setupIntersectionObserver();
            
            // Only add parallax on non-touch devices and if not in reduced motion mode
            if (!isTouchDevice && !prefersReducedMotion) {
                setupParallaxEffects();
            }
            
            // Set up utilities
            stopTransitionsOnResize();
            
            // Update any responsive elements again after everything is loaded
            setTimeout(() => {
                updateResponsiveLayout();
                
                // Re-initialize portrait in case it didn't work the first time
                initPortrait();
                
                document.body.classList.add('fully-initialized');
            }, 1000);
        }, 100);
    };
    
    // Execute initialization sequence
    initializeWebsite();

    // Mobile logo click handler (handles both button and direct logo click)
    const mobileLogoBtn = document.querySelector('.mobile-logo-btn');
    const mobileLogo = document.querySelector('.mobile-logo');
    
    const handleMobileLogoClick = () => {
        const logo = document.querySelector('.logo-container');
        if (logo) {
            logo.click(); // Trigger the same click event as the desktop logo
        }
    };
    
    if (mobileLogoBtn) {
        mobileLogoBtn.addEventListener('click', handleMobileLogoClick);
    } else if (mobileLogo) {
        // Fallback for backward compatibility
        mobileLogo.addEventListener('click', handleMobileLogoClick);
    }
});

/**
 * Handle off-canvas menu interactions
 */
document.addEventListener('DOMContentLoaded', () => {
    // Remove duplicate menu handling code since it's now in navigation.js
    // Only keep the swipe to close functionality for mobile
    const offCanvasNav = document.getElementById('offCanvasNav');
    
    // Handle swipe to close menu on mobile
    if ('ontouchstart' in window) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        offCanvasNav.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        offCanvasNav.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            
            // Detect right swipe to close menu
            if (touchStartX < touchEndX - 50) { // 50px threshold
                if (offCanvasNav.classList.contains('active')) {
                    window.navigationSystem.toggleNavigation();
                }
            }
        }, { passive: true });
    }
    
    // Setup menu focus trap for accessibility
    if (offCanvasNav) {
        const focusableElements = offCanvasNav.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        offCanvasNav.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // If shift key is pressed and focusing the first element, move to the last element
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
                // If no shift key and focusing the last element, move to the first element
                else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
});

// Adaptive Carousel for Project Detail Popup
document.addEventListener('DOMContentLoaded', function() {
    // Project detail popup elements
    const projectDetailPopup = document.querySelector('.project-detail-popup');
    const closeProjectDetailBtn = document.querySelector('.close-project-detail');
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');
    
    // Carousel elements
    const carouselMain = document.querySelector('.carousel-main');
    const carouselMainImage = document.querySelector('.carousel-main-image');
    const carouselPrevBtn = document.querySelector('.carousel-prev-btn');
    const carouselNextBtn = document.querySelector('.carousel-next-btn');
    const carouselIndicators = document.querySelector('.carousel-indicators');
    const imageList = document.querySelector('.carousel-image-list')?.querySelectorAll('img');
    
    // Exit early if required elements don't exist
    if (!projectDetailPopup || !carouselMain) {
        return;
    }
    
    let currentIndex = 0;
    let images = [];
    
    // Create indicator dots for the carousel
    function createIndicators(count) {
        if (!carouselIndicators) return;
        carouselIndicators.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            if (i === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                updateCarouselImage(i);
            });
            
            indicator.setAttribute('data-index', i);
            carouselIndicators.appendChild(indicator);
        }
    }
    
    // Update the carousel image and state
    function updateCarouselImage(index) {
        if (!images.length || !carouselMainImage) return;
        
        // Update current index
        currentIndex = index;
        
        // Fade out current image
        carouselMainImage.style.opacity = '0';
        
        // Set a timeout to change the image and fade it back in
        setTimeout(() => {
            // Update image source
            carouselMainImage.src = images[currentIndex];
            
            // Create a new image element to preload and get dimensions
            const tempImg = new Image();
            tempImg.src = images[currentIndex];
            
            // When image loads, adjust the carousel container if needed
            tempImg.onload = function() {
                // Reset carousel main height to auto to adapt to new image
                if (carouselMain) carouselMain.style.height = 'auto';
                
                // Fade in the new image
                if (carouselMainImage) carouselMainImage.style.opacity = '1';
                
                // Update indicators
                if (carouselIndicators) {
                    const indicators = carouselIndicators.querySelectorAll('.carousel-indicator');
                    indicators.forEach((indicator, i) => {
                        indicator.classList.toggle('active', i === currentIndex);
                    });
                }
                
                // Update button states
                if (carouselPrevBtn) carouselPrevBtn.disabled = currentIndex === 0;
                if (carouselNextBtn) carouselNextBtn.disabled = currentIndex === images.length - 1;
            };
        }, 300);
    }
    
    // Open project detail popup
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get images from the carousel-image-list
            images = [];
            
            if (imageList && imageList.length) {
                // Convert NodeList to Array and sort by data-index
                const imagesArray = Array.from(imageList);
                imagesArray.sort((a, b) => {
                    return parseInt(a.getAttribute('data-index')) - parseInt(b.getAttribute('data-index'));
                });
                
                // Get all image sources
                images = imagesArray.map(img => img.src);
                
                // Create indicators
                createIndicators(images.length);
                
                // Reset to first image
                currentIndex = 0;
                updateCarouselImage(currentIndex);
            }
            
            // Show popup with animation
            if (projectDetailPopup) {
                projectDetailPopup.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });
    
    // Close project detail popup
    if (closeProjectDetailBtn) {
        closeProjectDetailBtn.addEventListener('click', function() {
            projectDetailPopup.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Previous button click
    if (carouselPrevBtn) {
        carouselPrevBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                updateCarouselImage(currentIndex - 1);
            }
        });
    }
    
    // Next button click
    if (carouselNextBtn) {
        carouselNextBtn.addEventListener('click', function() {
            if (currentIndex < images.length - 1) {
                updateCarouselImage(currentIndex + 1);
            }
        });
    }
    
    // Handle swipe gestures on mobile
    if (carouselMain) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        carouselMain.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carouselMain.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchEndX < touchStartX - swipeThreshold) {
                if (currentIndex < images.length - 1) {
                    updateCarouselImage(currentIndex + 1);
                }
            } else if (touchEndX > touchStartX + swipeThreshold) {
                if (currentIndex > 0) {
                    updateCarouselImage(currentIndex - 1);
                }
            }
        }
    }
    
    // Close popup when clicking outside content
    if (projectDetailPopup) {
        projectDetailPopup.addEventListener('click', function(e) {
            if (e.target === projectDetailPopup || e.target === document.querySelector('.project-popup-background')) {
                projectDetailPopup.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!projectDetailPopup || !projectDetailPopup.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            updateCarouselImage(currentIndex - 1);
        } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
            updateCarouselImage(currentIndex + 1);
        } else if (e.key === 'Escape') {
            projectDetailPopup.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
});

// Ensure projects section is visible and properly styled
document.addEventListener('DOMContentLoaded', function() {
    // Make sure projects are visible when service section is opened
    const serviceExpandBtn = document.getElementById('serviceExpandBtn');
    const projectsSection = document.querySelector('.projects-section');
    
    if (serviceExpandBtn && projectsSection) {
        serviceExpandBtn.addEventListener('click', function() {
            // Add a slight delay to ensure the section is opened first
            setTimeout(() => {
                // Ensure the projects section is visible
                projectsSection.style.display = 'block';
                
                // Add animation class to make it more noticeable
                projectsSection.classList.add('fade-in-animation');
                
                // Scroll to projects section if needed
                const serviceSection = document.querySelector('.service-section');
                if (serviceSection && serviceSection.classList.contains('active')) {
                    const projectsOffset = projectsSection.offsetTop;
                    const serviceContent = document.querySelector('.service-content');
                    if (serviceContent) {
                        setTimeout(() => {
                            serviceContent.scrollTo({
                                top: projectsOffset - 100,
                                behavior: 'smooth'
                            });
                        }, 1000); // Delay scroll to ensure content is rendered
                    }
                }
            }, 600);
        });
    }
    
    // Check if there are images in the project folders and ensure they're properly loaded
    const projectImages = document.querySelectorAll('.project-cover-image');
    projectImages.forEach(img => {
        img.addEventListener('error', function() {
            // If image fails to load, set a fallback
            this.src = 'images/ca project/IBICali2019-71.jpg';
            console.log('Image failed to load, fallback applied');
        });
        
        // Force reload if needed
        if (img.complete && img.naturalWidth === 0) {
            img.src = img.src;
        }
    });
});

// Project description popup handlers
document.addEventListener('DOMContentLoaded', function() {
    // Get all project description popups
    const projectPopups = {
        california: document.querySelector('.project-description-popup:not(.restaurant-description):not(.ibiza-description):not(.spain-description):not(.family-mansion-description):not(.algarve-villa-description)'),
        restaurant: document.querySelector('.restaurant-description'),
        ibiza: document.querySelector('.ibiza-description'),
        spain: document.querySelector('.spain-description'),
        familyMansion: document.querySelector('.family-mansion-description'),
        algarveVilla: document.querySelector('.algarve-villa-description')
    };
    
    // Project buttons - Read About
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        const readBtn = card.querySelector('.project-btn:not(.gallery-btn)');
        if (readBtn) {
            readBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Determine which popup to open based on index
                let targetPopup = null;
                switch(index) {
                    case 0: targetPopup = projectPopups.california; break;
                    case 1: targetPopup = projectPopups.restaurant; break;
                    case 2: targetPopup = projectPopups.ibiza; break;
                    case 3: targetPopup = projectPopups.spain; break;
                    case 4: targetPopup = projectPopups.familyMansion; break;
                    case 5: targetPopup = projectPopups.algarveVilla; break;
                }
                
                if (targetPopup) {
                    targetPopup.classList.add('active');
                    document.body.classList.add('no-scroll');
                }
            });
        }
    });
    
    // Close project description popups
    document.querySelectorAll('.close-project-description').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.project-description-popup').forEach(popup => {
                popup.classList.remove('active');
            });
            document.body.classList.remove('no-scroll');
        });
    });
});
