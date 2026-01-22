/**
 * Core JavaScript for Luxury Interior Design Website
 * High-performance interactions with mobile-first approach
 * Uses advanced animation techniques and performance optimizations
 */

// Add debugging function at the top of the file
function debugLog(message, data) {
    const DEBUG = true; // Set to false to disable logs in production
    if (DEBUG) {
        if (data) {
            console.log(`[GALLERY DEBUG] ${message}`, data);
        } else {
            console.log(`[GALLERY DEBUG] ${message}`);
        }
    }
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
     */
    const updateResponsiveLayout = () => {
        // Mobile layout (portrait orientation)
        if (viewportWidth < 768) {
            // For very small screens in portrait mode
            if (viewportHeight > viewportWidth) {
                // If portrait container exists, move it to fit better in mobile layout
                if (portraitContainer) {
                    portraitContainer.style.position = 'relative';
                    portraitContainer.style.transform = 'none';
                    portraitContainer.style.top = 'auto';
                    portraitContainer.style.left = 'auto';
                }
            } else {
                // Landscape mobile - revert to default positioning
                if (portraitContainer) {
                    portraitContainer.style.position = 'absolute';
                    portraitContainer.style.transform = 'translate(-50%, -50%)';
                    portraitContainer.style.top = '50%';
                    portraitContainer.style.left = '50%';
                }
            }
        } 
        // Tablet landscape and desktop layout
        else {
            if (portraitContainer) {
                portraitContainer.style.position = 'absolute';
                portraitContainer.style.transform = 'translate(-50%, -50%)';
                portraitContainer.style.top = '50%';
                portraitContainer.style.left = '50%';
            }
            
            // Special case for 13-14" laptops (1200px - 1440px)
            if (viewportWidth >= 1200 && viewportWidth <= 1440) {
                document.body.classList.add('laptop-14-inch');
            } else {
                document.body.classList.remove('laptop-14-inch');
            }
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
            
            console.log("Portrait initialized with image:", imageSrc);
        }
        
        // Add click handler for desktop portrait
        if (portrait && aboutBtn) {
            portrait.addEventListener('click', () => {
                console.log("Portrait clicked");
                openAboutSection();
            });
        }
        
        // Add click handler for mobile portrait container (when viewed as a panel)
        if (portraitContainer) {
            portraitContainer.addEventListener('click', () => {
                console.log("Portrait container clicked");
                // Only trigger on mobile view
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
                // Extract URL
                const url = bgImage.replace(/url\(['"]?([^'"]+)['"]?\)/gi, '$1');
                
                // Create image element to preload
                const img = new Image();
                
                // Set load events
                img.onload = () => {
                    // Add a loaded class for CSS transitions
                    bg.classList.add('bg-loaded');
                };
                
                // Error handling for background images
                img.onerror = () => {
                    console.error(`Error loading background image: ${url}`);
                    // Apply fallback background
                    bg.style.backgroundColor = 'var(--color-secondary)';
                };
                
                // Start loading with responsiveness in mind
                // Use smaller images for mobile if available
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
                        img.src = url; // Fallback to original image
                    };
                    checkMobileImage.src = mobileUrl;
                } else {
                    img.src = url;
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

    // Mobile logo click handler
    const mobileLogo = document.querySelector('.mobile-logo');
    if (mobileLogo) {
        mobileLogo.addEventListener('click', () => {
            const logo = document.querySelector('.logo-container');
            if (logo) {
                logo.click(); // Trigger the same click event as the desktop logo
            }
        });
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
    
    let currentIndex = 0;
    let images = [];
    
    // Create indicator dots for the carousel
    function createIndicators(count) {
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
        if (!images.length) return;
        
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
                const imgWidth = this.width;
                const imgHeight = this.height;
                const ratio = imgWidth / imgHeight;
                
                // Reset carousel main height to auto to adapt to new image
                carouselMain.style.height = 'auto';
                
                // Fade in the new image
                carouselMainImage.style.opacity = '1';
                
                // Update indicators
                const indicators = carouselIndicators.querySelectorAll('.carousel-indicator');
                indicators.forEach((indicator, i) => {
                    indicator.classList.toggle('active', i === currentIndex);
                });
                
                // Update button states
                carouselPrevBtn.disabled = currentIndex === 0;
                carouselNextBtn.disabled = currentIndex === images.length - 1;
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
            projectDetailPopup.classList.add('active');
            document.body.classList.add('no-scroll');
            
            console.log(`Opened project popup with ${images.length} images`);
        });
    });
    
    // Close project detail popup
    closeProjectDetailBtn.addEventListener('click', function() {
        projectDetailPopup.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
    
    // Previous button click
    carouselPrevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            updateCarouselImage(currentIndex - 1);
        }
    });
    
    // Next button click
    carouselNextBtn.addEventListener('click', function() {
        if (currentIndex < images.length - 1) {
            updateCarouselImage(currentIndex + 1);
        }
    });
    
    // Handle swipe gestures on mobile
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
        const swipeThreshold = 50; // minimum distance for swipe
        
        // Left swipe (next image)
        if (touchEndX < touchStartX - swipeThreshold) {
            if (currentIndex < images.length - 1) {
                updateCarouselImage(currentIndex + 1);
            }
        }
        // Right swipe (previous image)
        else if (touchEndX > touchStartX + swipeThreshold) {
            if (currentIndex > 0) {
                updateCarouselImage(currentIndex - 1);
            }
        }
    }
    
    // Close popup when clicking outside content
    projectDetailPopup.addEventListener('click', function(e) {
        if (e.target === projectDetailPopup || e.target === document.querySelector('.project-popup-background')) {
            projectDetailPopup.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!projectDetailPopup.classList.contains('active')) return;
        
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

// Fix for project cards not showing
document.addEventListener('DOMContentLoaded', function() {
    // For immediate debugging
    console.log("DOM loaded, checking projects section");
    
    // Force project cards to be visible
    const projectsSection = document.querySelector('.projects-section');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Check if elements exist
    if (projectsSection) {
        console.log("Projects section found");
        projectsSection.style.display = 'block';
        projectsSection.style.opacity = '1';
        
        // Add a border to make it visible
        projectsSection.style.border = '2px solid #a68a5b';
        projectsSection.style.padding = '20px';
        projectsSection.style.margin = '30px 0';
        projectsSection.style.borderRadius = '8px';
        projectsSection.style.background = 'rgba(0, 0, 0, 0.2)';
    } else {
        console.log("Projects section NOT found");
    }
    
    if (projectCards.length > 0) {
        console.log(`Found ${projectCards.length} project cards`);
        projectCards.forEach((card, index) => {
            console.log(`Setting styles for card ${index}`);
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.minHeight = '250px';
            card.style.border = '2px solid rgba(166, 138, 91, 0.8)';
            
            // Force image to load and check for errors
            const img = card.querySelector('.project-cover-image');
            if (img) {
                console.log(`Card ${index} has image: ${img.src}`);
                // Force reload
                const originalSrc = img.src;
                img.onerror = function() {
                    console.log(`Image failed to load: ${originalSrc}`);
                    // Fallback to another image
                    this.src = 'images/the service (2).jpg';
                };
                // Trigger reload
                img.src = originalSrc;
            } else {
                console.log(`Card ${index} has NO image`);
            }

            // Add click handler for project card
            card.addEventListener('click', () => {
                // Add smooth transition effect
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                    // Open project details popup
                    openProjectDetail(project.id);
                }, 150);
            });
        });
    } else {
        console.log("NO project cards found");
    }
    
    // Make sure the service section shows the projects
    const serviceExpandBtn = document.getElementById('serviceExpandBtn');
    if (serviceExpandBtn) {
        console.log("Service expand button found, adding enhanced click handler");
        
        // Enhanced click handler that explicitly shows the projects
        serviceExpandBtn.addEventListener('click', function() {
            console.log("Service expand button clicked");
            
            setTimeout(() => {
                const serviceSection = document.querySelector('.service-section');
                if (serviceSection && serviceSection.classList.contains('active')) {
                    console.log("Service section is active, forcing projects to show");
                    
                    if (projectsSection) {
                        projectsSection.style.display = 'block';
                        projectsSection.style.opacity = '1';
                        projectsSection.classList.add('fade-in-animation');
                        
                        // Force all project cards to be visible
                        projectCards.forEach(card => {
                            card.style.display = 'block';
                            card.style.opacity = '1';
                            card.style.visibility = 'visible';
                        });
                        
                        // Scroll to make it visible
                        const serviceContent = document.querySelector('.service-content');
                        if (serviceContent) {
                            setTimeout(() => {
                                const projectsOffset = projectsSection.offsetTop;
                                serviceContent.scrollTo({
                                    top: projectsOffset - 100,
                                    behavior: 'smooth'
                                });
                                console.log(`Scrolled to projects at offset ${projectsOffset}`);
                            }, 800);
                        }
                    }
                }
            }, 500);
        });
    } else {
        console.log("Service expand button NOT found");
    }
    
    // Also check when document is fully loaded to catch any dynamic changes
    window.addEventListener('load', function() {
        console.log("Window fully loaded, rechecking projects visibility");
        if (projectsSection) {
            projectsSection.style.display = 'block';
            projectsSection.style.opacity = '1';
        }
        if (projectCards.length > 0) {
            projectCards.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
            });
        }
    });
});

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const cover = document.createElement('div');
    cover.className = 'project-cover';
    
    const img = document.createElement('img');
    img.className = 'project-cover-image';
    img.loading = 'lazy';
    img.src = project.image;
    img.alt = project.title;
    
    const info = document.createElement('div');
    info.className = 'project-info';
    
    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title;
    
    const location = document.createElement('p');
    location.className = 'project-location';
    location.textContent = project.location;
    
    const button = document.createElement('button');
    button.className = 'view-project-btn';
    button.textContent = 'View Project';
    button.setAttribute('data-project', project.id);
    
    cover.appendChild(img);
    info.appendChild(title);
    info.appendChild(location);
    info.appendChild(button);
    card.appendChild(cover);
    card.appendChild(info);
    
    // Add hover effect for smooth image scale
    card.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1)';
    });
    
    card.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
    });
    
    return card;
}

