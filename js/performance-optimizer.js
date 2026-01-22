/**
 * Performance Optimizer Script
 * Implements advanced performance techniques:
 * - Lazy loading images
 * - Content visibility optimizations
 * - Frame rate management
 * - Responsive image loading
 */

document.addEventListener('DOMContentLoaded', () => {
    // Performance detection
    const deviceCapability = detectDeviceCapability();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Apply optimizations based on device capability
    applyPerformanceOptimizations(deviceCapability);
    
    // Setup lazy loading for images
    setupLazyLoading();
    
    // Setup lazy loading for iframes (videos)
    setupLazyIframes();
    
    // Setup IntersectionObserver for content visibility
    setupContentVisibility();
    
    // Optimize animation frame rate based on device capability
    optimizeFrameRate(deviceCapability);
});

/**
 * Setup lazy loading for iframes (Vimeo, YouTube, etc.)
 * Only loads video when user scrolls near it or opens the section
 */
function setupLazyIframes() {
    const lazyIframes = document.querySelectorAll('iframe[data-src]');
    
    if (lazyIframes.length === 0) return;
    
    // Load iframe when brands section becomes visible
    const brandsSection = document.querySelector('.brands-section');
    if (brandsSection) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    // Section is now active, load all lazy iframes
                    lazyIframes.forEach(iframe => {
                        if (iframe.dataset.src && !iframe.src) {
                            iframe.src = iframe.dataset.src;
                        }
                    });
                    observer.disconnect();
                }
            });
        });
        
        observer.observe(brandsSection, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
    // Also use IntersectionObserver as fallback
    const iframeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                if (iframe.dataset.src && !iframe.src) {
                    iframe.src = iframe.dataset.src;
                }
                iframeObserver.unobserve(iframe);
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.01
    });
    
    lazyIframes.forEach(iframe => {
        iframeObserver.observe(iframe);
    });
}

/**
 * Detect device capability for determining performance optimizations
 * @returns {string} - 'high', 'medium', or 'low' based on device capabilities
 */
function detectDeviceCapability() {
    // Check for battery API to detect if device is in low power mode
    const batteryInfo = navigator.getBattery ? navigator.getBattery() : null;
    
    // Check device memory API (Chrome)
    const deviceMemory = navigator.deviceMemory || 4; // Default to middle value
    
    // Check hardware concurrency (CPU cores)
    const cpuCores = navigator.hardwareConcurrency || 4;
    
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check connection type if available
    const connectionType = navigator.connection ? navigator.connection.effectiveType : '4g';
    
    // Check if device is in data saver mode
    const dataSaverEnabled = navigator.connection ? navigator.connection.saveData : false;
    
    // Determine capability level
    if (
        (deviceMemory >= 8 && cpuCores >= 8 && !isMobile && connectionType === '4g' && !dataSaverEnabled) ||
        (window.matchMedia('(min-device-pixel-ratio: 2)').matches && !isMobile)
    ) {
        return 'high';
    } else if (
        (deviceMemory >= 4 && cpuCores >= 4) ||
        (connectionType === '4g' && !dataSaverEnabled)
    ) {
        return 'medium';
    } else {
        return 'low';
    }
}

/**
 * Apply performance optimizations based on device capability
 * @param {string} capability - Device capability level ('high', 'medium', or 'low')
 */
function applyPerformanceOptimizations(capability) {
    // Get all brand images
    const brandImages = document.querySelectorAll('.brand-image');
    const backgroundImages = document.querySelectorAll('[style*="background"]');
    
    // Apply data-save attribute to document if needed
    if (navigator.connection && navigator.connection.saveData) {
        document.documentElement.setAttribute('data-save-data', 'true');
    }
    
    // Add capability class to document for CSS targeting
    document.documentElement.classList.add(`capability-${capability}`);
    
    // Apply capability-specific optimizations
    if (capability === 'low') {
        // Disable heavy animations
        document.documentElement.classList.add('reduce-animations');
        
        // Use lower resolution images when possible
        brandImages.forEach(img => {
            // Store original src for high capability devices
            img.setAttribute('data-high-res', img.src);
            
            // If there's a lower res version available (webp or jpg instead of png)
            const lowResSrc = img.getAttribute('data-low-res');
            if (lowResSrc) {
                img.src = lowResSrc;
            }
        });
        
        // Reduce motion and complexity in background images
        backgroundImages.forEach(el => {
            el.style.backgroundAttachment = 'scroll';
            el.style.backgroundSize = 'cover';
        });
    } else if (capability === 'medium') {
        // Balance animations and quality
        document.documentElement.classList.add('optimize-animations');
    }
    
    // Apply data-save-data specific optimizations if needed
    if (navigator.connection && navigator.connection.saveData) {
        // Prevent autoplay videos
        const videos = document.querySelectorAll('video[autoplay]');
        videos.forEach(video => {
            video.removeAttribute('autoplay');
            video.setAttribute('preload', 'none');
        });
        
        // Create preview for iframes like vimeo/youtube
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            const wrapper = iframe.parentElement;
            // Create clickable overlay to load iframe only when needed
            if (!wrapper.classList.contains('luxury-video-wrapper')) return;
            
            const src = iframe.src;
            iframe.dataset.src = src;
            iframe.src = '';
            
            const overlay = document.createElement('div');
            overlay.classList.add('video-load-overlay');
            overlay.innerHTML = '<button class="load-video-btn">Load Video</button>';
            wrapper.appendChild(overlay);
            
            overlay.addEventListener('click', () => {
                iframe.src = iframe.dataset.src;
                overlay.remove();
            });
        });
    }
}

