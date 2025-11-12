// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');
const orderForm = document.getElementById('order-form');
const contactForm = document.getElementById('contact-form');
const newsletterForm = document.getElementById('newsletter-form');
const loadingScreen = document.getElementById('loading-screen');

// API Base URL
const API_BASE_URL = window.location.origin + '/api';

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    initializeLoadingScreen();
    
    // Initialize theme
    initializeTheme();
    
    // Initialize GSAP animations
    initializeGSAPAnimations();
    
    // Initialize navigation
    initializeSmoothScroll();
    
    // Initialize filter functionality
    initializeFilters();
    
    // Initialize testimonial slider
    initializeTestimonialSlider();
    
    // Initialize counter animations
    initializeCounters();
    
    // Event listeners
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (hamburger) hamburger.addEventListener('click', toggleMobileNav);
    if (orderForm) orderForm.addEventListener('submit', handleOrderFormSubmit);
    if (contactForm) contactForm.addEventListener('submit', handleContactFormSubmit);
    if (newsletterForm) newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    
    // Scroll event listeners
    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        updateActiveNavLink();
    });
    
    // Close mobile nav when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && hamburger && !navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
            closeMobileNav();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileNav();
        }
    });
});

// Loading Screen
function initializeLoadingScreen() {
    if (!loadingScreen) return;
    
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remove from DOM after transition
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.remove();
            }
        }, 500);
    }, 2000);
}

// GSAP Animations
function initializeGSAPAnimations() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.log('GSAP not loaded, skipping animations');
        return;
    }
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Hero title animation (already handled by CSS, but we can enhance)
    gsap.fromTo('.hero-description', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.9 }
    );

    gsap.fromTo('.hero-buttons', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 1.2 }
    );

    // Animate sections on scroll
    gsap.utils.toArray('.collection-card').forEach((card, index) => {
        gsap.fromTo(card, 
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    gsap.utils.toArray('.product-card').forEach((card, index) => {
        gsap.fromTo(card, 
            { opacity: 0, scale: 0.8 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // About section animation
    gsap.fromTo('.about-text', 
        { opacity: 0, x: -50 },
        {
            opacity: 1,
            x: 0,
            duration: 1,
            scrollTrigger: {
                trigger: '.about-text',
                start: 'top 70%',
                end: 'bottom 30%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.fromTo('.about-image', 
        { opacity: 0, x: 50 },
        {
            opacity: 1,
            x: 0,
            duration: 1,
            scrollTrigger: {
                trigger: '.about-image',
                start: 'top 70%',
                end: 'bottom 30%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Service features animation
    gsap.utils.toArray('.feature').forEach((feature, index) => {
        gsap.fromTo(feature, 
            { opacity: 0, x: -30 },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                delay: index * 0.2,
                scrollTrigger: {
                    trigger: feature,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
}

// Theme Management
function initializeTheme() {
    if (!themeToggle) return;
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeToggle(savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeToggle('dark');
    }
}

function updateThemeToggle(theme) {
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggle(newTheme);
}

// Mobile Navigation
function toggleMobileNav() {
    if (!hamburger || !navMenu) return;
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileNav() {
    if (!hamburger || !navMenu) return;
    
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// Navbar Scroll Effect
function handleNavbarScroll() {
    if (!navbar) return;
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Active Navigation Link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Smooth Scroll for Navigation Links
function initializeSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                closeMobileNav();
            }
        });
    });
}

// Filter Functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const collectionCards = document.querySelectorAll('.collection-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            collectionCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.remove('hidden');
                    if (typeof gsap !== 'undefined') {
                        gsap.to(card, { opacity: 1, scale: 1, duration: 0.3 });
                    }
                } else {
                    const categories = card.getAttribute('data-category').split(' ');
                    if (categories.includes(filterValue)) {
                        card.classList.remove('hidden');
                        if (typeof gsap !== 'undefined') {
                            gsap.to(card, { opacity: 1, scale: 1, duration: 0.3 });
                        }
                    } else {
                        card.classList.add('hidden');
                        if (typeof gsap !== 'undefined') {
                            gsap.to(card, { opacity: 0, scale: 0.8, duration: 0.3 });
                        }
                    }
                }
            });
        });
    });
}

// Testimonials Slider
let currentSlideIndex = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % testimonials.length;
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

function initializeTestimonialSlider() {
    if (testimonials.length === 0) return;
    
    // Auto-advance slides every 8 seconds
    setInterval(nextSlide, 8000);
    
    // Initialize first slide
    showSlide(0);
}

// Counter Animations
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const formatted = Math.floor(current).toLocaleString();
            counter.textContent = formatted;
        }, 20);
    };
    
    // Use Intersection Observer to trigger counters
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Form Validation Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function clearAllErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

// API Call Helper
async function submitFormData(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw new Error('Network error occurred. Please try again.');
    }
}

