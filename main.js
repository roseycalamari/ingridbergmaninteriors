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
    
    // Add click handler for project card
    card.addEventListener('click', () => {
        // Add smooth transition effect
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
            // Open project details or navigate to project page
            window.location.href = project.url || '#';
        }, 150);
    });
    
    // Add hover effect for the button
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
    
    cover.appendChild(img);
    info.appendChild(title);
    info.appendChild(location);
    info.appendChild(button);
    card.appendChild(cover);
    card.appendChild(info);
    
    return card;
}

function initializePortfolioAndTeam() {
    const projects = [
        {
            image: 'images/projects/luxury-penthouse.jpg',
            title: 'Luxury Penthouse',
            location: 'New York, NY',
            url: '#'
        },
        {
            image: 'images/projects/coastal-retreat.jpg',
            title: 'Coastal Retreat',
            location: 'Malibu, CA',
            url: '#'
        },
        {
            image: 'images/projects/mountain-lodge.jpg',
            title: 'Mountain Lodge',
            location: 'Aspen, CO',
            url: '#'
        },
        {
            image: 'images/projects/urban-loft.jpg',
            title: 'Urban Loft',
            location: 'Chicago, IL',
            url: '#'
        },
        {
            image: 'images/projects/country-estate.jpg',
            title: 'Country Estate',
            location: 'Napa Valley, CA',
            url: '#'
        },
        {
            image: 'images/projects/boutique-hotel.jpg',
            title: 'Boutique Hotel',
            location: 'Miami, FL',
            url: '#'
        }
    ];
    
    const container = document.querySelector('.project-cards-container');
    if (container) {
        // Clear existing content
        container.innerHTML = '';
        
        // Add fade-in animation for each card
        projects.forEach((project, index) => {
            const card = createProjectCard(project);
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            container.appendChild(card);
            
            // Stagger the animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }

    // Add click handlers for view project buttons
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click event
            const projectId = btn.getAttribute('data-project');
            openProjectDetail(projectId);
        });
    });
}

function openProjectDetail(projectId) {
    const popup = document.querySelector('.project-detail-popup');
    const popupBackground = document.querySelector('.project-popup-background');
    const closeBtn = document.querySelector('.close-project-detail');
    
    if (popup && popupBackground && closeBtn) {
        // Show the popup
        popup.classList.add('active');
        popupBackground.classList.add('active');
        document.body.classList.add('no-scroll');
        
        // Initialize carousel
        initializeProjectCarousel(projectId);
        
        // Add click handler for close button
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('active');
            popupBackground.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        
        // Close when clicking outside
        popupBackground.addEventListener('click', () => {
            popup.classList.remove('active');
            popupBackground.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        
        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                popup.classList.remove('active');
                popupBackground.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
}

function initializeProjectCarousel(projectId) {
    // Get carousel elements
    const mainImage = document.querySelector('.carousel-main-image');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    // Get project images (in a real project, these would be loaded from an API or data attribute)
    const projectImages = getProjectImages(projectId);
    
    let currentIndex = 0;
    
    // Update the carousel to show the current image
    function updateCarousel() {
        if (mainImage && projectImages && projectImages.length > 0) {
            mainImage.src = projectImages[currentIndex];
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
    }
    
    // Set up navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = projectImages.length - 1;
            }
            updateCarousel();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentIndex < projectImages.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        });
    }
    
    // Set up indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Initialize carousel
    updateCarousel();
}

// Helper function to get project images
function getProjectImages(projectId) {
    // This would typically fetch images from data attributes or an API
    // For now, returning sample images
    const defaultImages = [
        'img/projects/project1-1.jpg',
        'img/projects/project1-2.jpg',
        'img/projects/project1-3.jpg'
    ];
    
    // Add more project-specific image sets as needed
    const projectImages = {
        'project1': [
            'img/projects/project1-1.jpg',
            'img/projects/project1-2.jpg',
            'img/projects/project1-3.jpg'
        ],
        'project2': [
            'img/projects/project2-1.jpg',
            'img/projects/project2-2.jpg',
            'img/projects/project2-3.jpg'
        ]
        // Add more projects as needed
    };
    
    return projectImages[projectId] || defaultImages;
}

