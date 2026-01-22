/**
 * Contact Page Functionality
 * Handles form validation, submission, and interactive elements
 * Uses modern techniques for optimal user experience
 */

document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formResponse = document.getElementById('formResponse');
    const inputFields = contactForm ? contactForm.querySelectorAll('.form-control') : [];
    const formCheckbox = document.getElementById('privacy');
    
    // Success and error messages
    const messages = {
        success: 'Thank you for your message. We will be in touch shortly.',
        error: 'There was an error sending your message. Please try again.',
        incomplete: 'Please fill in all required fields correctly.',
        invalidEmail: 'Please enter a valid email address.',
        sending: 'Sending your message...'
    };
    
    /**
     * Detect browser form validation support
     * @returns {boolean} Whether the browser supports form validation
     */
    const supportsValidation = () => {
        return typeof document.createElement('input').checkValidity === 'function';
    };
    
    /**
     * Validate an email address
     * @param {string} email - Email to validate
     * @returns {boolean} Whether the email is valid
     */
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    /**
     * Display feedback for a form field
     * @param {HTMLElement} field - Form field
     * @param {boolean} isValid - Whether the field is valid
     * @param {string} message - Feedback message
     */
    const showFieldFeedback = (field, isValid, message = '') => {
        const feedbackEl = field.nextElementSibling;
        if (!feedbackEl || !feedbackEl.classList.contains('form-feedback')) return;
        
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            feedbackEl.textContent = '';
            feedbackEl.classList.remove('error-feedback');
            feedbackEl.classList.add('success-feedback');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            feedbackEl.textContent = message;
            feedbackEl.classList.remove('success-feedback');
            feedbackEl.classList.add('error-feedback');
        }
    };
    
    /**
     * Reset form fields and feedback
     */
    const resetForm = () => {
        if (!contactForm) return;
        
        contactForm.reset();
        
        inputFields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
            const feedbackEl = field.nextElementSibling;
            if (feedbackEl && feedbackEl.classList.contains('form-feedback')) {
                feedbackEl.textContent = '';
                feedbackEl.classList.remove('error-feedback', 'success-feedback');
            }
        });
        
        formResponse.textContent = '';
        formResponse.classList.remove('success-message', 'error-message');
    };
    
    /**
     * Validate the form
     * @returns {boolean} Whether the form is valid
     */
    const validateForm = () => {
        if (!contactForm) return false;
        
        let isValid = true;
        
        // Validate required fields
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');
        
        if (!nameField.value.trim()) {
            showFieldFeedback(nameField, false, 'Please enter your name');
            isValid = false;
        } else {
            showFieldFeedback(nameField, true);
        }
        
        if (!emailField.value.trim()) {
            showFieldFeedback(emailField, false, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(emailField.value.trim())) {
            showFieldFeedback(emailField, false, messages.invalidEmail);
            isValid = false;
        } else {
            showFieldFeedback(emailField, true);
        }
        
        if (!messageField.value.trim()) {
            showFieldFeedback(messageField, false, 'Please enter your message');
            isValid = false;
        } else {
            showFieldFeedback(messageField, true);
        }
        
        // Validate checkbox
        if (formCheckbox && !formCheckbox.checked) {
            const feedbackEl = formCheckbox.parentElement.querySelector('.form-feedback');
            if (feedbackEl) {
                feedbackEl.textContent = 'Please agree to the privacy policy';
                feedbackEl.classList.add('error-feedback');
            }
            isValid = false;
        } else if (formCheckbox) {
            const feedbackEl = formCheckbox.parentElement.querySelector('.form-feedback');
            if (feedbackEl) {
                feedbackEl.textContent = '';
                feedbackEl.classList.remove('error-feedback');
            }
        }
        
        return isValid;
    };
    
    /**
     * Show form response message
     * @param {string} message - Message to show
     * @param {string} type - Message type ('success' or 'error')
     */
    const showFormResponse = (message, type = 'success') => {
        if (!formResponse) return;
        
        formResponse.textContent = message;
        formResponse.classList.remove('success-message', 'error-message');
        formResponse.classList.add(`${type}-message`);
        
        // Ensure the response is visible
        formResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
    
    /**
     * Set button state during form submission
     * @param {boolean} isLoading - Whether the form is being submitted
     */
    const setButtonState = (isLoading) => {
        if (!submitBtn) return;
        
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.style.opacity = '0';
            btnLoader.style.display = 'inline-block';
        } else {
            submitBtn.disabled = false;
            btnText.style.opacity = '1';
            btnLoader.style.display = 'none';
        }
    };
    
    /**
     * Handle form submission
     * @param {Event} e - Form submission event
     */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        // Validate form
        const isValid = validateForm();
        
        if (!isValid) {
            showFormResponse(messages.incomplete, 'error');
            return;
        }
        
        // Show loading state
        setButtonState(true);
        showFormResponse(messages.sending);
        
        // Simulate form submission (replace with actual AJAX submission)
        setTimeout(() => {
            // Simulate successful submission (90% of the time)
            const isSuccess = Math.random() < 0.9;
            
            if (isSuccess) {
                showFormResponse(messages.success, 'success');
                resetForm();
            } else {
                showFormResponse(messages.error, 'error');
            }
            
            // Reset button state
            setButtonState(false);
        }, 1500);
        
        /* 
        // Real implementation would be:
        fetch('your-form-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            showFormResponse(messages.success, 'success');
            resetForm();
        })
        .catch(error => {
            showFormResponse(messages.error, 'error');
            console.error('Error:', error);
        })
        .finally(() => {
            setButtonState(false);
        });
        */
    };
    
    /**
     * Add real-time validation to input fields
     */
    const setupRealTimeValidation = () => {
        if (!supportsValidation() || !contactForm) return;
        
        inputFields.forEach(field => {
            field.addEventListener('blur', () => {
                // Skip if field is empty and not required
                if (!field.value && !field.hasAttribute('required')) return;
                
                if (field.id === 'email' && field.value) {
                    // Validate email format
                    showFieldFeedback(field, isValidEmail(field.value), messages.invalidEmail);
                } else {
                    // Check if field meets its validation criteria
                    showFieldFeedback(field, field.checkValidity(), field.validationMessage);
                }
            });
            
            // Clear error on input
            field.addEventListener('input', () => {
                if (field.classList.contains('is-invalid')) {
                    field.classList.remove('is-invalid');
                    const feedbackEl = field.nextElementSibling;
                    if (feedbackEl && feedbackEl.classList.contains('form-feedback')) {
                        feedbackEl.textContent = '';
                        feedbackEl.classList.remove('error-feedback');
                    }
                }
            });
        });
    };
    
    /**
     * Add floating labels behavior
     */
    const setupFloatingLabels = () => {
        inputFields.forEach(field => {
            // Initial state check
            if (field.value) {
                field.classList.add('has-value');
            }
            
            // Update on input
            field.addEventListener('input', () => {
                if (field.value) {
                    field.classList.add('has-value');
                } else {
                    field.classList.remove('has-value');
                }
            });
        });
    };
    
    /**
     * Setup privacy policy modal
     */
    const setupPrivacyModal = () => {
        const privacyLink = document.querySelector('.privacy-link');
        
        if (!privacyLink) return;
        
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create modal if it doesn't exist
            let modal = document.getElementById('privacyModal');
            
            if (!modal) {
                // Create modal elements
                modal = document.createElement('div');
                modal.id = 'privacyModal';
                modal.className = 'modal-overlay';
                
                const modalContent = document.createElement('div');
                modalContent.className = 'modal-content';
                
                const closeBtn = document.createElement('button');
                closeBtn.className = 'modal-close';
                closeBtn.innerHTML = '<div class="close-icon"></div>';
                
                const modalHeader = document.createElement('h3');
                modalHeader.textContent = 'Privacy Policy';
                
                const modalBody = document.createElement('div');
                modalBody.className = 'modal-body';
                modalBody.innerHTML = `
                    <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our site.</p>
                    
                    <h4>Personal information we collect</h4>
                    <p>When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>
                    
                    <h4>How we use your personal information</h4>
                    <p>We use the information we collect to communicate with you and to improve our services. We may also share your Personal Information to comply with applicable laws and regulations.</p>
                    
                    <h4>Data retention</h4>
                    <p>We will maintain your information for our records unless and until you ask us to delete this information.</p>
                `;
                
                modalContent.appendChild(closeBtn);
                modalContent.appendChild(modalHeader);
                modalContent.appendChild(modalBody);
                modal.appendChild(modalContent);
                
                document.body.appendChild(modal);
                
                // Add close functionality
                closeBtn.addEventListener('click', () => {
                    closeModal();
                });
                
                // Close when clicking outside
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeModal();
                    }
                });
                
                // Close on escape key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && modal.classList.contains('active')) {
                        closeModal();
                    }
                });
            }
            
            // Open modal
            document.body.classList.add('no-scroll');
            modal.classList.add('active');
            
            // Function to close modal
            function closeModal() {
                modal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    };
    
    /**
     * Add custom styling for success and error states
     */
    const addFormStyles = () => {
        // Only add if not already present
        if (document.getElementById('contactFormStyles')) return;
        
        const styleEl = document.createElement('style');
        styleEl.id = 'contactFormStyles';
        styleEl.textContent = `
            .form-control {
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
            }
            
            .form-control:focus {
                border-color: var(--color-tertiary);
                box-shadow: 0 0 0 3px rgba(209, 202, 188, 0.2);
            }
            
            .form-control.is-valid {
                border-color: rgba(209, 202, 188, 0.5);
                background-color: rgba(209, 202, 188, 0.05);
            }
            
            .form-control.is-invalid {
                border-color: rgba(220, 53, 69, 0.5);
                background-color: rgba(220, 53, 69, 0.05);
            }
            
            .form-feedback {
                font-size: 0.85rem;
                margin-top: 0.25rem;
                min-height: 1.5em;
                transition: all 0.3s ease;
            }
            
            .error-feedback {
                color: rgba(220, 53, 69, 0.9);
            }
            
            .success-feedback {
                color: rgba(209, 202, 188, 0.9);
            }
            
            .form-response {
                padding: 1rem;
                margin-top: 1.5rem;
                border-radius: var(--radius-medium);
                font-size: 0.95rem;
                transition: all 0.3s ease;
                min-height: 3.5rem;
            }
            
            .success-message {
                background-color: rgba(209, 202, 188, 0.1);
                color: rgba(209, 202, 188, 1);
                border-left: 3px solid var(--color-tertiary);
            }
            
            .error-message {
                background-color: rgba(220, 53, 69, 0.1);
                color: rgba(220, 53, 69, 0.9);
                border-left: 3px solid rgba(220, 53, 69, 0.7);
            }
            
            .form-check {
                display: flex;
                align-items: flex-start;
                margin-bottom: 1.5rem;
            }
            
            .form-check-input {
                margin-top: 0.3rem;
                margin-right: 0.75rem;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                width: 1.25rem;
                height: 1.25rem;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 0.25rem;
                background-color: rgba(255, 255, 255, 0.05);
                cursor: pointer;
                position: relative;
            }
            
            .form-check-input:checked {
                background-color: var(--color-tertiary);
                border-color: var(--color-tertiary);
            }
            
            .form-check-input:checked::after {
                content: '';
                position: absolute;
                top: 0.25rem;
                left: 0.45rem;
                width: 0.3rem;
                height: 0.6rem;
                border: solid var(--color-dark);
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }
            
            .form-check-label {
                color: var(--color-light);
                cursor: pointer;
                user-select: none;
            }
            
            .privacy-link {
                color: var(--color-tertiary);
                text-decoration: underline;
                transition: color 0.3s ease;
            }
            
            .privacy-link:hover {
                color: var(--color-background);
            }
            
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                z-index: var(--z-modal);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.4s ease, visibility 0.4s ease;
            }
            
            .modal-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-content {
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                background-color: rgba(253, 253, 253, 0.05);
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                border-radius: var(--radius-large);
                padding: 2.5rem;
                color: var(--color-background);
                box-shadow: var(--shadow-strong);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transform: translateY(30px);
                opacity: 0;
                transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1),
                            opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1);
                position: relative;
                overflow: auto;
            }
            
            .modal-overlay.active .modal-content {
                transform: translateY(0);
                opacity: 1;
            }
            
            .modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                border-radius: var(--radius-circle);
                background-color: rgba(255, 255, 255, 0.1);
                color: var(--nav-text);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border: none;
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .modal-close:hover {
                background-color: var(--color-tertiary);
                transform: rotate(90deg);
                color: var(--color-dark);
            }
            
            .modal-body {
                margin-top: 1.5rem;
            }
            
            .modal-body h4 {
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
                color: var(--color-tertiary);
            }
            
            .btn-loader {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            
            .btn-text {
                transition: opacity 0.3s ease;
            }
            
            #submitBtn:disabled {
                opacity: 0.7;
                cursor: wait;
            }
            
            @media (max-width: 576px) {
                .modal-content {
                    padding: 2rem 1.5rem;
                }
            }
            
            /* Improve the form look on Firefox */
            @-moz-document url-prefix() {
                .form-control {
                    background-color: rgba(255, 255, 255, 0.03);
                }
            }
        `;
        
        document.head.appendChild(styleEl);
    };
    
    /**
     * Initialize all contact page functionality
     */
    const initContactPage = () => {
        if (!contactForm) return;
        
        // Add styles
        addFormStyles();
        
        // Set up form validation and submission
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Set up real-time validation
        setupRealTimeValidation();
        
        // Set up floating labels
        setupFloatingLabels();
        
        // Set up privacy modal
        setupPrivacyModal();
    };
    
    // Initialize contact page
    initContactPage();
});