/**
 * Setup lazy loading for images using Intersection Observer
 */
function setupLazyLoading() {
    // Check if browser supports native lazy loading
    const supportsLazyLoading = 'loading' in HTMLImageElement.prototype;
    
    // Setup native lazy loading for supported browsers
    if (supportsLazyLoading) {
        const lazyImages = document.querySelectorAll('img:not([loading])');
        lazyImages.forEach(img => {
            // Don't lazy load critical above-the-fold images
            if (!img.classList.contains('portrait-image') && 
                !img.classList.contains('logo')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
    
    // Implement custom lazy loading with Intersection Observer for non-native support
    // and for any images with data-src attributes
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length === 0) return;
    
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                
                // Handle onload to remove placeholder styles
                img.onload = () => {
                    img.classList.remove('lazy-placeholder');
                    img.classList.add('lazy-loaded');
                };
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '200px 0px',
        threshold: 0.01
    });
    
    lazyImages.forEach(img => {
        lazyImageObserver.observe(img);
    });
    
    // Also handle background images with data-background
    const lazyBackgrounds = document.querySelectorAll('[data-background]');
    if (lazyBackgrounds.length === 0) return;
    
    const lazyBackgroundObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.style.backgroundImage = `url(${element.dataset.background})`;
                element.classList.add('loaded-background');
                observer.unobserve(element);
            }
        });
    }, {
        rootMargin: '200px 0px',
        threshold: 0.01
    });
    
    lazyBackgrounds.forEach(bg => {
        lazyBackgroundObserver.observe(bg);
    });
}

/**
 * Setup content visibility optimizations for off-screen content
 * Uses content-visibility: auto for supported browsers
 */
function setupContentVisibility() {
    // Check if browser supports content-visibility
    const supportsContentVisibility = CSS.supports('content-visibility', 'auto');
    
    if (supportsContentVisibility) {
        // Apply content-visibility to sections that are likely to be off-screen
        const sections = document.querySelectorAll('.brands-section, .service-section, .about-section, .contact-section');
        
        sections.forEach(section => {
            section.style.contentVisibility = 'auto';
            section.style.containIntrinsicSize = '1px 5000px'; // Estimate size
        });
    }
}

/**
 * Optimize frame rate based on device capability
 * @param {string} capability - Device capability level
 */
function optimizeFrameRate(capability) {
    // If device is low capability, throttle animations to 30fps
    if (capability === 'low') {
        // Find elements with animations
        const animatedElements = document.querySelectorAll(
            '.section, .portrait, .brand-item, .about-btn, [class*="transition"]'
        );
        
        // Set reduced-motion-friendly animations
        animatedElements.forEach(el => {
            el.style.transition = 'all 0.4s ease-out';
        });
    }
}

/**
 * Optimize brand images - convert them to click-to-expand for smaller screens
 */
function optimizeBrandImages() {
    // Only for small screens
    if (window.innerWidth >= 768) return;
    
    const brandItems = document.querySelectorAll('.brand-item');
    
    brandItems.forEach(item => {
        const img = item.querySelector('.brand-image');
        const brandName = item.querySelector('.brand-name');
        
        // Make the image smaller initially
        img.style.height = '120px';
        
        // Add toggle behavior
        item.addEventListener('click', (e) => {
            // Don't trigger if clicking on the link
            if (e.target.classList.contains('brand-link')) return;
            
            if (img.classList.contains('expanded')) {
                img.classList.remove('expanded');
                img.style.height = '120px';
            } else {
                img.classList.add('expanded');
                img.style.height = 'auto';
            }
        });
    });
}

// Call the image optimization function when window is loaded
window.addEventListener('load', () => {
    optimizeBrandImages();
}); 