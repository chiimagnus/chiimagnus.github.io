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
            mint: { 
                primary: '#00b894',
                secondary: '#81ecec',
                gradient: 'linear-gradient(45deg, #00b894 0%, #00cec9 50%, #81ecec 100%)'
            },
            ocean: {
                primary: '#0984e3',
                secondary: '#74b9ff',
                gradient: 'linear-gradient(45deg, #0984e3 0%, #00cec9 50%, #74b9ff 100%)'
            },
            sunset: {
                primary: '#d63031',
                secondary: '#fab1a0',
                gradient: 'linear-gradient(45deg, #d63031 0%, #e17055 50%, #fab1a0 100%)'
            },
            lavender: {
                primary: '#6c5ce7',
                secondary: '#dfe6e9',
                gradient: 'linear-gradient(45deg, #6c5ce7 0%, #a29bfe 50%, #dfe6e9 100%)'
            },
            forest: {
                primary: '#00b894',
                secondary: '#81ecec',
                gradient: 'linear-gradient(45deg, #00b894 0%, #55efc4 50%, #81ecec 100%)'
            },
            berry: {
                primary: '#e84393',
                secondary: '#fab1a0',
                gradient: 'linear-gradient(45deg, #e84393 0%, #fd79a8 50%, #fab1a0 100%)'
            },
            autumn: {
                primary: '#d63031',
                secondary: '#ffeaa7',
                gradient: 'linear-gradient(45deg, #d63031 0%, #fdcb6e 50%, #ffeaa7 100%)'
            },
            spring: {
                primary: '#00b894',
                secondary: '#74b9ff',
                gradient: 'linear-gradient(45deg, #00b894 0%, #55efc4 33%, #81ecec 66%, #74b9ff 100%)'
            }
        };
        return themes[theme] || themes.mint;
    }
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