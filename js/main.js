document.addEventListener('DOMContentLoaded', () => {
    // 调色盘功能
    const paletteButton = document.getElementById('paletteButton');
    const colorPalette = document.getElementById('colorPalette');
    const closePalette = document.getElementById('closePalette');
    const colorOptions = document.querySelectorAll('.color-option');
    const searchInput = document.getElementById('searchInput');

    // 从localStorage获取保存的主题颜色
    const savedThemeColor = localStorage.getItem('themeColor');
    if (savedThemeColor) {
        applyThemeColor(savedThemeColor);
        // 设置活动状态
        colorOptions.forEach(option => {
            if (option.getAttribute('data-theme') === savedThemeColor) {
                option.classList.add('active');
            }
        });
    }

    // 打开调色盘
    paletteButton.addEventListener('click', () => {
        colorPalette.classList.toggle('show');
    });

    // 关闭调色盘
    closePalette.addEventListener('click', () => {
        colorPalette.classList.remove('show');
    });

    // 点击外部关闭调色盘
    document.addEventListener('click', (e) => {
        if (!colorPalette.contains(e.target) && !paletteButton.contains(e.target)) {
            colorPalette.classList.remove('show');
        }
    });

    // 颜色选择
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            applyThemeColor(theme);
            localStorage.setItem('themeColor', theme);
            
            // 更新选中状态
            colorOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // 关闭调色盘
            colorPalette.classList.remove('show');
        });
    });

    // 搜索功能
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const articles = document.querySelectorAll('.article-preview');
        const products = document.querySelectorAll('.product-card');
        const about = document.querySelector('.about-content');

        // 搜索文章
        articles.forEach(article => {
            const text = article.textContent.toLowerCase();
            article.style.display = text.includes(query) ? 'block' : 'none';
        });

        // 搜索产品
        products.forEach(product => {
            const text = product.textContent.toLowerCase();
            product.style.display = text.includes(query) ? 'block' : 'none';
        });

        // 搜索关于我
        if (about) {
            const text = about.textContent.toLowerCase();
            about.style.display = text.includes(query) ? 'block' : 'none';
        }
    });

    // 快捷键 cmd+k 触发搜索框聚焦
    document.addEventListener('keydown', (e) => {
        if (e.metaKey && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // 添加文章展开/折叠功能
    const toggleButton = document.getElementById('toggleArticles');
    const articlesList = document.getElementById('articlesList');
    
    if (toggleButton && articlesList) {
        // 初始状态为折叠
        articlesList.classList.add('collapsed');
        
        toggleButton.addEventListener('click', () => {
            const isCollapsed = articlesList.classList.contains('collapsed');
            
            if (isCollapsed) {
                articlesList.classList.remove('collapsed');
                toggleButton.innerHTML = '收起 ↑';
            } else {
                articlesList.classList.add('collapsed');
                toggleButton.innerHTML = '展开 ↓';
            }
            
            // 添加平滑过渡效果
            const articles = articlesList.getElementsByClassName('article-preview');
            Array.from(articles).forEach((article, index) => {
                if (index >= 2) {
                    article.style.transition = 'opacity 0.3s ease';
                    article.style.opacity = isCollapsed ? '0' : '1';
                    setTimeout(() => {
                        article.style.opacity = isCollapsed ? '1' : '0';
                    }, 50 * (index - 1));
                }
            });
        });
    }

    // 应用主题颜色
    function applyThemeColor(theme) {
        const colors = getThemeColors(theme);
        
        // 设置主要颜色变量
        document.documentElement.style.setProperty('--gradient-primary', colors.primary);
        document.documentElement.style.setProperty('--gradient-secondary', colors.secondary);
        document.documentElement.style.setProperty('--bg-gradient', colors.gradient);
        
        // 设置RGB值用于透明度渐变
        const primaryRGB = hexToRgb(colors.primary);
        const secondaryRGB = hexToRgb(colors.secondary);
        document.documentElement.style.setProperty('--gradient-primary-rgb', `${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}`);
        document.documentElement.style.setProperty('--gradient-secondary-rgb', `${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}`);
        
        // 设置其他颜色变量
        document.documentElement.style.setProperty('--primary-color', colors.primary);
        document.documentElement.style.setProperty('--secondary-color', colors.secondary);
        document.documentElement.style.setProperty('--accent-color', colors.primary);
        document.documentElement.style.setProperty('--link-color', colors.primary);
        document.documentElement.style.setProperty('--hover-color', colors.secondary);
    }

    // 辅助函数：将十六进制颜色转换为RGB
    function hexToRgb(hex) {
        // 移除#号如果存在
        hex = hex.replace('#', '');
        
        // 解析RGB值
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }

    // 获取主题颜色
    function getThemeColors(theme) {
        const themes = {
            rainbow: { 
                primary: '#ff6b6b',
                secondary: '#6c5ce7',
                gradient: 'linear-gradient(45deg, #ff6b6b 0%, #ffd93d 20%, #6c5ce7 40%, #00b894 60%, #0984e3 80%, #e84393 100%)'
            },
            aurora: {
                primary: '#2d3436',
                secondary: '#81ecec',
                gradient: 'linear-gradient(45deg, #2d3436 0%, #6c5ce7 30%, #00b894 60%, #81ecec 100%)'
            },
            'sunset-beach': {
                primary: '#e17055',
                secondary: '#00cec9',
                gradient: 'linear-gradient(45deg, #e17055 0%, #fdcb6e 30%, #0984e3 70%, #00cec9 100%)'
            },
            'cherry-blossom': {
                primary: '#e84393',
                secondary: '#dfe6e9',
                gradient: 'linear-gradient(45deg, #e84393 0%, #fd79a8 30%, #fab1a0 60%, #dfe6e9 100%)'
            },
            autumn: {
                primary: '#d63031',
                secondary: '#ffeaa7',
                gradient: 'linear-gradient(45deg, #d63031 0%, #fdcb6e 50%, #ffeaa7 100%)'
            },
            'neon-noir': {
                primary: '#ff00ff',
                secondary: '#00ffff',
                gradient: 'linear-gradient(45deg, #000000 0%, #1a1a1a 30%, #ff00ff 60%, #00ffff 80%, #000000 100%)'
            }
        };
        return themes[theme] || themes.rainbow;
    }

    // 更新颜色选择器功能
    const colorWheel = document.querySelector('.color-wheel');
    const dots = document.querySelectorAll('.color-dot');
    const primaryInput = document.getElementById('primaryColor');
    const secondaryInput = document.getElementById('secondaryColor');
    const accentInput = document.getElementById('accentColor');
    const previewGradient = document.querySelector('.preview-gradient');

    // 计算颜色选择器上的位置对应的颜色
    function getColorFromPosition(x, y, wheelRect) {
        const centerX = wheelRect.width / 2;
        const centerY = wheelRect.height / 2;
        
        // 计算相对于中心的位置
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        
        // 计算角度（色相）
        let hue = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        if (hue < 0) hue += 360;
        
        // 计算距离中心的距离（饱和度）
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = wheelRect.width / 2;
        const saturation = Math.min(distance / maxDistance * 100, 100);
        
        // 根据距离计算明度
        const lightness = Math.max(50 - (distance / maxDistance * 30), 20);
        
        return {
            hue,
            saturation,
            lightness,
            color: `hsl(${hue}, ${saturation}%, ${lightness}%)`
        };
    }

    // 根据主色调计算和谐的配色方案
    function calculateHarmoniousColors(primaryColor) {
        // 计算次要颜色（120度角）
        const secondaryHue = (primaryColor.hue + 120) % 360;
        // 计算点缀色（240度角）
        const accentHue = (primaryColor.hue + 240) % 360;
        
        return {
            secondary: {
                hue: secondaryHue,
                saturation: primaryColor.saturation * 0.9, // 稍微降低饱和度
                lightness: primaryColor.lightness * 1.1, // 稍微提高明度
                color: `hsl(${secondaryHue}, ${primaryColor.saturation * 0.9}%, ${primaryColor.lightness * 1.1}%)`
            },
            accent: {
                hue: accentHue,
                saturation: primaryColor.saturation * 0.8, // 更低的饱和度
                lightness: primaryColor.lightness * 1.2, // 更高的明度
                color: `hsl(${accentHue}, ${primaryColor.saturation * 0.8}%, ${primaryColor.lightness * 1.2}%)`
            }
        };
    }

    // 更新颜色值和预览
    function updateColors(primaryColor, secondaryColor, accentColor) {
        document.documentElement.style.setProperty('--gradient-primary', primaryColor);
        document.documentElement.style.setProperty('--gradient-secondary', secondaryColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);
        
        // 更新渐变预览
        const gradient = `linear-gradient(45deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`;
        previewGradient.style.background = gradient;
        document.documentElement.style.setProperty('--bg-gradient', gradient);
        
        // 更新输入框
        primaryInput.value = primaryColor;
        secondaryInput.value = secondaryColor;
        accentInput.value = accentColor;
        
        // 更新点的颜色
        dots[0].style.backgroundColor = primaryColor;
        dots[1].style.backgroundColor = secondaryColor;
        dots[2].style.backgroundColor = accentColor;
    }

    // 更新点的位置
    function updateDotPositions(primaryX, primaryY, wheelRect) {
        const centerX = wheelRect.width / 2;
        const centerY = wheelRect.height / 2;
        const radius = wheelRect.width / 2 * 0.8; // 80% 的色轮半径
        
        // 设置主色调点的位置
        dots[0].style.left = `${primaryX}px`;
        dots[0].style.top = `${primaryY}px`;
        
        // 获取主色调的颜色信息
        const primaryColorInfo = getColorFromPosition(primaryX, primaryY, wheelRect);
        
        // 计算和谐的配色方案
        const harmoniousColors = calculateHarmoniousColors(primaryColorInfo);
        
        // 计算次要颜色点的位置
        const secondaryAngle = (primaryColorInfo.hue + 120) * (Math.PI / 180);
        const secondaryX = centerX + radius * Math.cos(secondaryAngle);
        const secondaryY = centerY + radius * Math.sin(secondaryAngle);
        dots[1].style.left = `${secondaryX}px`;
        dots[1].style.top = `${secondaryY}px`;
        
        // 计算点缀色点的位置
        const accentAngle = (primaryColorInfo.hue + 240) * (Math.PI / 180);
        const accentX = centerX + radius * Math.cos(accentAngle);
        const accentY = centerY + radius * Math.sin(accentAngle);
        dots[2].style.left = `${accentX}px`;
        dots[2].style.top = `${accentY}px`;
        
        // 更新所有颜色
        updateColors(
            primaryColorInfo.color,
            harmoniousColors.secondary.color,
            harmoniousColors.accent.color
        );
    }

    // 拖拽功能
    dots.forEach((dot, index) => {
        let isDragging = false;
        
        dot.addEventListener('mousedown', (e) => {
            // 只允许拖拽主色调点（最大的点）
            if (index === 0) {
                isDragging = true;
                dot.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const wheelRect = colorWheel.getBoundingClientRect();
            const x = e.clientX - wheelRect.left;
            const y = e.clientY - wheelRect.top;
            
            // 限制在色轮范围内
            const centerX = wheelRect.width / 2;
            const centerY = wheelRect.height / 2;
            const deltaX = x - centerX;
            const deltaY = y - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = wheelRect.width / 2;
            
            if (distance <= maxDistance) {
                updateDotPositions(x, y, wheelRect);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            dot.style.cursor = 'move';
        });
    });

    // 点击色轮时更新颜色
    colorWheel.addEventListener('click', (e) => {
        const wheelRect = colorWheel.getBoundingClientRect();
        const x = e.clientX - wheelRect.left;
        const y = e.clientY - wheelRect.top;
        
        // 计算到中心的距离
        const centerX = wheelRect.width / 2;
        const centerY = wheelRect.height / 2;
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // 如果点击在色轮范围内，更新所有点的位置
        if (distance <= wheelRect.width / 2) {
            updateDotPositions(x, y, wheelRect);
        }
    });
});

async function loadArticles() {
    const articlesContainer = document.querySelector('.articles-container');
    
    // 这里可以维护一个文章列表配置文件，或者直接在代码中定义
    const articles = [
        {
            path: 'articles/immersive-game-design.md',
            slug: 'immersive-game-design'
        }
        // 可以继续添加更多文章
    ];

    for (const article of articles) {
        const articleData = await loadArticle(article.path);
        if (articleData) {
            const { frontmatter } = articleData;
            
            const articleElement = document.createElement('article');
            articleElement.className = 'article-preview';
            articleElement.innerHTML = `
                <h3>${frontmatter.title}</h3>
                <p class="article-meta">发布于 ${frontmatter.date}</p>
                <p class="article-excerpt">${frontmatter.description}</p>
                <a href="articles/${article.slug}.html" class="read-more">阅读全文 →</a>
            `;
            
            articlesContainer.appendChild(articleElement);
        }
    }
} 