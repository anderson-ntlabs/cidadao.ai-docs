/**
 * Skeleton Loading Manager - Cidadão.AI
 * 
 * Sistema inteligente de skeleton screens que:
 * - Mostra/oculta skeletons baseado no estado de carregamento
 * - Detecta quando conteúdo real está pronto
 * - Coordena com outros sistemas de loading
 * - Melhora perceived performance
 * 
 * @author Anderson Henrique
 * @version 1.0.0
 */

class SkeletonManager {
    constructor() {
        this.skeletonStates = new Map();
        this.loadingTimeout = 5000; // 5s máximo para skeleton
        this.minimumDisplayTime = 800; // Mínimo de 800ms para evitar flash
        
        this.init();
    }

    /**
     * Inicializa o skeleton manager
     */
    init() {
        this.createSkeletonElements();
        this.bindEvents();
        this.startInitialLoading();
        
        console.log('💀 Skeleton Manager initialized');
    }

    /**
     * Cria elementos skeleton dinamicamente
     */
    createSkeletonElements() {
        // Skeleton para carrossel
        this.createCarouselSkeleton();
        
        // Skeleton para cards de repositórios
        this.createCardSkeletons();
        
        // Skeleton para hero section (se necessário)
        if (document.querySelector('.hero') && this.shouldShowHeroSkeleton()) {
            this.createHeroSkeleton();
        }
    }

    /**
     * Cria skeleton do carrossel
     */
    createCarouselSkeleton() {
        const carouselSection = document.querySelector('.agents-carousel-wrapper');
        if (!carouselSection) return;

        const skeletonHTML = `
            <div class="carousel-skeleton-wrapper loading" id="carousel-skeleton">
                <div class="carousel-context">
                    <div class="skeleton carousel-skeleton-title"></div>
                    <div class="skeleton carousel-skeleton-subtitle"></div>
                </div>
                <div class="carousel-skeleton-container">
                    <div class="carousel-skeleton-track">
                        ${Array(15).fill().map(() => 
                            '<div class="skeleton skeleton-agent"></div>'
                        ).join('')}
                    </div>
                </div>
                <div class="skeleton carousel-skeleton-button"></div>
            </div>
        `;
        
        carouselSection.insertAdjacentHTML('afterbegin', skeletonHTML);
        
        // Ocultar todo o conteúdo real do carrossel
        const realCarousel = carouselSection.querySelector('.agents-carousel');
        if (realCarousel) {
            realCarousel.style.display = 'none';
        }
        
        this.skeletonStates.set('carousel', {
            skeleton: document.getElementById('carousel-skeleton'),
            content: realCarousel,
            startTime: Date.now(),
            ready: false
        });
    }

    /**
     * Cria skeletons para cards
     */
    createCardSkeletons() {
        const cardContainers = document.querySelectorAll('.links-grid, .narrow-grid');
        
        cardContainers.forEach((container, index) => {
            const cardCount = container.children.length || 3;
            const skeletonId = `cards-skeleton-${index}`;
            
            const skeletonHTML = `
                <div class="section-skeleton loading" id="${skeletonId}">
                    <div class="section-skeleton-grid">
                        ${Array(cardCount).fill().map(() => `
                            <div class="card-skeleton loading">
                                <div class="skeleton card-skeleton-icon"></div>
                                <div class="skeleton card-skeleton-title"></div>
                                <div class="skeleton card-skeleton-description"></div>
                                <div class="skeleton card-skeleton-description"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            container.insertAdjacentHTML('beforebegin', skeletonHTML);
            container.style.opacity = '0';
            container.style.pointerEvents = 'none';
            
            this.skeletonStates.set(`cards-${index}`, {
                skeleton: document.getElementById(skeletonId),
                content: container,
                startTime: Date.now(),
                ready: false
            });
        });
    }

