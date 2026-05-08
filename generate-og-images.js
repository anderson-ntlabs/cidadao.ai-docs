/**
 * Open Graph Images Generator - Cidadão.AI
 * 
 * Gera imagens personalizadas para social sharing:
 * - og:image principal (1200x630px)
 * - Twitter card (1200x600px)  
 * - Diferentes variações para contextos específicos
 * 
 * @author Anderson Henrique
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

// Verificar se sharp está disponível
let sharp;
try {
    sharp = require('sharp');
} catch (error) {
    console.error('❌ Sharp não encontrado. Execute: npm install sharp');
    process.exit(1);
}

// Configurações
const BRAND_COLOR = '#10b981';
const OUTPUT_DIR = './assets/img';

// Criar diretório se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Cria SVG para Open Graph
 */
function createOpenGraphSVG(options = {}) {
    const {
        width = 1200,
        height = 630,
        title = 'Cidadão.AI',
        subtitle = 'Sistema Multi-Agente de IA para Transparência Pública',
        description = 'Democratizando acesso aos dados públicos brasileiros',
        backgroundColor = BRAND_COLOR,
        textColor = 'white'
    } = options;

    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <!-- Gradiente principal -->
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
                <stop offset="50%" style="stop-color:#059669;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
            </linearGradient>
            
            <!-- Gradiente overlay -->
            <linearGradient id="overlayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:rgba(0,0,0,0.1);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgba(0,0,0,0.3);stop-opacity:1" />
            </linearGradient>
            
            <!-- Pattern -->
            <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/>
            </pattern>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" fill="url(#bgGradient)"/>
        <rect width="100%" height="100%" fill="url(#pattern)"/>
        <rect width="100%" height="100%" fill="url(#overlayGradient)"/>
        
        <!-- Logo/Icon -->
        <circle cx="150" cy="${height/2}" r="60" fill="rgba(255,255,255,0.15)"/>
        <text x="150" y="${height/2 + 20}" 
              font-family="Arial, sans-serif" 
              font-size="72" 
              fill="${textColor}" 
              text-anchor="middle">🏛️</text>
        
        <!-- Content -->
        <g transform="translate(280, ${height/2 - 80})">
            <!-- Title -->
            <text x="0" y="0" 
                  font-family="Arial, sans-serif" 
                  font-weight="bold" 
                  font-size="72" 
                  fill="${textColor}">${title}</text>
            
            <!-- Subtitle -->
            <text x="0" y="50" 
                  font-family="Arial, sans-serif" 
                  font-weight="600" 
                  font-size="32" 
                  fill="rgba(255,255,255,0.9)">${subtitle}</text>
            
            <!-- Description -->
            <text x="0" y="100" 
                  font-family="Arial, sans-serif" 
                  font-size="24" 
                  fill="rgba(255,255,255,0.8)">${description}</text>
            
            <!-- Badge -->
            <rect x="0" y="130" width="200" height="30" rx="15" fill="rgba(255,255,255,0.2)"/>
            <text x="100" y="150" 
                  font-family="Arial, sans-serif" 
                  font-size="16" 
                  font-weight="600"
                  fill="${textColor}" 
                  text-anchor="middle">🇧🇷 Made in Brazil</text>
        </g>
        
        <!-- Bottom accent -->
        <rect x="0" y="${height-10}" width="100%" height="10" fill="rgba(255,255,255,0.1)"/>
    </svg>`;
}

/**
 * Cria SVG para Twitter Card (formato diferente)
 */
function createTwitterCardSVG() {
    return createOpenGraphSVG({
        width: 1200,
        height: 600,
        title: 'Cidadão.AI',
        subtitle: 'Transparência Pública com IA',
        description: 'Sistema multi-agente para democratizar dados públicos'
    });
}

/**
 * Cria variações para diferentes contextos
 */
function createAgentsSVG() {
    return createOpenGraphSVG({
        title: 'Agentes de IA Brasileiros',
        subtitle: '17 Inteligências Especializadas',
        description: 'Cada agente trabalha 24/7 pela transparência pública',
        backgroundColor: '#3b82f6'
    });
}

function createRepositorySVG() {
    return createOpenGraphSVG({
        title: 'Código Aberto',
        subtitle: 'Projeto Open Source',
        description: 'Explore a arquitetura multi-agente do Cidadão.AI',
        backgroundColor: '#8b5cf6'
    });
}

function createAPISVG() {
    return createOpenGraphSVG({
        title: 'API Cidadão.AI',
        subtitle: 'Documentação Técnica',
        description: 'FastAPI com sistema multi-agente para transparência',
        backgroundColor: '#f59e0b'
    });
}

/**
 * Gera imagem PNG a partir de SVG
 */
async function generateOGImage(svgContent, filename, size = { width: 1200, height: 630 }) {
    try {
        const outputPath = path.join(OUTPUT_DIR, filename);
        
        await sharp(Buffer.from(svgContent))
            .resize(size.width, size.height)
            .png({ quality: 95, compressionLevel: 6 })
            .toFile(outputPath);
        
        const stats = fs.statSync(outputPath);
        console.log(`✅ ${filename} - ${size.width}x${size.height} (${(stats.size/1024).toFixed(1)}KB)`);
        
    } catch (error) {
        console.error(`❌ Erro ao gerar ${filename}:`, error.message);
    }
}

/**
 * Gera todas as imagens Open Graph
 */
async function generateAllOGImages() {
    console.log('🖼️ Gerando imagens Open Graph...\n');
    
    // Imagem principal
    console.log('🌐 Open Graph principal:');
    const mainOG = createOpenGraphSVG();
    await generateOGImage(mainOG, 'og-image.png');
    
    // Twitter Card
    console.log('\n🐦 Twitter Card:');
    const twitterCard = createTwitterCardSVG();
    await generateOGImage(twitterCard, 'twitter-card.png', { width: 1200, height: 600 });
    
    // Variações contextuais
    console.log('\n🤖 Imagens específicas:');
    
    const agentsOG = createAgentsSVG();
    await generateOGImage(agentsOG, 'og-agents.png');
    
    const repoOG = createRepositorySVG();
    await generateOGImage(repoOG, 'og-repository.png');
    
    const apiOG = createAPISVG();
    await generateOGImage(apiOG, 'og-api.png');
    
    // Screenshots placeholder (mobile e desktop)
    console.log('\n📱 Screenshots placeholder:');
    await generateScreenshotPlaceholder('screenshot-mobile.png', { width: 360, height: 640 });
    await generateScreenshotPlaceholder('screenshot-desktop.png', { width: 1280, height: 720 });
    
    console.log('\n✅ Todas as imagens Open Graph geradas!');
    console.log(`📁 Salvos em: ${OUTPUT_DIR}`);
    
    // Gerar tags HTML atualizadas
    generateUpdatedMetaTags();
    
    // Relatório de tamanhos
    generateImageReport();
}

/**
 * Gera placeholders para screenshots
 */
async function generateScreenshotPlaceholder(filename, size) {
    const svg = `<svg width="${size.width}" height="${size.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${BRAND_COLOR};stop-opacity:1" />
                <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="${size.width/2}" y="${size.height/2}" 
              font-family="Arial, sans-serif" 
              font-size="24" 
              fill="white" 
              text-anchor="middle" 
              dominant-baseline="middle">Cidadão.AI Screenshot</text>
    </svg>`;
    
    await generateOGImage(svg, filename, size);
}

/**
 * Gera meta tags HTML atualizadas
 */
function generateUpdatedMetaTags() {
    const metaTags = `
<!-- Enhanced Meta Tags com Open Graph -->
<meta name="description" content="Sistema multi-agente de inteligência artificial para democratizar o acesso aos dados públicos e fortalecer a transparência governamental brasileira.">
<meta name="keywords" content="Cidadão.AI, transparência pública, IA ética, open government, ODS 16, inteligência artificial, Brasil, dados públicos, governo aberto, multi-agente, FastAPI">
<meta name="author" content="Anderson Henrique da Silva">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://anderson-ntlabs.github.io/cidadao.ai-docs/">
<meta property="og:title" content="Cidadão.AI — Sistema Multi-Agente de IA para Transparência Pública">
<meta property="og:description" content="17 agentes de IA brasileiros trabalhando 24/7 para democratizar o acesso aos dados públicos e fortalecer a transparência governamental.">
<meta property="og:image" content="https://anderson-ntlabs.github.io/cidadao.ai-docs/assets/img/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Cidadão.AI - Sistema Multi-Agente de IA para Transparência Pública Brasileira">
<meta property="og:locale" content="pt_BR">
<meta property="og:locale:alternate" content="en_US">
<meta property="og:site_name" content="Cidadão.AI">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@cidadao_ai">
<meta name="twitter:creator" content="@anderson_ufrj">
<meta name="twitter:url" content="https://anderson-ntlabs.github.io/cidadao.ai-docs/">
<meta name="twitter:title" content="Cidadão.AI — IA para Transparência Pública">
<meta name="twitter:description" content="Sistema multi-agente de IA brasileiro para democratizar dados públicos. 17 agentes especializados trabalhando pela transparência governamental.">
<meta name="twitter:image" content="https://anderson-ntlabs.github.io/cidadao.ai-docs/assets/img/twitter-card.png">
<meta name="twitter:image:alt" content="Cidadão.AI - Transparência Pública com Inteligência Artificial">

<!-- Contextuais Open Graph -->
<!-- Para páginas de agentes -->
<meta property="og:image" content="https://anderson-ntlabs.github.io/cidadao.ai-docs/assets/img/og-agents.png" data-context="agents">

<!-- Para repositórios -->
<meta property="og:image" content="https://anderson-ntlabs.github.io/cidadao.ai-docs/assets/img/og-repository.png" data-context="repository">

<!-- Para API -->
<meta property="og:image" content="https://anderson-ntlabs.github.io/cidadao.ai-docs/assets/img/og-api.png" data-context="api">
`;
    
    fs.writeFileSync('./enhanced-meta-tags.html', metaTags);
    console.log('📝 enhanced-meta-tags.html gerado');
}

/**
 * Gera relatório de imagens
 */
function generateImageReport() {
    console.log('\n📊 RELATÓRIO DE IMAGENS GERADAS:');
    console.log('=' * 50);
    
    const imageFiles = [
        'og-image.png',
        'twitter-card.png', 
        'og-agents.png',
        'og-repository.png',
        'og-api.png',
        'screenshot-mobile.png',
        'screenshot-desktop.png'
    ];
    
    let totalSize = 0;
    
    imageFiles.forEach(filename => {
        const filepath = path.join(OUTPUT_DIR, filename);
        if (fs.existsSync(filepath)) {
            const stats = fs.statSync(filepath);
            totalSize += stats.size;
            console.log(`  ${filename}: ${(stats.size/1024).toFixed(1)}KB`);
        }
    });
    
    console.log(`\n📦 Total Open Graph images: ${(totalSize/1024).toFixed(1)}KB`);
    console.log('🚀 Social sharing otimizado!');
}

// Executar geração
generateAllOGImages().catch(console.error);