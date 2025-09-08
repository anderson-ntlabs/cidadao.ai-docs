/**
 * Mobile Menu Handler - Cidadão.AI
 * 
 * Sistema completo de menu mobile com hamburger toggle,
 * suporte a temas, idiomas e fechamento automático
 * 
 * @author Anderson Henrique
 * @version 1.0.0
 */

class MobileMenuHandler {
    constructor() {
        this.isOpen = false;
        this.breakpoint = 768;
        
        // Elementos DOM
        this.elements = {
            toggle: null,
            navControls: null,
            navbar: null
        };
        
        this.init();
    }

    /**
     * Inicializa o handler do menu mobile
     */
    init() {
        this.bindElements();
        this.bindEvents();
        this.handleResize();
        
        console.log('📱 Mobile Menu Handler initialized');
    }

    /**
     * Vincula elementos DOM
     */
    bindElements() {
        this.elements.toggle = document.querySelector('.mobile-menu-toggle');
        this.elements.navControls = document.querySelector('.nav-controls');
        this.elements.navbar = document.querySelector('.navbar');
        
        if (!this.elements.toggle || !this.elements.navControls) {
            console.warn('Mobile menu elements not found');
            return;
        }
    }

    /**
     * Vincula event listeners
     */
    bindEvents() {
        if (!this.elements.toggle) return;
        
        // Toggle do menu
        this.elements.toggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });
        
        // Fechar ao clicar em botões do menu
        if (this.elements.navControls) {
            this.elements.navControls.addEventListener('click', (e) => {
                if (e.target.matches('button, a')) {
                    this.close();
                }
            });
        }
        
        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.elements.navbar.contains(e.target)) {
                this.close();
            }
        });
        
        // Fechar ao redimensionar para desktop
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Gerenciar focus trap quando menu aberto
        this.elements.navControls.addEventListener('keydown', (e) => {
            if (this.isOpen && e.key === 'Tab') {
                this.trapFocus(e);
            }
        });
    }

    /**
     * Toggle do menu mobile
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Abre o menu mobile
     */
    open() {
        if (this.isOpen || window.innerWidth > this.breakpoint) return;
        
        this.isOpen = true;
        
        // Atualizar classes CSS
        this.elements.toggle.classList.add('active');
        this.elements.navControls.classList.add('mobile-open');
        
        // Atualizar atributos de acessibilidade
        this.elements.toggle.setAttribute('aria-expanded', 'true');
        this.elements.navControls.setAttribute('aria-hidden', 'false');
        
        // Focus no primeiro elemento interativo
        setTimeout(() => {
            const firstButton = this.elements.navControls.querySelector('button, a');
            if (firstButton) {
                firstButton.focus();
            }
        }, 100);
        
        // Adicionar classe ao body para prevenir scroll
        document.body.classList.add('mobile-menu-open');
        
        console.log('📱 Mobile menu opened');
    }

    /**
     * Fecha o menu mobile
     */
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        // Atualizar classes CSS
        this.elements.toggle.classList.remove('active');
        this.elements.navControls.classList.remove('mobile-open');
        
        // Atualizar atributos de acessibilidade
        this.elements.toggle.setAttribute('aria-expanded', 'false');
        this.elements.navControls.setAttribute('aria-hidden', 'true');
        
        // Remover classe do body
        document.body.classList.remove('mobile-menu-open');
        
        console.log('📱 Mobile menu closed');
    }

    /**
     * Gerencia redimensionamento da janela
     */
    handleResize() {
        if (window.innerWidth > this.breakpoint && this.isOpen) {
            this.close();
        }
    }

    /**
     * Gerencia focus trap no menu mobile
     */
    trapFocus(e) {
        const focusableElements = this.elements.navControls.querySelectorAll(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    /**
     * Força fechamento do menu
     */
    forceClose() {
        if (this.isOpen) {
            this.close();
        }
    }

    /**
     * Verifica se o menu está aberto
     */
    isMenuOpen() {
        return this.isOpen;
    }
}

/**
 * Enhanced Theme and Language Handler
 * 
 * Melhora o sistema existente com feedback visual melhor
 */
class EnhancedControlsHandler {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentLanguage = localStorage.getItem('language') || 'pt-BR';
        
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.updateLanguageButtons(this.currentLanguage);
        this.updateThemeButtons(this.currentTheme);
        this.bindThemeButtons();
        this.bindLanguageButtons();
        
        console.log('🎨 Enhanced Controls Handler initialized');
    }

    /**
     * Vincula botões de tema
     */
    bindThemeButtons() {
        const themeButtons = document.querySelectorAll('[data-theme-btn]');
        
        themeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const theme = button.getAttribute('data-theme-btn');
                this.setTheme(theme);
                
                // Feedback visual
                this.showFeedback(button, '✓');
            });
        });
    }

    /**
     * Vincula botões de idioma
     */
    bindLanguageButtons() {
        const languageButtons = document.querySelectorAll('[data-lang-btn]');
        
        languageButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const language = button.getAttribute('data-lang-btn');
                this.setLanguage(language);
                
                // Feedback visual
                this.showFeedback(button, '✓');
            });
        });
    }

    /**
     * Define tema
     */
    setTheme(theme) {
        if (theme === this.currentTheme) return;
        
        this.currentTheme = theme;
        this.applyTheme(theme);
        this.updateThemeButtons(theme);
        localStorage.setItem('theme', theme);
        
        console.log(`🎨 Theme changed to: ${theme}`);
    }

    /**
     * Aplica tema
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Dispatch evento customizado
        document.dispatchEvent(new CustomEvent('themeChange', {
            detail: { theme }
        }));
    }

    /**
     * Atualiza botões de tema
     */
    updateThemeButtons(activeTheme) {
        const themeButtons = document.querySelectorAll('[data-theme-btn]');
        
        themeButtons.forEach(button => {
            const buttonTheme = button.getAttribute('data-theme-btn');
            button.classList.toggle('active', buttonTheme === activeTheme);
        });
    }

    /**
     * Define idioma
     */
    setLanguage(language) {
        if (language === this.currentLanguage) return;
        
        this.currentLanguage = language;
        this.updateLanguageButtons(language);
        localStorage.setItem('language', language);
        
        // Trigger da função existente de i18n se disponível
        if (window.updateLanguage) {
            window.updateLanguage(language);
        }
        
        console.log(`🌐 Language changed to: ${language}`);
    }

    /**
     * Atualiza botões de idioma
     */
    updateLanguageButtons(activeLanguage) {
        const languageButtons = document.querySelectorAll('[data-lang-btn]');
        
        languageButtons.forEach(button => {
            const buttonLanguage = button.getAttribute('data-lang-btn');
            button.classList.toggle('active', buttonLanguage === activeLanguage);
        });
    }

    /**
     * Mostra feedback visual no botão
     */
    showFeedback(button, icon) {
        const originalText = button.textContent;
        const originalIcon = button.innerHTML.match(/^[^\w\s]/)?.[0] || '';
        
        // Mostrar feedback
        button.innerHTML = `${originalIcon.slice(0, 2)} ${icon}`;
        button.style.transform = 'scale(0.95)';
        
        // Restaurar após 600ms
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.transform = '';
        }, 600);
    }
}