    /**
     * Cria skeleton para hero section
     */
    createHeroSkeleton() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        const skeletonHTML = `
            <div class="hero-skeleton loading" id="hero-skeleton">
                <div class="skeleton hero-skeleton-badge"></div>
                <div class="skeleton hero-skeleton-title"></div>
                <div class="skeleton hero-skeleton-subtitle"></div>
                <div class="skeleton hero-skeleton-description"></div>
                <div class="skeleton hero-skeleton-description"></div>
                <div class="hero-skeleton-buttons">
                    <div class="skeleton hero-skeleton-button"></div>
                    <div class="skeleton hero-skeleton-button"></div>
                </div>
            </div>
        `;
        
        heroSection.insertAdjacentHTML('afterbegin', skeletonHTML);
        
        const realContent = Array.from(heroSection.children).slice(1);
        realContent.forEach(el => {
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
        });
        
        this.skeletonStates.set('hero', {
            skeleton: document.getElementById('hero-skeleton'),
            content: realContent,
            startTime: Date.now(),
            ready: false
        });
    }

    /**
     * Vincula eventos
     */
    bindEvents() {
        // Quando imagens carregam
        document.addEventListener('allImagesLoaded', () => {
            this.markAsReady('carousel');
        });
        
        // Quando DOM está completamente carregado
        document.addEventListener('DOMContentLoaded', () => {
            // Simular carregamento de cards (já que não dependem de recursos externos)
            setTimeout(() => {
                this.markAllCardsReady();
            }, 600);
        });
        
        // Timeout para forçar remoção de skeletons
        setTimeout(() => {
            this.forceRemoveAllSkeletons();
        }, this.loadingTimeout);
        
        // Quando carrossel está inicializado
        document.addEventListener('carouselInitialized', () => {
            this.markAsReady('carousel');
        });
    }

    /**
     * Inicia estado de carregamento inicial
     */
    startInitialLoading() {
        // Se página já carregou, remover skeletons rapidamente
        if (document.readyState === 'complete') {
            setTimeout(() => {
                this.markAllAsReady();
            }, this.minimumDisplayTime);
        }
    }

    /**
     * Marca um componente como pronto
     */
    markAsReady(componentId) {
        const state = this.skeletonStates.get(componentId);
        if (!state || state.ready) return;
        
        const elapsedTime = Date.now() - state.startTime;
        const remainingTime = Math.max(0, this.minimumDisplayTime - elapsedTime);
        
        setTimeout(() => {
            this.hideSkeleton(componentId);
        }, remainingTime);
        
        state.ready = true;
    }

    /**
     * Marca todos os cards como prontos
     */
    markAllCardsReady() {
        this.skeletonStates.forEach((state, key) => {
            if (key.startsWith('cards-')) {
                this.markAsReady(key);
            }
        });
    }

    /**
     * Marca todos como prontos
     */
    markAllAsReady() {
        this.skeletonStates.forEach((state, key) => {
            this.markAsReady(key);
        });
    }

    /**
     * Oculta skeleton e mostra conteúdo real
     */
    hideSkeleton(componentId) {
        const state = this.skeletonStates.get(componentId);
        if (!state) return;
        
        // Fade out skeleton
        if (state.skeleton) {
            state.skeleton.classList.add('fade-skeleton-out');
            setTimeout(() => {
                state.skeleton.style.display = 'none';
            }, 500);
        }
        
        // Fade in real content
        if (state.content) {
            if (Array.isArray(state.content)) {
                // Múltiplos elementos (hero)
                state.content.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.pointerEvents = 'auto';
                        el.style.transition = 'opacity 0.5s ease';
                    }, index * 100);
                });
            } else {
                // Elemento único
                state.content.style.display = '';
                setTimeout(() => {
                    state.content.style.opacity = '1';
                    state.content.style.pointerEvents = 'auto';
                    state.content.style.transition = 'opacity 0.5s ease';
                }, 50);
            }
        }
        
        console.log(`💀 Skeleton removed for: ${componentId}`);
        
        // Dispatch evento customizado
        document.dispatchEvent(new CustomEvent('skeletonRemoved', {
            detail: { componentId }
        }));
    }

    /**
     * Força remoção de todos os skeletons (timeout)
     */
    forceRemoveAllSkeletons() {
        console.log('⏰ Forcing removal of all skeletons (timeout)');
        this.skeletonStates.forEach((state, key) => {
            if (!state.ready) {
                this.hideSkeleton(key);
            }
        });
    }

    /**
     * Verifica se deve mostrar skeleton do hero
     */
    shouldShowHeroSkeleton() {
        // Mostrar apenas se página está carregando pela primeira vez
        return document.readyState === 'loading';
    }

    /**
     * Cria skeleton personalizado
     */
    createCustomSkeleton(target, config) {
        const {
            width = '100%',
            height = '1rem',
            borderRadius = '4px',
            className = 'skeleton'
        } = config;
        
        const skeleton = document.createElement('div');
        skeleton.className = `${className} custom-skeleton`;
        skeleton.style.width = width;
        skeleton.style.height = height;
        skeleton.style.borderRadius = borderRadius;
        
        target.appendChild(skeleton);
        
        return skeleton;
    }

    /**
     * Remove skeleton personalizado
     */
    removeCustomSkeleton(skeleton) {
        if (skeleton && skeleton.parentNode) {
            skeleton.classList.add('fade-skeleton-out');
            setTimeout(() => {
                skeleton.remove();
            }, 500);
        }
    }

    /**
     * Obtém estado de um skeleton
     */
    getSkeletonState(componentId) {
        return this.skeletonStates.get(componentId);
    }

    /**
     * Força atualização de um skeleton
     */
    refreshSkeleton(componentId) {
        const state = this.skeletonStates.get(componentId);
        if (!state) return;
        
        // Reset do estado
        state.ready = false;
        state.startTime = Date.now();
        
        // Mostrar skeleton novamente
        if (state.skeleton) {
            state.skeleton.style.display = 'block';
            state.skeleton.classList.remove('fade-skeleton-out');
        }
        
        // Ocultar conteúdo
        if (state.content) {
            if (Array.isArray(state.content)) {
                state.content.forEach(el => {
                    el.style.opacity = '0';
                    el.style.pointerEvents = 'none';
                });
            } else {
                state.content.style.opacity = '0';
                state.content.style.pointerEvents = 'none';
            }
        }
    }
}

