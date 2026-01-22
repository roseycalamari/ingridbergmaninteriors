/**
 * Advanced Page Transitions System
 * Creates ultra-smooth transitions between pages with optimized performance
 * Mobile-optimized with intelligent handling of different navigation patterns
 */

document.addEventListener('DOMContentLoaded', () => {
    // The transition overlay element
    const transitionOverlay = document.querySelector('.page-transition-overlay');
    
    // All links that should trigger page transitions
    const pageTransitionLinks = document.querySelectorAll('[data-page-transition]');
    
    // Check if we're on a touch device for different transition timing
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Cache current page for intelligent transitions
    const currentPage = {
        path: window.location.pathname,
        isHome: window.location.pathname === '/' || 
                window.location.pathname.endsWith('/') || 
                window.location.pathname.endsWith('index.html'),
        type: window.location.pathname.includes('service') ? 'service' :
              window.location.pathname.includes('person') ? 'person' :
              window.location.pathname.includes('brands') ? 'brands' :
              window.location.pathname.includes('contact') ? 'contact' : 'home'
    };

    /**
     * Get transition type based on navigation path
     * @param {string} targetUrl - Target URL
     * @param {boolean} isBackNavigation - Whether this is a back button navigation
     * @returns {Object} - Transition settings including type, duration, and easing
     */
    const getTransitionType = (targetUrl, isBackNavigation = false) => {
        // Determine if this is a return to homepage
        const isHomepageReturn = targetUrl === 'index.html' || 
                                targetUrl.endsWith('/index.html') || 
                                targetUrl === '/' || 
                                targetUrl.endsWith('/');
        
        // Determine target page type
        const targetType = targetUrl.includes('service') ? 'service' :
                          targetUrl.includes('person') ? 'person' :
                          targetUrl.includes('brands') ? 'brands' :
                          targetUrl.includes('contact') ? 'contact' : 'home';
        
        // Luxury transition values - smooth and elegant
        let transitionType = 'slide';
        let transitionDuration = 700; // Balanced for smooth feel
        let transitionEasing = 'cubic-bezier(0.33, 1, 0.68, 1)'; // Luxury smooth-out easing
        
        // Adjust transition type based on navigation pattern
        if (isHomepageReturn) {
            transitionType = 'fade';
            transitionDuration = 600;
            transitionEasing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
        } else if (isBackNavigation) {
            transitionType = 'slideBack';
            transitionDuration = 650;
            transitionEasing = 'cubic-bezier(0.33, 1, 0.68, 1)';
        } else if (currentPage.type === 'home' && targetType !== 'home') {
            transitionType = 'zoomOut';
            transitionDuration = 750;
            transitionEasing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
        } else if (currentPage.type !== 'home' && targetType !== 'home') {
            transitionType = 'crossfade';
            transitionDuration = 600;
            transitionEasing = 'cubic-bezier(0.65, 0, 0.35, 1)';
        }
        
        // Slightly reduce durations for touch devices while keeping smoothness
        if (isTouchDevice) {
            transitionDuration = Math.floor(transitionDuration * 0.85);
        }
        
        // Respect reduced motion preferences
        if (prefersReducedMotion) {
            transitionType = 'fade';
            transitionDuration = 200;
            transitionEasing = 'ease';
        }
        
        return {
            type: transitionType,
            duration: transitionDuration,
            easing: transitionEasing
        };
    };
    
    /**
     * Handles the transition to a new page
     * @param {string} targetUrl - The URL to navigate to
     * @param {boolean} isBackNavigation - Whether this is a back button navigation
     * @param {boolean} isFadeTransition - Whether to force fade transition
     */
    const handlePageTransition = (targetUrl, isBackNavigation = false, isFadeTransition = false) => {
        // If there's no url or it's the current page, do nothing
        if (!targetUrl || targetUrl === window.location.href) return;
        
        // Stop video if it's playing when closing brands section
        const video = document.getElementById('collections-video');
        if (video && !video.paused) {
            video.pause();
            video.currentTime = 0;
            const videoWrapper = document.querySelector('.luxury-video-wrapper');
            if (videoWrapper) {
                videoWrapper.classList.remove('video-playing');
            }
            const playButton = document.querySelector('.video-play-btn');
            if (playButton) {
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
        
        // Resolve relative URLs
        let resolvedUrl = targetUrl;
        if (!targetUrl.startsWith('http') && !targetUrl.startsWith('/')) {
            const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
            resolvedUrl = baseUrl + targetUrl;
        }
        
        // Check if it's the same page with different hash
        const currentUrlWithoutHash = window.location.href.split('#')[0];
        const targetUrlWithoutHash = resolvedUrl.split('#')[0];
        if (currentUrlWithoutHash === targetUrlWithoutHash) {
            window.location.href = resolvedUrl;
            return;
        }
        
        // Add transition class to body
        document.body.classList.add('page-transition-active');
        
        // Get transition settings
        const transition = isFadeTransition ? 
            { type: 'fade', duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' } : 
            getTransitionType(targetUrl, isBackNavigation);
        
        // Apply transition settings to the overlay
        if (transitionOverlay) {
            transitionOverlay.style.visibility = 'visible';
            
            // Apply CSS variables for transition
            document.documentElement.style.setProperty('--page-transition-duration', `${transition.duration}ms`);
            document.documentElement.style.setProperty('--page-transition-easing', transition.easing);
            
            // Use requestAnimationFrame for smoother transitions
            requestAnimationFrame(() => {
                // Apply appropriate transition styles based on type
                switch(transition.type) {
                    case 'fade':
                        transitionOverlay.style.opacity = '1';
                        transitionOverlay.style.transform = 'translateY(0)';
                        transitionOverlay.classList.add('fade-transition');
                        break;
                    case 'slideBack':
                        transitionOverlay.style.opacity = '1';
                        transitionOverlay.style.transform = 'translateY(-100%)';
                        break;
                    case 'zoomOut':
                        transitionOverlay.style.opacity = '1';
                        transitionOverlay.style.transform = 'translateY(0) scale(1.05)';
                        transitionOverlay.classList.add('zoom-transition');
                        break;
                    case 'crossfade':
                        transitionOverlay.style.opacity = '1';
                        transitionOverlay.style.transform = 'translateY(0)';
                        transitionOverlay.classList.add('crossfade-transition');
                        break;
                    default:  // Default 'slide'
                        transitionOverlay.style.opacity = '1';
                        transitionOverlay.style.transform = 'translateY(0)';
                        break;
                }
            });
        }
        
        // Wait for transition to complete then navigate
        setTimeout(() => {
            // Save current scroll position for back navigation
            const scrollPos = window.scrollY;
            sessionStorage.setItem('scrollPosition_' + window.location.pathname, scrollPos);
            
            // Save transition type for entry animation
            sessionStorage.setItem('lastTransition', transition.type);
            
            // Navigate to the new URL
            window.location.href = resolvedUrl;
        }, transition.duration - 100); // Increased buffer for smoother transition
    };
    
    /**
     * Handle entering the page with proper animation
     */
    const handlePageEnter = () => {
        // Get the transition type used to navigate to this page
        const lastTransition = sessionStorage.getItem('lastTransition') || 'slide';
        
        // If we're coming from a page transition, animate the overlay out
        if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
            if (transitionOverlay) {
                // Set the initial position for the overlay
                transitionOverlay.style.visibility = 'visible';
                transitionOverlay.style.opacity = '1';
                
                // Add appropriate transition class
                if (lastTransition === 'fade' || lastTransition === 'crossfade') {
                    transitionOverlay.classList.add('fade-transition');
                } else if (lastTransition === 'zoomOut') {
                    transitionOverlay.classList.add('zoom-transition');
                }
                
                // Check if this is a return to homepage
                const isHomepageReturn = window.location.pathname === '/' || 
                                        window.location.pathname.endsWith('/') || 
                                        window.location.pathname.endsWith('index.html');
                
                // Different animation for homepage returns - luxurious timing
                if (isHomepageReturn && (lastTransition === 'fade' || transitionOverlay.classList.contains('fade-transition'))) {
                    // Fade out for homepage returns - smooth and elegant
                    setTimeout(() => {
                        document.body.classList.add('page-transition-complete');
                        transitionOverlay.style.transition = 'opacity 0.6s cubic-bezier(0.33, 1, 0.68, 1)';
                        transitionOverlay.style.opacity = '0';
                        
                        // Reset after transition
                        setTimeout(() => {
                            transitionOverlay.style.visibility = 'hidden';
                            transitionOverlay.classList.remove('fade-transition');
                            transitionOverlay.classList.remove('zoom-transition');
                            transitionOverlay.classList.remove('crossfade-transition');
                            document.body.classList.remove('page-transition-active', 'page-transition-complete');
                        }, 650);
                    }, 50);
                } else if (lastTransition === 'zoomOut') {
                    // Zoom in animation - cinematic feel
                    transitionOverlay.style.transform = 'translateY(0) scale(1.05)';
                    
                    setTimeout(() => {
                        document.body.classList.add('page-transition-complete');
                        transitionOverlay.style.transition = 'opacity 0.7s cubic-bezier(0.33, 1, 0.68, 1), transform 0.8s cubic-bezier(0.33, 1, 0.68, 1)';
                        transitionOverlay.style.opacity = '0';
                        transitionOverlay.style.transform = 'translateY(0) scale(1.08)';
                        
                        // Reset after transition
                        setTimeout(() => {
                            transitionOverlay.style.visibility = 'hidden';
                            transitionOverlay.classList.remove('zoom-transition');
                            document.body.classList.remove('page-transition-active', 'page-transition-complete');
                        }, 850);
                    }, 50);
                } else if (lastTransition === 'crossfade') {
                    // Cross-fade animation - silky smooth
                    setTimeout(() => {
                        document.body.classList.add('page-transition-complete');
                        transitionOverlay.style.transition = 'opacity 0.65s cubic-bezier(0.33, 1, 0.68, 1)';
                        transitionOverlay.style.opacity = '0';
                        
                        // Reset after transition
                        setTimeout(() => {
                            transitionOverlay.style.visibility = 'hidden';
                            transitionOverlay.classList.remove('crossfade-transition');
                            document.body.classList.remove('page-transition-active', 'page-transition-complete');
                        }, 700);
                    }, 50);
                } else {
                    // Standard slide transition - elegant reveal
                    transitionOverlay.style.transform = 'translateY(0)';
                    
                    // Add complete class to animate out
                    setTimeout(() => {
                        document.body.classList.add('page-transition-complete');
                        transitionOverlay.style.transition = 'transform 0.7s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.6s cubic-bezier(0.33, 1, 0.68, 1)';
                        transitionOverlay.style.transform = 'translateY(-100%)';
                        transitionOverlay.style.opacity = '0';
                        
                        // Reset after transition
                        setTimeout(() => {
                            transitionOverlay.style.visibility = 'hidden';
                            document.body.classList.remove('page-transition-active', 'page-transition-complete');
                        }, 750);
                    }, 50);
                }
            }
            
            // Restore scroll position if navigating back
            if (performance.navigation.type === 2) { // Back button navigation
                const savedScrollPos = sessionStorage.getItem('scrollPosition_' + window.location.pathname);
                if (savedScrollPos) {
                    setTimeout(() => {
                        window.scrollTo(0, parseInt(savedScrollPos));
                    }, 200);
                }
            }
        }
    };
    
    /**
     * Setup event listeners for transition links
     */
    const setupTransitionLinks = () => {
        pageTransitionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetUrl = link.getAttribute('href');
                
                // For overlays, close them first with a slight delay
                const overlay = link.closest('.fullscreen-overlay');
                if (overlay && overlay.classList.contains('overlay-active')) {
                    overlay.classList.remove('overlay-active');
                    setTimeout(() => {
                        handlePageTransition(targetUrl);
                    }, 400);
                } else {
                    handlePageTransition(targetUrl);
                }
            });
        });
    };
    
    /**
     * Handle browser back button with custom transition
     */
    const handleBrowserNavigation = () => {
        window.addEventListener('popstate', (e) => {
            // Prevent default behavior only if we want to handle it ourselves
            if (document.body.classList.contains('page-transition-active')) {
                e.preventDefault();
                return;
            }
            
            // Handle back button with a special transition
            handlePageTransition(document.location.href, true);
        });
    };
    
    /**
     * Setup The Person button to properly navigate or show about section
     */
    const setupPersonLink = () => {
        const aboutBtn = document.querySelector('.about-btn');
        
        if (aboutBtn) {
            aboutBtn.addEventListener('click', (e) => {
                // First check if openAboutSection function exists
                if (typeof window.openAboutSection === 'function') {
                    // Use the existing function if we're on the homepage
                    const path = window.location.pathname;
                    if (path === '/' || path.endsWith('/index.html') || path.endsWith('/')) {
                        window.openAboutSection();
                    } else {
                        // Navigate to the person page otherwise
                        handlePageTransition('the-person.html');
                    }
                } else {
                    // Navigate to the person page if function doesn't exist
                    handlePageTransition('the-person.html');
                }
            });
        }
    };
    
    /**
     * Enhance the homepage return button behavior to use page transitions
     */
    const enhanceReturnButtons = () => {
        // For the about section on the homepage
        const aboutBackHomeBtn = document.querySelector('.about-back-home-btn');
        if (aboutBackHomeBtn) {
            const path = window.location.pathname;
            // Only add transition behavior if we're not on homepage
            if (!path.endsWith('index.html') && path !== '/' && !path.endsWith('/')) {
                aboutBackHomeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    handlePageTransition('index.html', false, true); // Use fade transition
                });
            }
        }
        
        // For direct homepage return buttons on other pages
        const homeReturnBtns = document.querySelectorAll('.return-home-btn, .back-to-home-btn');
        homeReturnBtns.forEach(btn => {
            // Only add if it doesn't already have the data-page-transition attribute
            if (!btn.hasAttribute('data-page-transition')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Ensure consistent animation for all return buttons
                    // Use fade transition for smoother experience
                    handlePageTransition('index.html', false, true);
                });
            }
        });
    };
    
    /**
     * Optimize transitions for mobile devices
     */
    const optimizeMobileTransitions = () => {
        if (!isTouchDevice) return;
        
        // Add active state for touch interactions
        pageTransitionLinks.forEach(link => {
            link.addEventListener('touchstart', () => {
                link.classList.add('touch-active');
            }, { passive: true });
            
            link.addEventListener('touchend', () => {
                setTimeout(() => {
                    link.classList.remove('touch-active');
                }, 300);
            }, { passive: true });
        });
        
        // Add class to body for mobile-specific styles
        document.body.classList.add('touch-device');
    };
    
    /**
     * Handle orientation changes for smooth transitions
     */
    const handleOrientationChanges = () => {
        window.addEventListener('orientationchange', () => {
            // Add a class to temporarily disable transitions during orientation change
            document.documentElement.classList.add('orientation-change');
            
            // Remove the class after orientation change is complete
            setTimeout(() => {
                document.documentElement.classList.remove('orientation-change');
            }, 500);
        });
    };
    
    /**
     * Optimize brand images loading
     */
    const optimizeBrandImages = () => {
        const brandImages = document.querySelectorAll('.brand-image');
        
        brandImages.forEach(img => {
            // Add loading class
            img.classList.add('loading');
            
            // Create a new image to preload
            const preloadImage = new Image();
            
            // When the image is loaded, remove loading class and set src
            preloadImage.onload = () => {
                img.classList.remove('loading');
                img.src = preloadImage.src;
            };
            
            // Start loading the image
            preloadImage.src = img.dataset.src || img.src;
        });
    };
    
    /**
     * Initialize the video player functionality
     */
    const initializeVideoPlayer = () => {
        const videoWrapper = document.querySelector('.luxury-video-wrapper');
        const video = document.getElementById('collections-video');
        const playButton = document.querySelector('.video-play-btn');
        const progressBar = document.querySelector('.video-progress-bar');
        const progress = document.querySelector('.video-progress');
        const progressHandle = document.querySelector('.video-progress-handle');
        const currentTimeDisplay = document.querySelector('.video-current-time');
        const durationDisplay = document.querySelector('.video-duration');
        const volumeButton = document.querySelector('.video-volume-btn');
        const fullscreenButton = document.querySelector('.video-fullscreen-btn');
        
        if (!videoWrapper || !video) return;
        
        // Format time in minutes and seconds
        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        };
        
        // Update video progress
        const updateProgress = () => {
            if (!video.duration) return;
            
            const percentage = (video.currentTime / video.duration) * 100;
            if (progress) progress.style.width = `${percentage}%`;
            if (progressHandle) progressHandle.style.left = `${percentage}%`;
            
            if (currentTimeDisplay) {
                currentTimeDisplay.textContent = formatTime(video.currentTime);
            }
        };
        
        // Set video time based on progress bar click
        const setVideoProgress = (e) => {
            if (!progressBar || !video.duration) return;
            
            const rect = progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            video.currentTime = pos * video.duration;
        };
        
        // Toggle fullscreen
        const toggleFullscreen = () => {
            if (!videoWrapper) return;
            
            if (!document.fullscreenElement) {
                if (videoWrapper.requestFullscreen) {
                    videoWrapper.requestFullscreen();
                } else if (videoWrapper.webkitRequestFullscreen) {
                    videoWrapper.webkitRequestFullscreen();
                } else if (videoWrapper.msRequestFullscreen) {
                    videoWrapper.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        };
        
        // Toggle mute
        const toggleMute = () => {
            if (!video || !volumeButton) return;
            
            video.muted = !video.muted;
            volumeButton.innerHTML = video.muted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
        };
        
        // Play/pause functionality
        const togglePlay = () => {
            if (video.paused || video.ended) {
                video.play()
                    .then(() => {
                        videoWrapper.classList.add('video-playing');
                        playButton.innerHTML = '<i class="fas fa-pause"></i>';
                    })
                    .catch(error => {
                        console.error('Error playing video:', error);
                    });
            } else {
                video.pause();
                videoWrapper.classList.remove('video-playing');
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        };
        
        // Set up event listeners
        if (playButton) {
            playButton.addEventListener('click', togglePlay);
        }
        
        if (video) {
            // Load metadata to get duration
            video.addEventListener('loadedmetadata', () => {
                if (durationDisplay) {
                    durationDisplay.textContent = formatTime(video.duration);
                }
            });
            
            // Update progress as video plays
            video.addEventListener('timeupdate', updateProgress);
            
            // Click on video to toggle play
            video.addEventListener('click', () => {
                if (videoWrapper.classList.contains('video-playing')) {
                    togglePlay();
                }
            });
            
            // When video ends
            video.addEventListener('ended', () => {
                videoWrapper.classList.remove('video-playing');
                playButton.innerHTML = '<i class="fas fa-play"></i>';
                video.currentTime = 0;
            });
        }
        
        // Progress bar click handler
        if (progressBar) {
            progressBar.addEventListener('click', setVideoProgress);
        }
        
        // Volume button click handler
        if (volumeButton) {
            volumeButton.addEventListener('click', toggleMute);
        }
        
        // Fullscreen button click handler
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', toggleFullscreen);
        }
        
        // Add touch handling
        if (isTouchDevice && videoWrapper) {
            videoWrapper.addEventListener('touchstart', () => {
                if (videoWrapper.classList.contains('video-playing')) {
                    videoWrapper.classList.add('controls-visible');
                    
                    // Hide controls after 3 seconds
                    setTimeout(() => {
                        videoWrapper.classList.remove('controls-visible');
                    }, 3000);
                }
            }, { passive: true });
        }
        
        // Preload video for smoother playback
        if (!prefersReducedMotion && !isTouchDevice && video) {
            video.preload = 'auto';
        }
    };
    
    // Expose the handlePageTransition function globally
    window.handlePageTransition = handlePageTransition;
    
    // Initialize the page transitions system
    const init = () => {
        setupTransitionLinks();
        handleBrowserNavigation();
        setupPersonLink();
        enhanceReturnButtons();
        optimizeMobileTransitions();
        handleOrientationChanges();
        optimizeBrandImages();
        initializeVideoPlayer();
        
        // Handle page enter animation
        handlePageEnter();
    };
    
    // Start initialization
    init();
});

// REMOVING DUPLICATE GALLERY CODE - This is now handled by projects.js