// Initialize Scroll Indicators with smooth scrolling
function initializeScrollIndicators() {
    const panels = document.querySelectorAll('.mobile-fullscreen-panel');
    const scrollDots = document.querySelectorAll('.scroll-dot');
    const homeSection = document.getElementById('home');
    
    // Force check the visible panel immediately on page load
    function checkVisiblePanelOnLoad() {
        // Short delay to ensure DOM is ready
        setTimeout(() => {
            // Find which panel is currently in view
            panels.forEach((panel, index) => {
                const rect = panel.getBoundingClientRect();
                // If panel is in viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    // Update active dot
                    scrollDots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                }
            });
        }, 100);
    }
    
    // Call on page load
    checkVisiblePanelOnLoad();
    
    // Manual scroll detection (works alongside IntersectionObserver)
    function checkVisiblePanelOnScroll() {
        // Find which panel is most visible
        let mostVisiblePanel = null;
        let maxVisibleArea = 0;
        
        panels.forEach((panel) => {
            const rect = panel.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            const visibleArea = Math.max(0, visibleHeight) / panel.offsetHeight;
            
            if (visibleArea > maxVisibleArea) {
                maxVisibleArea = visibleArea;
                mostVisiblePanel = panel;
            }
        });
        
        if (mostVisiblePanel) {
            const index = Array.from(panels).indexOf(mostVisiblePanel);
            // Update active dot
            scrollDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    }
    
    // Add scroll event listener to detect natural scrolling
    if (homeSection) {
        homeSection.addEventListener('scroll', checkVisiblePanelOnScroll, { passive: true });
        // Also add to window for backup
        window.addEventListener('scroll', checkVisiblePanelOnScroll, { passive: true });
    }
    
    // Use IntersectionObserver for better performance
    if ('IntersectionObserver' in window && panels.length > 0) {
        const options = {
            root: homeSection,
            rootMargin: '-10% 0px -10% 0px', // Adjusted for better accuracy
            threshold: [0.3, 0.6, 0.9] // Multiple thresholds for more responsive updates
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Find the index of the visible panel
                    const visiblePanelIndex = Array.from(panels).indexOf(entry.target);
                    
                    // Update the active dot
                    scrollDots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === visiblePanelIndex);
                    });
                    
                    // Update URL hash for deep linking (optional)
                    const sectionId = entry.target.id;
                    if (sectionId) {
                        history.replaceState(null, null, '#' + sectionId);
                    }
                }
            });
        }, options);
        
        // Observe all panels
        panels.forEach(panel => {
            observer.observe(panel);
        });
    }
    
    // Enable smooth scrolling with momentum effect
    let isScrolling = false;
    
    // Add click event to scroll dots
    scrollDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (isScrolling) return; // Prevent multiple scrolls
            
            const targetId = dot.getAttribute('data-section');
            const targetPanel = document.getElementById(targetId);
            
            if (targetPanel) {
                isScrolling = true;
                
                // Update active dot immediately for better UX
                scrollDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // Smoothly scroll to the target panel
                targetPanel.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start'
                });
                
                // Reset isScrolling after animation completes
                setTimeout(() => {
                    isScrolling = false;
                }, 800);
            }
        });
    });
    
    // Add swipe navigation for touch devices
    if (homeSection && 'ontouchstart' in window) {
        let touchStartY = 0;
        let touchEndY = 0;
        let currentPanelIndex = 0;
        
        homeSection.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        homeSection.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            if (isScrolling) return;
            
            const swipeDistance = touchStartY - touchEndY;
            const threshold = 50; // Minimum swipe distance
            
            // Find current panel
            panels.forEach((panel, index) => {
                const rect = panel.getBoundingClientRect();
                if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                    currentPanelIndex = index;
                }
            });
            
            if (Math.abs(swipeDistance) > threshold) {
                isScrolling = true;
                
                // Swipe down -> previous panel
                if (swipeDistance < 0 && currentPanelIndex > 0) {
                    scrollToPanel(currentPanelIndex - 1);
                }
                // Swipe up -> next panel
                else if (swipeDistance > 0 && currentPanelIndex < panels.length - 1) {
                    scrollToPanel(currentPanelIndex + 1);
                }
                
                setTimeout(() => {
                    isScrolling = false;
                }, 800);
            }
        }
        
        function scrollToPanel(index) {
            if (panels[index]) {
                // Update active dot
                scrollDots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
                
                // Scroll to panel
                panels[index].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start'
                });
            }
        }
    }
}

// Initialize Panel Details with enhanced animations
function initializeDetailPanels() {
    const panelButtons = document.querySelectorAll('.panel-button');
    const closeButtons = document.querySelectorAll('.close-detail');
    const detailContainers = document.querySelectorAll('.detail-container');
    
    // Add click event to panel buttons with enhanced animation
    panelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetDetail = document.getElementById(targetId);
            
            if (targetDetail) {
                // Add button animation
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 200);
                
                // Open detail panel with smooth animation
                targetDetail.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });
    
    // Add click event to close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            const detailContainer = button.closest('.detail-container');
            
            if (detailContainer) {
                // Close the detail panel
                detailContainer.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
    
    // Close when clicking outside of content (for specific areas)
    detailContainers.forEach(container => {
        container.addEventListener('click', (e) => {
            // Only close if clicking directly on the container background
            if (e.target === container) {
                container.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeDetail = document.querySelector('.detail-container.active');
            if (activeDetail) {
                activeDetail.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        }
    });
}

// Update initialization in DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll indicators for desktop version
    initializeScrollIndicators();
    
    // Initialize detail panels
    initializeDetailPanels();
});

// Gallery and project modals functionality
document.addEventListener('DOMContentLoaded', function() {
    // Project Info Button
    const projectInfoBtn = document.getElementById('projectInfoBtn');
    const projectDescriptionModal = document.getElementById('projectDescriptionModal');
    const closeProjectDescriptionBtn = document.getElementById('closeProjectDescriptionBtn');
    
    // Project description modal
    if (projectInfoBtn && projectDescriptionModal) {
        // Open project description modal
        projectInfoBtn.addEventListener('click', function() {
            projectDescriptionModal.classList.add('active');
            document.body.classList.add('no-scroll');
        });
        
        // Close project description modal
        closeProjectDescriptionBtn.addEventListener('click', function() {
            projectDescriptionModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Return home buttons functionality
    const returnButtons = document.querySelectorAll('.service-back-home-btn, .about-back-home-btn, .brands-back-home-btn');
    returnButtons.forEach(button => {
        button.addEventListener('click', function() {
            const detailContainer = this.closest('.detail-container');
            if (detailContainer) {
                detailContainer.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
}); 