/**
 * Skeleton Utilities
 */
class SkeletonUtils {
    /**
     * Adiciona skeleton a elemento existente
     */
    static addSkeletonToElement(element, options = {}) {
        const {
            lines = 3,
            lineHeight = '1rem',
            spacing = '0.5rem'
        } = options;
        
        element.innerHTML = '';
        
        for (let i = 0; i < lines; i++) {
            const line = document.createElement('div');
            line.className = 'skeleton';
            line.style.height = lineHeight;
            line.style.width = i === lines - 1 ? '70%' : '100%';
            line.style.marginBottom = spacing;
            element.appendChild(line);
        }
        
        return element;
    }

    /**
     * Remove skeletons de elemento
     */
    static removeSkeletonFromElement(element, content) {
        element.innerHTML = content;
    }

    /**
     * Cria skeleton para lista
     */
    static createListSkeleton(itemCount = 5, itemHeight = '3rem') {
        const list = document.createElement('div');
        list.className = 'skeleton-list';
        
        for (let i = 0; i < itemCount; i++) {
            const item = document.createElement('div');
            item.className = 'skeleton';
            item.style.height = itemHeight;
            item.style.marginBottom = '0.5rem';
            list.appendChild(item);
        }
        
        return list;
    }
}

// Auto-inicialização
document.addEventListener('DOMContentLoaded', () => {
    window.skeletonManager = new SkeletonManager();
    window.SkeletonUtils = SkeletonUtils;
    
    // Integração com outros sistemas
    if (window.smartImageLoader) {
        // Quando imagens críticas carregam
        document.addEventListener('allImagesLoaded', () => {
            setTimeout(() => {
                window.skeletonManager.markAsReady('carousel');
            }, 200);
        });
    }
});

console.log('💀 Skeleton Manager v1.0.0 loaded!');