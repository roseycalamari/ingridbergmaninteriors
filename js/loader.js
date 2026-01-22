/**
 * Circular Logo-Based Loader Animation
 * Creates a single-instance loading animation based on the site's circular "i" logo
 * Optimized for performance with timeout fallback to prevent infinite loading
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get the loader element
    const loader = document.querySelector('.page-loader');
    
    if (!loader) {
        document.body.classList.add('loaded');
        return;
    }
    
    // Check if this is the first load in this session
    const hasVisited = sessionStorage.getItem('hasVisitedSite');
    
    // Only show loader on first visit of the session
    if (hasVisited) {
        loader.style.display = 'none';
        document.body.classList.add('loaded');
        return;
    }
    
    let loaderComplete = false;
    
    // Show the page after loader animation completes
    const showPage = () => {
        if (loaderComplete) return;
        loaderComplete = true;
        
        // First fadeout the loader
        loader.classList.add('loader-hidden');
        
        // Set session flag to prevent loader on subsequent page loads
        sessionStorage.setItem('hasVisitedSite', 'true');
        
        // Then remove it from DOM after animation completes
        const removeLoader = () => {
            document.body.classList.add('loaded');
            if (loader.parentNode) {
                loader.remove();
            }
        };
        
        // Use transitionend with a fallback timeout
        loader.addEventListener('transitionend', removeLoader, { once: true });
        
        // Fallback in case transitionend doesn't fire
        setTimeout(removeLoader, 600);
    };
    
    // CRITICAL: Maximum wait time for loader (prevents infinite loading)
    const MAX_LOADER_TIME = 4000; // 4 seconds max
    const MIN_LOADER_TIME = 800;  // Minimum display time for UX
    
    const startTime = Date.now();
    
    // Force show page after max time (failsafe)
    const maxTimeoutId = setTimeout(() => {
        console.log('Loader timeout - forcing page display');
        showPage();
    }, MAX_LOADER_TIME);
    
    // Function to trigger page show with minimum display time
    const triggerShowPage = () => {
        const elapsed = Date.now() - startTime;
        const remainingMinTime = Math.max(0, MIN_LOADER_TIME - elapsed);
        
        clearTimeout(maxTimeoutId);
        setTimeout(showPage, remainingMinTime);
    };
    
    // Check if page has already loaded (browser cache)
    if (document.readyState === 'complete') {
        triggerShowPage();
    } else {
        // Listen for load event
        window.addEventListener('load', triggerShowPage, { once: true });
        
        // Also listen for when DOM is interactive (faster response)
        if (document.readyState === 'interactive') {
            // Give resources a bit more time but not too long
            setTimeout(() => {
                if (!loaderComplete) {
                    triggerShowPage();
                }
            }, 2000);
        }
    }
});
