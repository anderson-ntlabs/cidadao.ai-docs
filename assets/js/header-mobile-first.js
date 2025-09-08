/**
 * Header Mobile-First Handler
 * Clean, modern implementation for Cidadão.AI header
 */

class HeaderController {
    constructor() {
        this.elements = {
            header: document.querySelector('.site-header'),
            menuToggle: document.querySelector('.menu-toggle'),
            navMenu: document.querySelector('.nav-menu'),
            themeToggle: document.querySelector('.theme-toggle'),
            langToggle: document.querySelector('.lang-toggle'),
            body: document.body
        };
        
        this.state = {
            menuOpen: false,
            theme: localStorage.getItem('cidadao-ai-theme') || 'light',
            language: localStorage.getItem('cidadao-ai-language') || 'pt-BR'
        };
        
        this.init();
    }
    
    init() {
        if (!this.elements.menuToggle || !this.elements.navMenu) {
            console.warn('Header elements not found');
            return;
        }
        
        // Apply initial states
        this.applyTheme(this.state.theme);
        this.applyLanguage(this.state.language);
        
        // Bind events
        this.bindMenuToggle();
        this.bindThemeToggle();
        this.bindLanguageToggle();
        this.bindOutsideClick();
        this.bindEscapeKey();
        this.bindResize();
        
        console.log('✅ Header Mobile-First initialized');
    }
    
    // Menu Toggle
    bindMenuToggle() {
        this.elements.menuToggle.addEventListener('click', () => {
            this.toggleMenu();
        });
    }
    
    toggleMenu() {
        this.state.menuOpen = !this.state.menuOpen;
        this.updateMenuState();
    }
    
    openMenu() {
        this.state.menuOpen = true;
        this.updateMenuState();
    }
    
    closeMenu() {
        this.state.menuOpen = false;
        this.updateMenuState();
    }
    
    updateMenuState() {
        const { menuToggle, navMenu, body } = this.elements;
        
        if (this.state.menuOpen) {
            menuToggle.setAttribute('aria-expanded', 'true');
            navMenu.setAttribute('aria-hidden', 'false');
            body.classList.add('menu-open');
            
            // Focus first menu item
            setTimeout(() => {
                const firstLink = navMenu.querySelector('.nav-link, .control-btn');
                if (firstLink) firstLink.focus();
            }, 100);
        } else {
            menuToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
            body.classList.remove('menu-open');
            
            // Return focus to toggle
            menuToggle.focus();
        }
    }
    
    // Theme Toggle
    bindThemeToggle() {
        if (!this.elements.themeToggle) return;
        
        this.elements.themeToggle.addEventListener('click', () => {
            const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    }
    
    setTheme(theme) {
        this.state.theme = theme;
        this.applyTheme(theme);
        localStorage.setItem('cidadao-ai-theme', theme);
        
        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('themeChange', { 
            detail: { theme } 
        }));
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Language Toggle
    bindLanguageToggle() {
        if (!this.elements.langToggle) return;
        
        this.elements.langToggle.addEventListener('click', () => {
            const newLang = this.state.language === 'pt-BR' ? 'en-US' : 'pt-BR';
            this.setLanguage(newLang);
        });
    }
    
    setLanguage(language) {
        this.state.language = language;
        this.applyLanguage(language);
        localStorage.setItem('cidadao-ai-language', language);
        
        // Update URL with language parameter
        const url = new URL(window.location);
        url.searchParams.set('lang', language === 'pt-BR' ? 'pt' : 'en');
        window.history.replaceState(null, '', url);
        
        // Dispatch event for i18n system
        document.dispatchEvent(new CustomEvent('changeLanguage', { 
            detail: { language } 
        }));
        
        // Update language button text
        const langText = this.elements.langToggle.querySelector('.lang-text');
        if (langText) {
            langText.textContent = language === 'pt-BR' ? 'PT' : 'EN';
        }
    }
    
    applyLanguage(language) {
        document.documentElement.setAttribute('data-language', language);
    }
    
    // Outside Click
    bindOutsideClick() {
        document.addEventListener('click', (e) => {
            if (this.state.menuOpen && 
                !this.elements.header.contains(e.target) &&
                !this.elements.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }
    
    // Escape Key
    bindEscapeKey() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.menuOpen) {
                this.closeMenu();
            }
        });
    }
    
    // Window Resize
    bindResize() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth >= 768 && this.state.menuOpen) {
                    this.closeMenu();
                }
            }, 250);
        });
    }
    
    // Public Methods
    getTheme() {
        return this.state.theme;
    }
    
    getLanguage() {
        return this.state.language;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.headerController = new HeaderController();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderController;
}