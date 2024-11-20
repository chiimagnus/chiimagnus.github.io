document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
    // 平滑滚动
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