/**
 * Card Click Delay Handler
 * 
 * Previne cliques acidentais em cards durante scrolling/swiping
 */
class CardClickHandler {
    constructor() {
        this.clickDelay = 150; // ms
        this.touchStartTime = 0;
        this.isScrolling = false;
        
        this.init();
    }

    init() {
        this.bindCardEvents();
        console.log('🃏 Card Click Handler initialized');
    }

    /**
     * Vincula eventos aos cards
     */
    bindCardEvents() {
        const cards = document.querySelectorAll('.link-card, a[class*="card"]');
        
        cards.forEach(card => {
            let touchStartY = 0;
            let touchStartTime = 0;
            
            // Touch events
            card.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
                this.isScrolling = false;
            }, { passive: true });
            
            card.addEventListener('touchmove', (e) => {
                const touchY = e.touches[0].clientY;
                const deltaY = Math.abs(touchY - touchStartY);
                
                if (deltaY > 10) {
                    this.isScrolling = true;
                }
            }, { passive: true });
            
            card.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;
                
                if (this.isScrolling || touchDuration < this.clickDelay) {
                    e.preventDefault();
                    return false;
                }
            });
            
            // Click events
            card.addEventListener('click', (e) => {
                if (this.isScrolling) {
                    e.preventDefault();
                    return false;
                }
                
                // Adicionar efeito visual de feedback
                this.addClickFeedback(card);
            });
        });
    }

    /**
     * Adiciona feedback visual ao clicar
     */
    addClickFeedback(element) {
        element.style.transform = 'scale(0.98)';
        element.style.opacity = '0.8';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.opacity = '';
        }, 150);
    }
}

// Auto-inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar handlers
    window.mobileMenuHandler = new MobileMenuHandler();
    window.enhancedControlsHandler = new EnhancedControlsHandler();
    window.cardClickHandler = new CardClickHandler();
    
    // CSS adicional para prevenir scroll quando menu aberto
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-open {
            overflow: hidden;
            position: fixed;
            width: 100%;
        }
        
        /* Hide mobile menu toggle by default */
        .mobile-menu-toggle {
            display: none !important;
        }
        
        /* Show mobile menu toggle only on mobile */
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: flex !important;
            }
        }
    `;
    document.head.appendChild(style);
});

console.log('📱 Mobile Menu Module v1.0.0 loaded!');