// Order Form Handling
async function handleOrderFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');
    
    // Clear previous errors
    clearAllErrors('order-form');
    
    let isValid = true;
    
    // Validate required fields
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const serviceType = formData.get('serviceType');
    const delivery = formData.get('delivery');
    
    if (!firstName || !firstName.trim()) {
        showError('firstName', 'First name is required');
        isValid = false;
    }
    
    if (!lastName || !lastName.trim()) {
        showError('lastName', 'Last name is required');
        isValid = false;
    }
    
    if (!email || !email.trim()) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!phone || !phone.trim()) {
        showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!validatePhone(phone)) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    if (!serviceType) {
        showError('serviceType', 'Please select a service type');
        isValid = false;
    }
    
    if (!delivery) {
        showError('delivery', 'Please select a delivery option');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Show loading state
    buttonText.style.display = 'none';
    buttonLoader.style.display = 'flex';
    submitButton.disabled = true;
    
    try {
        // Prepare form data for API
        const orderData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            serviceType,
            delivery,
            interests: formData.getAll('interests'),
            message: formData.get('message') || ''
        };
        
        // Submit to API
        const result = await submitFormData('/order', orderData);
        
        // Show success message
        alert(result.message || 'Thank you! Your booking request has been submitted. We will contact you within 24 hours to confirm your appointment.');
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Order submission error:', error);
        alert(error.message || 'An error occurred. Please try again.');
    } finally {
        // Reset button state
        buttonText.style.display = 'block';
        buttonLoader.style.display = 'none';
        submitButton.disabled = false;
    }
}

// Contact Form Handling
async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');
    
    // Clear previous errors
    clearAllErrors('contact-form');
    
    let isValid = true;
    
    // Validate required fields
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !name.trim()) {
        showError('contactName', 'Name is required');
        isValid = false;
    }
    
    if (!email || !email.trim()) {
        showError('contactEmail', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('contactEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!message || !message.trim()) {
        showError('contactMessage', 'Message is required');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Show loading state
    buttonText.style.display = 'none';
    buttonLoader.style.display = 'flex';
    submitButton.disabled = true;
    
    try {
        // Prepare form data for API
        const contactData = {
            name: name.trim(),
            email: email.trim(),
            subject: formData.get('subject') || '',
            message: message.trim()
        };
        
        // Submit to API
        const result = await submitFormData('/contact', contactData);
        
        // Show success message
        alert(result.message || 'Thank you for your message! We will get back to you within 24 hours.');
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Contact submission error:', error);
        alert(error.message || 'An error occurred. Please try again.');
    } finally {
        // Reset button state
        buttonText.style.display = 'block';
        buttonLoader.style.display = 'none';
        submitButton.disabled = false;
    }
}

// Newsletter Form Handling
async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const input = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = form.querySelector('.newsletter-success');
    
    const email = input.value.trim();
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Subscribing...';
    
    try {
        // Submit to API
        const result = await submitFormData('/newsletter', { email });
        
        // Show success message
        successMessage.style.display = 'flex';
        
        // Clear input
        input.value = '';
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
        
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        alert(error.message || 'An error occurred. Please try again.');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = 'Subscribe';
    }
}

// Product interaction handlers
document.addEventListener('click', (e) => {
    // Handle product quick view
    if (e.target.closest('.action-btn[title="Quick View"]')) {
        alert('Quick view functionality would open a modal with product details');
    }
    
    // Handle add to wishlist
    if (e.target.closest('.action-btn[title="Add to Wishlist"]')) {
        const button = e.target.closest('.action-btn');
        button.style.color = '#e74c3c';
        alert('Product added to wishlist!');
    }
    
    // Handle view details
    if (e.target.closest('.product-btn')) {
        alert('This would navigate to the product detail page');
    }
    
    // Handle collection view
    if (e.target.closest('.collection-overlay .btn')) {
        alert('This would navigate to the collection page');
    }
});

// Add smooth scrolling to all internal links
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

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        closeMobileNav();
    }
    
    // Arrow keys for testimonial navigation
    if (e.key === 'ArrowLeft') {
        currentSlideIndex = currentSlideIndex > 0 ? currentSlideIndex - 1 : testimonials.length - 1;
        showSlide(currentSlideIndex);
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Add focus management for accessibility
document.querySelectorAll('.btn, .nav-link, input, select, textarea').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--accent-color)';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading states to all buttons
document.querySelectorAll('.btn').forEach(button => {
    if (!button.type || button.type !== 'submit') {
        button.addEventListener('click', function(e) {
            // Add a subtle loading animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
});

// Make functions globally available for onclick handlers
window.currentSlide = currentSlide;

console.log('LUXE Fashion website initialized successfully!');
