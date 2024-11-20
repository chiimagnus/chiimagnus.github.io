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

    // 添加文章排序功能
    const sortButton = document.getElementById('sortArticles');
    const articlesList = document.getElementById('articlesList');
    
    if (sortButton && articlesList) {
        let isDescending = true; // 默认最新的在前面

        sortButton.addEventListener('click', function() {
            isDescending = !isDescending;
            
            // 更新按钮文本和图标
            sortButton.innerHTML = `排序: ${isDescending ? '最新' : '最早'}优先 
                <span class="sort-icon">${isDescending ? '↓' : '↑'}</span>`;
            
            // 获取所有文章
            const articles = Array.from(articlesList.getElementsByClassName('article-preview'));
            
            // 排序文章
            articles.sort((a, b) => {
                const dateA = new Date(a.querySelector('.article-meta').textContent.match(/\d{4}年\d{1,2}月\d{1,2}日/)[0].replace(/年|月|日/g, '/'));
                const dateB = new Date(b.querySelector('.article-meta').textContent.match(/\d{4}年\d{1,2}月\d{1,2}日/)[0].replace(/年|月|日/g, '/'));
                
                return isDescending ? dateB - dateA : dateA - dateB;
            });
            
            // 重新插入排序后的文章
            articles.forEach(article => articlesList.appendChild(article));
            
            // 添加动画效果
            articles.forEach((article, index) => {
                article.style.opacity = '0';
                setTimeout(() => {
                    article.style.opacity = '1';
                }, index * 100);
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