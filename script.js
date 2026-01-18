// Language Toggle Functionality
class LanguageManager {
    constructor() {
        this.currentLang = 'ar';
        this.init();
    }

    init() {
        this.langToggleBtn = document.getElementById('langToggle');
        this.setupEventListeners();
        this.setLanguage(this.currentLang);
    }

    setupEventListeners() {
        this.langToggleBtn.addEventListener('click', () => {
            this.toggleLanguage();
        });
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
        this.setLanguage(this.currentLang);
    }

    setLanguage(lang) {
        const html = document.documentElement;
        html.setAttribute('lang', lang);
        
        // Update all elements with data attributes
        const elements = document.querySelectorAll('[data-ar][data-en]');
        elements.forEach(element => {
            if (element.tagName.toLowerCase() === 'input' && element.type === 'text') {
                element.placeholder = element.getAttribute(`data-${lang}`);
            } else if (element.tagName.toLowerCase() === 'option') {
                element.textContent = element.getAttribute(`data-${lang}`);
            } else {
                element.textContent = element.getAttribute(`data-${lang}`);
            }
        });

        // Update placeholders specifically
        this.updatePlaceholders(lang);
        
        // Save language preference
        localStorage.setItem('preferred-language', lang);
    }

    updatePlaceholders(lang) {
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const guestsSelect = document.getElementById('guests');
        const timeSelect = document.getElementById('time');

        if (nameInput) {
            nameInput.placeholder = lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name';
        }
        
        if (phoneInput) {
            phoneInput.placeholder = lang === 'ar' ? '05xxxxxxxx' : '05xxxxxxxx';
        }

        // Update select options
        if (guestsSelect) {
            const guestsOptions = guestsSelect.querySelectorAll('option');
            guestsOptions.forEach(option => {
                if (option.getAttribute('data-ar') && option.getAttribute('data-en')) {
                    option.textContent = option.getAttribute(`data-${lang}`);
                }
            });
        }

        if (timeSelect) {
            const timeOptions = timeSelect.querySelectorAll('option');
            timeOptions.forEach(option => {
                if (option.getAttribute('data-ar') && option.getAttribute('data-en')) {
                    option.textContent = option.getAttribute(`data-${lang}`);
                }
            });
        }
    }

    // Load saved language preference
    loadSavedLanguage() {
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
            this.currentLang = savedLang;
            this.setLanguage(this.currentLang);
        }
    }
}

// Mobile Menu Functionality
class MobileMenu {
    constructor() {
        this.init();
    }

    init() {
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.nav = document.getElementById('nav');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.mobileMenuBtn.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close menu when clicking on nav links
        const navLinks = this.nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.mobileMenuBtn.contains(e.target) && !this.nav.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.mobileMenuBtn.classList.toggle('active');
        this.nav.classList.toggle('active');
    }

    closeMenu() {
        this.mobileMenuBtn.classList.remove('active');
        this.nav.classList.remove('active');
    }
}

// Smooth Scroll Functionality
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Reservation Form Functionality
class ReservationForm {
    constructor() {
        this.init();
    }

    init() {
        this.form = document.getElementById('reservationForm');
        this.setupEventListeners();
        this.setMinDate();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            this.handleSubmit(e);
        });
    }

    setMinDate() {
        const dateInput = document.getElementById('date');
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const minDate = tomorrow.toISOString().split('T')[0];
        dateInput.setAttribute('min', minDate);
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Basic validation
        if (!this.validateForm(data)) {
            return;
        }

        // Show success message
        this.showSuccessMessage();
        
        // Reset form
        this.form.reset();
    }

    validateForm(data) {
        const requiredFields = ['name', 'phone', 'guests', 'date', 'time'];
        
        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                this.showErrorMessage(`الرجاء ملء جميع الحقول المطلوبة`);
                return false;
            }
        }

        // Validate phone number (basic Saudi format)
        const phoneRegex = /^05\d{8}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            this.showErrorMessage(`الرجاء إدخال رقم هاتف صحيح`);
            return false;
        }

        return true;
    }

    showSuccessMessage() {
        const currentLang = document.documentElement.getAttribute('lang');
        const message = currentLang === 'ar' ? 
            'تم إرسال طلب الحجز بنجاح! سنتواصل معكم قريباً.' :
            'Reservation request sent successfully! We will contact you soon.';
        
        alert(message);
    }

    showErrorMessage(message) {
        alert(message);
    }
}

