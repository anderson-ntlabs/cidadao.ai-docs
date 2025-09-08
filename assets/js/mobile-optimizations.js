/* ===================================
   CIDADÃO.AI - MOBILE OPTIMIZATIONS JS
   Enhanced mobile experience and performance
   =================================== */

// Mobile optimization utilities
class MobileOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTouch = this.detectTouch();
        this.init();
    }

    // Detect mobile devices
    detectMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Detect touch devices
    detectTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // Initialize mobile optimizations
    init() {
        this.setupViewportHeight();
        this.optimizeScrolling();
        this.handleTouchInteractions();
        this.optimizeCarousel();
        this.setupMobileNavigation();
        this.preventZoom();
        this.setupSwipeGestures();
        this.optimizeModals();
        
        // Performance optimizations
        if (this.isMobile) {
            this.reducedAnimations();
            this.lazyLoadImages();
        }
    }

    // Fix viewport height issues on mobile
    setupViewportHeight() {
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', () => {
            setTimeout(setViewportHeight, 500);
        });
    }

    // Optimize scrolling for mobile
    optimizeScrolling() {
        // Smooth scrolling for iOS
        if (this.isMobile) {
            document.body.style.webkitOverflowScrolling = 'touch';
        }

        // Handle scroll performance
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateHeaderOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Update header behavior on scroll
    updateHeaderOnScroll() {
        const header = document.querySelector('.navbar');
        const scrollY = window.scrollY;
        
        if (this.isMobile && header) {
            if (scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    // Handle touch interactions
    handleTouchInteractions() {
        if (!this.isTouch) return;

        // Add touch feedback class
        document.body.classList.add('touch-device');

        // Remove hover effects on touch
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) and (pointer: coarse) {
                *:hover {
                    transform: none !important;
                    box-shadow: none !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Enhanced touch feedback
        this.addTouchFeedback();
    }

    // Add touch feedback to interactive elements
    addTouchFeedback() {
        const touchElements = document.querySelectorAll('button, a, .btn, .control-button');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touching');
            }, { passive: true });

            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('touching');
                }, 150);
            }, { passive: true });
        });
    }

    // Optimize carousel for mobile
    optimizeCarousel() {
        const carousel = document.querySelector('.agents-carousel-track');
        const container = document.querySelector('.agents-carousel-container');
        
        if (!carousel || !container || !this.isMobile) return;

        // Add touch scrolling to carousel
        let isScrolling = false;
        let startX = 0;
        let scrollLeft = 0;

        container.addEventListener('touchstart', (e) => {
            isScrolling = true;
            startX = e.touches[0].clientX;
            scrollLeft = container.scrollLeft;
            carousel.style.animationPlayState = 'paused';
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            
            const x = e.touches[0].clientX;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });

        container.addEventListener('touchend', () => {
            isScrolling = false;
            setTimeout(() => {
                carousel.style.animationPlayState = 'running';
            }, 2000);
        }, { passive: true });
    }

    // Setup mobile navigation
    setupMobileNavigation() {
        if (!this.isMobile) return;

        // Disabled - using header-mobile-first.js instead
        // this.createMobileMenu();
    }

    // Create mobile menu toggle
    createMobileMenu() {
        const navbar = document.querySelector('.navbar-container');
        const navControls = document.querySelector('.nav-controls');
        
        if (!navbar || !navControls) return;

        // Create hamburger menu
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.setAttribute('aria-label', 'Menu');
        menuToggle.innerHTML = '☰';
        
        // Add toggle functionality
        menuToggle.addEventListener('click', () => {
            navControls.classList.toggle('mobile-open');
            menuToggle.classList.toggle('active');
        });

        navbar.appendChild(menuToggle);
    }

    // Prevent double-tap zoom on buttons
    preventZoom() {
        const buttons = document.querySelectorAll('button, .btn, a');
        
        buttons.forEach(button => {
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.click();
            });
        });
    }

    // Setup swipe gestures
    setupSwipeGestures() {
        if (!this.isTouch) return;

        let touchStartX = null;
        let touchStartY = null;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;

            // Detect swipe direction
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        this.handleSwipeLeft();
                    } else {
                        this.handleSwipeRight();
                    }
                }
            }

            touchStartX = null;
            touchStartY = null;
        }, { passive: true });
    }

    // Handle swipe left gesture
    handleSwipeLeft() {
        // Close modal or navigate
        const modal = document.querySelector('.modal.active');
        if (modal) {
            this.closeModal(modal);
        }
    }

    // Handle swipe right gesture
    handleSwipeRight() {
        // Navigate back or open menu
        console.log('Swipe right detected');
    }

    // Optimize modals for mobile
    optimizeModals() {
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            const content = modal.querySelector('.modal-content');
            if (!content) return;

            // Prevent body scroll when modal is open
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        if (modal.classList.contains('active')) {
                            document.body.style.overflow = 'hidden';
                            if (this.isMobile) {
                                document.body.style.position = 'fixed';
                                document.body.style.width = '100%';
                            }
                        } else {
                            document.body.style.overflow = '';
                            document.body.style.position = '';
                            document.body.style.width = '';
                        }
                    }
                });
            });

            observer.observe(modal, { attributes: true });

            // Add pull-to-close for mobile
            if (this.isMobile) {
                this.addPullToClose(modal);
            }
        });
    }

    // Add pull-to-close functionality for modals
    addPullToClose(modal) {
        const content = modal.querySelector('.modal-content');
        if (!content) return;

        let startY = null;
        let currentY = null;
        let isPulling = false;

        content.addEventListener('touchstart', (e) => {
            if (content.scrollTop === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });

        content.addEventListener('touchmove', (e) => {
            if (!isPulling) return;

            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;

            if (deltaY > 0) {
                const opacity = Math.max(0.3, 1 - deltaY / 300);
                const scale = Math.max(0.9, 1 - deltaY / 1000);
                
                content.style.transform = `translateY(${deltaY / 3}px) scale(${scale})`;
                modal.style.backgroundColor = `rgba(0, 0, 0, ${opacity * 0.6})`;
            }
        }, { passive: true });

        content.addEventListener('touchend', () => {
            if (!isPulling) return;

            const deltaY = currentY - startY;
            
            if (deltaY > 100) {
                this.closeModal(modal);
            } else {
                // Snap back
                content.style.transform = '';
                modal.style.backgroundColor = '';
            }

            isPulling = false;
            startY = null;
            currentY = null;
        }, { passive: true });
    }

    // Close modal utility
    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }

    // Reduce animations on mobile for performance
    reducedAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                *, *::before, *::after {
                    animation-duration: 0.1s !important;
                    animation-delay: 0s !important;
                    transition-duration: 0.1s !important;
                    transition-delay: 0s !important;
                }
                
                .agents-carousel-track {
                    animation-duration: 30s !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Lazy load images for performance
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // Add CSS for touch feedback
    addTouchStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .touching {
                opacity: 0.7 !important;
                transform: scale(0.98) !important;
            }
            
            .mobile-menu-toggle {
                display: none;
                background: none;
                border: none;
                font-size: 1.25rem;
                color: var(--text-primary);
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 4px;
            }
            
            @media (max-width: 768px) {
                .mobile-menu-toggle {
                    display: block;
                }
                
                .nav-controls {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: var(--bg-primary);
                    border-top: 1px solid var(--border);
                    padding: 1rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .nav-controls.mobile-open {
                    display: flex;
                }
                
                .navbar.scrolled {
                    padding: 0.5rem 0.75rem;
                    backdrop-filter: blur(12px);
                }
                
                .navbar.scrolled .logo-icon {
                    width: 32px;
                    height: 32px;
                }
                
                .navbar.scrolled .logo-text {
                    font-size: 1.1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Network-aware optimizations
class NetworkOptimizer {
    constructor() {
        this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        this.init();
    }

    init() {
        this.detectConnection();
        this.setupConnectionListener();
    }

    detectConnection() {
        if (!this.connection) return;

        const { effectiveType, downlink, saveData } = this.connection;

        // Optimize for slow connections
        if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1.5 || saveData) {
            this.enableDataSaver();
        }
    }

    enableDataSaver() {
        document.body.classList.add('data-saver');
        
        // Add data saver styles
        const style = document.createElement('style');
        style.textContent = `
            .data-saver .hero::before,
            .data-saver body::before {
                display: none !important;
            }
            
            .data-saver .agents-carousel-track {
                animation: none !important;
            }
            
            .data-saver img {
                filter: blur(1px);
                transition: filter 0.3s ease;
            }
            
            .data-saver img:hover,
            .data-saver img:focus {
                filter: none;
            }
        `;
        document.head.appendChild(style);
    }

    setupConnectionListener() {
        if (!this.connection) return;

        this.connection.addEventListener('change', () => {
            this.detectConnection();
        });
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        if ('performance' in window) {
            this.measurePageLoad();
            this.measureLCP();
            this.measureFID();
        }
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Optimize if load time is too high
            if (loadTime > 3000) {
                this.enablePerformanceMode();
            }
        });
    }

    measureLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });

            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    measureFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });

            observer.observe({ entryTypes: ['first-input'] });
        }
    }

    enablePerformanceMode() {
        document.body.classList.add('performance-mode');
        console.log('Performance mode enabled due to slow loading');
    }
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all optimizers
    const mobileOptimizer = new MobileOptimizer();
    const networkOptimizer = new NetworkOptimizer();
    const performanceMonitor = new PerformanceMonitor();
    
    // Add touch styles
    mobileOptimizer.addTouchStyles();
    
    console.log('Mobile optimizations loaded');
});

// Export for use in other scripts
window.MobileOptimizer = MobileOptimizer;