function openProjectDetail(projectId) {
    console.log('Looking for project:', projectId);
    const project = window.projects.find(p => p.id === projectId);
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }

    // Create popup elements
    const popup = document.createElement('div');
    popup.className = 'project-detail-popup';
    
    const container = document.createElement('div');
    container.className = 'project-detail-container';
    
    // Create header section
    const header = document.createElement('div');
    header.className = 'project-detail-header';
    
    const title = document.createElement('h2');
    title.className = 'project-detail-title';
    title.textContent = project.title;
    
    const location = document.createElement('p');
    location.className = 'project-detail-location';
    location.textContent = project.location;
    
    const description = document.createElement('p');
    description.className = 'project-detail-description';
    description.textContent = project.description;
    
    header.appendChild(title);
    header.appendChild(location);
    header.appendChild(description);
    
    // Create carousel
    const carousel = document.createElement('div');
    carousel.className = 'carousel-container';
    
    const carouselMain = document.createElement('div');
    carouselMain.className = 'carousel-main';
    
    const mainImage = document.createElement('img');
    mainImage.className = 'carousel-main-image';
    mainImage.src = project.images[0];
    mainImage.alt = project.title;
    
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-nav-btn prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-nav-btn next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    
    let currentIndex = 0;
    
    // Create indicators
    project.images.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `carousel-indicator${index === 0 ? ' active' : ''}`;
        indicator.addEventListener('click', () => {
            updateImage(index);
        });
        indicators.appendChild(indicator);
    });
    
    // Update image function
    function updateImage(index) {
        currentIndex = index;
        mainImage.style.opacity = '0';
        
        setTimeout(() => {
            mainImage.src = project.images[index];
            mainImage.style.opacity = '1';
            
            // Update indicators
            document.querySelectorAll('.carousel-indicator').forEach((ind, i) => {
                ind.classList.toggle('active', i === index);
            });
            
            // Update button states
            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === project.images.length - 1;
        }, 300);
    }
    
    // Add navigation handlers
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) updateImage(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < project.images.length - 1) updateImage(currentIndex + 1);
    });
    
    // Add keyboard navigation
    const handleKeydown = (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            updateImage(currentIndex - 1);
        } else if (e.key === 'ArrowRight' && currentIndex < project.images.length - 1) {
            updateImage(currentIndex + 1);
        } else if (e.key === 'Escape') {
            closePopup();
        }
    };
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-project-detail';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    // Close function
    function closePopup() {
        popup.classList.remove('active');
        document.removeEventListener('keydown', handleKeydown);
        setTimeout(() => {
            popup.remove();
        }, 400);
    }
    
    closeBtn.addEventListener('click', closePopup);
    
    // Click outside to close
    popup.addEventListener('click', (e) => {
        if (e.target === popup) closePopup();
    });
    
    // Assemble carousel
    carouselMain.appendChild(mainImage);
    controls.appendChild(prevBtn);
    controls.appendChild(indicators);
    controls.appendChild(nextBtn);
    carousel.appendChild(carouselMain);
    carousel.appendChild(controls);
    
    // Assemble container
    container.appendChild(closeBtn);
    container.appendChild(header);
    container.appendChild(carousel);
    
    popup.appendChild(container);
    document.body.appendChild(popup);
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeydown);
    
    // Trigger animation with proper timing
    setTimeout(() => {
        popup.classList.add('active');
    }, 50);
}