// Scroll Animation Functionality
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.observeElements();
    }

    observeElements() {
        const elements = document.querySelectorAll('.menu-item, .feature-card, .testimonial-card, .about-feature');
        elements.forEach(el => this.observer.observe(el));
    }
}

// Header Scroll Effect
class HeaderScrollEffect {
    constructor() {
        this.init();
    }

    init() {
        this.header = document.getElementById('header');
        this.setupScrollListener();
    }

    setupScrollListener() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                this.header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                this.header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Loading Animation
class LoadingAnimation {
    constructor() {
        this.init();
    }

    init() {
        // Add loading class to body
        document.body.classList.add('loading');
        
        window.addEventListener('load', () => {
            document.body.classList.remove('loading');
            this.animateElements();
        });
    }

    animateElements() {
        const heroElements = document.querySelectorAll('.hero-text > *');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('fade-in-up');
            }, index * 200);
        });
    }
}

// Responsive Image Loading
class ResponsiveImages {
    constructor() {
        this.init();
    }

    init() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            
            img.addEventListener('error', () => {
                img.classList.add('error');
                // Fallback image or placeholder
            });
        });
    }
}

// Menu Filter (if needed for larger menus)
class MenuFilter {
    constructor() {
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        // This can be extended for menu filtering functionality
        this.setupFilters();
    }

    setupFilters() {
        // Add filter buttons if needed
        // Implementation for filtering menu items by category
    }
}

// Form Validation Enhancement
class FormValidation {
    constructor() {
        this.init();
    }

    init() {
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        
        // Remove existing error styling
        this.clearFieldError(field);
        
        // Validation rules
        switch(fieldName) {
            case 'name':
                if (value.length < 2) {
                    this.showFieldError(field, 'الاسم قصير جداً');
                }
                break;
            case 'phone':
                const phoneRegex = /^05\d{8}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    this.showFieldError(field, 'رقم الهاتف غير صحيح');
                }
                break;
        }
    }

    showFieldError(field, message) {
        field.style.borderColor = '#d4183d';
        
        // Create or update error message
        let errorMsg = field.parentNode.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.color = '#d4183d';
            errorMsg.style.fontSize = '0.8rem';
            errorMsg.style.marginTop = '0.5rem';
            field.parentNode.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const errorMsg = field.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
}

// Initialize all modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    const languageManager = new LanguageManager();
    const mobileMenu = new MobileMenu();
    const smoothScroll = new SmoothScroll();
    const reservationForm = new ReservationForm();
    const scrollAnimations = new ScrollAnimations();
    const headerScrollEffect = new HeaderScrollEffect();
    const loadingAnimation = new LoadingAnimation();
    const responsiveImages = new ResponsiveImages();
    const formValidation = new FormValidation();

    // Load saved language preference
    languageManager.loadSavedLanguage();

    // Add smooth scrolling for all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add click handlers for CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-btn, .btn-gold');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add menu button click handler
    const menuButtons = document.querySelectorAll('.btn-primary');
    menuButtons.forEach(btn => {
        if (btn.textContent.includes('قائمت') || btn.textContent.includes('Menu')) {
            btn.addEventListener('click', () => {
                document.querySelector('#menu').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.menu-item, .feature-card, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add loading states for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', () => {
                img.style.opacity = '1';
                img.style.transition = 'opacity 0.3s ease';
            });
        }
    });

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.menu-item, .feature-card, .testimonial-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.transform = 'translateY(-5px)';
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translateY(0)';
        });
    });

    // Console welcome message
    console.log('🏠 مرحباً بكم في موقع مطعم بيتي! Welcome to Bayti Restaurant website!');
});

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add custom events for analytics (optional)
class Analytics {
    static trackEvent(eventName, eventData = {}) {
        // This can be connected to Google Analytics or other analytics services
        console.log('Event tracked:', eventName, eventData);
    }
}

// Export classes for potential external use
window.BaytiWebsite = {
    LanguageManager,
    MobileMenu,
    ReservationForm,
    Analytics
};