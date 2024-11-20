document.addEventListener('DOMContentLoaded', () => {
    // 主题切换功能
    const themeSwitch = document.getElementById('themeSwitch');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 检查本地存储中的主题设置
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeSwitch.textContent = currentTheme === 'dark' ? '🌜' : '🌞';
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitch.textContent = '🌜';
    }

    // 切换主题
    themeSwitch.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeSwitch.textContent = newTheme === 'dark' ? '🌜' : '🌞';
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