/**
 * Projects Functionality for Ingrid Bergman Interiors
 * Handles project details
 */

document.addEventListener('DOMContentLoaded', function() {
    initProjects();
});

function initProjects() {
    // DOM Elements
    const projectThumbnails = document.querySelectorAll('.project-thumbnail');
    const projectDetailsPopup = document.querySelector('.project-details-popup');
    const closeProjectDetailsBtn = document.querySelector('.close-project-details');
    
    // Current project state
    let currentProject = null;
    
    // Setup project info buttons on project cards
    projectThumbnails.forEach(thumbnail => {
        const readAboutBtn = thumbnail.querySelector('.read-about-btn');
        const project = thumbnail.getAttribute('data-project');
        
        if (readAboutBtn) {
            readAboutBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openProjectDetails();
            });
        }
    });
    
    // Close project details
    if (closeProjectDetailsBtn) {
        closeProjectDetailsBtn.addEventListener('click', closeProjectDetails);
    }
    
    // Close buttons in project details
    const closeDetailsBtn = document.querySelector('.close-details-btn');
    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', closeProjectDetails);
    }
    
    // Keyboard navigation for project details
    document.addEventListener('keydown', (e) => {
        if (projectDetailsPopup && projectDetailsPopup.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeProjectDetails();
            }
        }
    });
    
    /**
     * Opens the project details popup
     */
    function openProjectDetails() {
        document.body.classList.add('no-scroll');
        projectDetailsPopup.classList.add('active');
        
        // Focus trap for accessibility
        setTimeout(() => {
            closeProjectDetailsBtn.focus();
        }, 100);
    }
    
    /**
     * Closes the project details popup
     */
    function closeProjectDetails() {
        document.body.classList.remove('no-scroll');
        projectDetailsPopup.classList.remove('active');
    }
    
    // Check if the page was loaded with a hash for direct project access
    if (window.location.hash) {
        const projectId = window.location.hash.substring(1);
        if (projectId === 'california') {
            // Wait for everything to load
            setTimeout(() => {
                openProjectDetails();
            }, 1000);
        }
    }
} 