// Initialize projects with enhanced data
function initializePortfolioAndTeam() {
    // Make projects array accessible globally
    window.projects = [
        {
            id: 'california',
            title: 'Transforming of a Family Home',
            location: 'California, US',
            description: 'A complete transformation of a family residence, blending modern luxury with comfortable living. This project showcases our ability to create spaces that are both elegant and functional.',
            image: 'images/CA project done/IBICali2019-71.jpg',
            images: [
                'images/CA project done/IBICali2019-71.jpg',
                'images/CA project done/IBICali2019-441.jpg',
                'images/CA project done/IBICali2019-411.jpg',
                'images/CA project done/IBICali2019-351.jpg',
                'images/CA project done/IBICali2019-43.jpg',
                'images/CA project done/IBICali2019-42.jpg',
                'images/CA project done/IBICali2019-34.jpg',
                'images/CA project done/IBICali2019-33.jpg',
                'images/CA project done/IBICali2019-31.jpg',
                'images/CA project done/IBICali2019-5.jpg',
                'images/CA project done/IBICali2019-6 1.jpg',
                'images/CA project done/IBICali2019-8.jpg',
                'images/CA project done/IBICali2019-9 - Copy.jpg'
            ]
        },
        {
            id: 'restaurant',
            title: 'A Bold New Restaurant Concept with Heart',
            location: 'Restaurant Project',
            description: 'An innovative restaurant design that combines bold aesthetics with warm hospitality. This project demonstrates our expertise in creating memorable dining experiences through thoughtful interior design.',
            image: 'images/grill/Grill 445-1.jpg',
            images: [
                'images/grill/Grill 445-1.jpg',
                'images/grill/Grill 445-3.jpg',
                'images/grill/Grill 445-5.jpg',
                'images/grill/Grill 445-8.jpg',
                'images/grill/Grill 445-9.jpg',
                'images/grill/Grill 445-11.jpg',
                'images/grill/Grill 445-12.jpg',
                'images/grill/Grill 445-13.jpg',
                'images/grill/Grill 445-16.jpg',
                'images/grill/Grill 445-18.jpg',
                'images/grill/Grill 445-19.jpg',
                'images/grill/Grill 445-23.jpg',
                'images/grill/Grill 445-24.jpg',
                'images/grill/Grill 445-26.jpg'
            ]
        },
        {
            id: 'ibiza',
            title: 'Ibiza the magical island',
            location: 'Ibiza, Spain',
            description: 'In Ibiza, we redesigned a beautiful home that captures the island\'s unique blend of energy and serenity. The interiors feature soft, natural tones that reflect the sunlight and harmonize with the surrounding landscape. We selected sophisticated materials — including organic linens, natural stone, warm wood, and handcrafted details — to bring authenticity and elegance to the space. The furniture combines relaxed comfort with contemporary design, creating an inviting atmosphere that flows effortlessly between indoor and outdoor living. The result is a stylish, tranquil retreat that celebrates the essence of Ibiza\'s coastal lifestyle.',
            image: 'images/ibiza/Ibiza 5.jpg',
            images: [
                'images/ibiza/Ibiza.jpg',
                'images/ibiza/Ibiza 2.jpg',
                'images/ibiza/Ibiza 3.jpg',
                'images/ibiza/Ibiza 4.jpg',
                'images/ibiza/Ibiza 5.jpg'
            ]
        },
        {
            id: 'spain',
            title: 'Apartment upon in the Hills',
            location: 'Altea, Spain',
            description: 'In Altea, Spain, we completed a stunning interior transformation of an apartment overlooking the Mediterranean Sea. The design embraces a soft, light color palette that enhances the natural brightness and frames the breathtaking sea views. We chose sophisticated materials — including elegant fabrics, refined wood finishes, and subtle stone details — to create a sense of timeless comfort. The furniture features clean, contemporary lines with a focus on quality and exceptional comfort, complementing the airy, open feel of the space. The result is a serene, elegant home that blends modern style with the relaxed spirit of coastal living.',
            image: 'images/spain/Spain 4.jpg',
            images: [
                'images/spain/Spain.jpg',
                'images/spain/Spain 2.jpg',
                'images/spain/Spain 3.jpg',
                'images/spain/Spain 4.jpg'
            ]
        }
    ];

    const projectCardsContainer = document.querySelector('.project-cards-container');
    if (projectCardsContainer) {
        // Clear existing content
        projectCardsContainer.innerHTML = '';
        
        // Create and append project cards
        window.projects.forEach(project => {
            const card = createProjectCard(project);
            projectCardsContainer.appendChild(card);
        });

        // Use event delegation for the view project buttons
        projectCardsContainer.addEventListener('click', (e) => {
            const viewProjectBtn = e.target.closest('.view-project-btn');
            if (viewProjectBtn) {
                e.preventDefault();
                e.stopPropagation();
                const projectId = viewProjectBtn.getAttribute('data-project');
                console.log('Opening project:', projectId);
                openProjectDetail(projectId);
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePortfolioAndTeam);

// Project Description Modal
const projectInfoBtn = document.getElementById('projectInfoBtn');
const projectDescriptionModal = document.getElementById('projectDescriptionModal');
const closeProjectDescriptionBtn = document.getElementById('closeProjectDescriptionBtn');

if (projectInfoBtn && projectDescriptionModal && closeProjectDescriptionBtn) {
    projectInfoBtn.addEventListener('click', () => {
        projectDescriptionModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeProjectDescriptionBtn.addEventListener('click', () => {
        projectDescriptionModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    projectDescriptionModal.addEventListener('click', (e) => {
        if (e.target === projectDescriptionModal) {
            projectDescriptionModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Project Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    const galleryModal = document.querySelector('.gallery-modal');
    const gallerySlides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.gallery-prev-btn');
    const nextBtn = document.querySelector('.gallery-next-btn');
    const closeBtn = document.querySelector('.close-gallery');
    const counter = document.querySelector('.gallery-counter');
    let currentSlide = 0;
    let activeProject = 'california'; // Track which project's gallery is active

    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides first
        gallerySlides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Show only slides for the active project
        const projectSlides = Array.from(gallerySlides).filter(slide => {
            if (activeProject === 'california') {
                return !slide.classList.contains('restaurant-slide') && !slide.classList.contains('ibiza-slide') && !slide.classList.contains('spain-slide');
            } else if (activeProject === 'restaurant') {
                return slide.classList.contains('restaurant-slide');
            } else if (activeProject === 'ibiza') {
                return slide.classList.contains('ibiza-slide');
            } else if (activeProject === 'spain') {
                return slide.classList.contains('spain-slide');
            }
            return false;
        });

        // Handle index bounds
        if (index < 0) index = projectSlides.length - 1;
        if (index >= projectSlides.length) index = 0;

        // Show the current slide
        projectSlides[index].classList.add('active');
        currentSlide = index;

        // Update counter
        counter.textContent = `${index + 1} / ${projectSlides.length}`;
    }

    // Add click event listeners to gallery buttons
    document.querySelectorAll('.gallery-btn').forEach(btn => {
        btn.addEventListener('click', function() {
                    // Determine which project's gallery to show
        const projectCard = this.closest('.project-card');
        const imgSrc = projectCard.querySelector('img').src;
        if (imgSrc.includes('grill')) {
            activeProject = 'restaurant';
        } else if (imgSrc.includes('ibiza')) {
            activeProject = 'ibiza';
        } else if (imgSrc.includes('spain')) {
            activeProject = 'spain';
        } else {
            activeProject = 'california';
        }
            
            // Show gallery modal
            galleryModal.classList.add('active');
            document.body.classList.add('no-scroll');
            
            // Show first slide
            showSlide(0);
        });
    });

    // Previous button click
    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });

    // Next button click
    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });

    // Close button click
        closeBtn.addEventListener('click', () => {
            galleryModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });

    // Click outside to close
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                galleryModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!galleryModal.classList.contains('active')) return;

            if (e.key === 'ArrowLeft') {
            showSlide(currentSlide - 1);
            } else if (e.key === 'ArrowRight') {
            showSlide(currentSlide + 1);
            } else if (e.key === 'Escape') {
            galleryModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
});

// Project Description Popup Functionality
document.addEventListener('DOMContentLoaded', function() {
    const projectDescriptionPopups = document.querySelectorAll('.project-description-popup');
    const closeProjectDescriptionBtns = document.querySelectorAll('.close-project-description');
    const readAboutProjectBtns = document.querySelectorAll('.project-btn[data-translate="readAboutProject"]');
    
    // Open project description popup
    readAboutProjectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Determine which project's description to show
            const projectCard = btn.closest('.project-card');
            if (projectCard) {
                const projectTitle = projectCard.querySelector('.project-title').textContent;
                const projectImage = projectCard.querySelector('img').src;
                
                // Hide all popups first
                projectDescriptionPopups.forEach(popup => {
                    popup.style.display = 'none';
                    popup.classList.remove('active');
                });
                
                // Show the appropriate popup based on project
                let targetPopup;
                if (projectTitle.includes('Restaurant')) {
                    targetPopup = document.querySelector('.restaurant-description');
                } else if (projectTitle.includes('Ibiza') || projectImage.includes('ibiza')) {
                    targetPopup = document.querySelector('.ibiza-description');
                } else if (projectTitle.includes('Apartment upon') || projectImage.includes('spain')) {
                    targetPopup = document.querySelector('.spain-description');
                } else if (projectTitle.includes('Family Mansion') || projectImage.includes('Family mansion')) {
                    targetPopup = document.querySelector('.family-mansion-description');
                } else if (projectTitle.includes('Algarve Villa') || projectImage.includes('Algarve Villa')) {
                    targetPopup = document.querySelector('.algarve-villa-description');
                } else {
                    // Default to California project
                    targetPopup = document.querySelector('.project-description-popup:not(.restaurant-description):not(.ibiza-description):not(.spain-description):not(.family-mansion-description):not(.algarve-villa-description)');
                }
                
                if (targetPopup) {
                    targetPopup.style.display = 'flex';
            requestAnimationFrame(() => {
                        targetPopup.classList.add('active');
                document.body.classList.add('no-scroll');
        });
    }
            }
        });
    });
    
    // Handle Family Mansion project button
    const familyMansionBtn = document.querySelector('.family-mansion-btn');
    if (familyMansionBtn) {
        familyMansionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Hide all popups first
            projectDescriptionPopups.forEach(popup => {
                popup.style.display = 'none';
                popup.classList.remove('active');
            });
            
            const targetPopup = document.querySelector('.family-mansion-description');
            if (targetPopup) {
                targetPopup.style.display = 'flex';
                requestAnimationFrame(() => {
                    targetPopup.classList.add('active');
                    document.body.classList.add('no-scroll');
                });
            }
        });
    }
    
    // Handle Algarve Villa project button
    const algarveVillaBtn = document.querySelector('.algarve-villa-btn');
    if (algarveVillaBtn) {
        algarveVillaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Hide all popups first
            projectDescriptionPopups.forEach(popup => {
                popup.style.display = 'none';
                popup.classList.remove('active');
            });
            
            const targetPopup = document.querySelector('.algarve-villa-description');
            if (targetPopup) {
                targetPopup.style.display = 'flex';
                requestAnimationFrame(() => {
                    targetPopup.classList.add('active');
                    document.body.classList.add('no-scroll');
                });
            }
        });
    }
    
    // Close project description popup
    closeProjectDescriptionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const popup = this.closest('.project-description-popup');
            if (popup) {
                popup.classList.remove('active');
            setTimeout(() => {
                    popup.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }, 500); // Match the transition duration
    }
        });
    });
    
    // Close popup when clicking outside
    projectDescriptionPopups.forEach(popup => {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                popup.classList.remove('active');
            setTimeout(() => {
                    popup.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }, 500); // Match the transition duration
        }
        });
    });
    
    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            projectDescriptionPopups.forEach(popup => {
                if (popup.classList.contains('active')) {
                    popup.classList.remove('active');
            setTimeout(() => {
                        popup.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }, 500); // Match the transition duration
                }
            });
        }
    });
});