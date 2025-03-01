/**
 * ArticleManager - 文章管理器
 * 负责文章的加载、显示和交互
 */
import BaseModule from '../core/BaseModule.js';

class ArticleManager extends BaseModule {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        super(options);
        
        // 文章相关元素
        this.articlesContainer = null;
        this.toggleButton = null;
        this.articlesList = null;
        
        // 文章配置
        this.articlesConfig = options.articles || [];
        this.articlesBasePath = options.articlesBasePath || 'articles/';
        this.visibleArticlesCount = options.visibleArticlesCount || 2;
        
        // 当前状态
        this.isCollapsed = true;
    }

    /**
     * 初始化文章管理器
     * @returns {ArticleManager} - 返回模块实例
     */
    init() {
        if (this.initialized) return this;
        
        // 查找DOM元素
        this.articlesList = document.getElementById('articlesList');
        this.toggleButton = document.getElementById('toggleArticles');
        
        // 加载文章
        if (this.articlesList) {
            this.loadArticles();
        } else {
            console.error('未找到文章列表容器元素');
        }
        
        // 设置初始状态
        if (this.articlesList) {
            this.articlesList.classList.add('collapsed');
        }
        
        // 绑定事件
        this._bindEvents();
        
        super.init();
        return this;
    }

    /**
     * 绑定事件处理函数
     * @private
     */
    _bindEvents() {
        if (this.toggleButton && this.articlesList) {
            this.addEventListener(this.toggleButton, 'click', () => {
                this.toggleArticles();
            });
        }
    }

    /**
     * 切换文章展开/折叠状态
     */
    toggleArticles() {
        if (!this.articlesList) return;
        
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.articlesList.classList.add('collapsed');
            if (this.toggleButton) {
                this.toggleButton.innerHTML = '展开 ↓';
            }
        } else {
            this.articlesList.classList.remove('collapsed');
            if (this.toggleButton) {
                this.toggleButton.innerHTML = '收起 ↑';
            }
        }
        
        // 添加平滑过渡效果
        const articles = this.articlesList.getElementsByClassName('article-preview');
        Array.from(articles).forEach((article, index) => {
            if (index >= this.visibleArticlesCount) {
                article.style.transition = 'opacity 0.3s ease';
                // 设置初始透明度
                article.style.opacity = this.isCollapsed ? '0' : '0';
                
                // 如果展开，则延迟一下后显示文章
                if (!this.isCollapsed) {
                    setTimeout(() => {
                        article.style.opacity = '1';
                    }, 50 * (index - this.visibleArticlesCount));
                }
            }
        });
        
        // 触发事件
        this.emit('articles:toggle', { isCollapsed: this.isCollapsed });
    }

    /**
     * 加载文章列表
     * @returns {Promise} - 加载完成的Promise
     */
    async loadArticles() {
        if (!this.articlesList) {
            console.error('未找到文章列表容器');
            return;
        }
        
        // 如果没有预先配置的文章，可以尝试从配置文件加载
        if (this.articlesConfig.length === 0) {
            try {
                const response = await fetch('js/config/articles.json');
                if (response.ok) {
                    this.articlesConfig = await response.json();
                    console.log('从配置文件加载了文章列表');
                }
            } catch (error) {
                console.error('加载文章配置失败:', error);
                // 使用一些默认配置
                this.articlesConfig = [];
            }
        }
        
        // 清空容器
        if (this.articlesList) {
            // 保留原有DOM，仅清空内容
            while (this.articlesList.firstChild) {
                this.articlesList.removeChild(this.articlesList.firstChild);
            }
        }
        
        // 加载每篇文章
        for (const article of this.articlesConfig) {
            try {
                let articleElement;
                
                if (article.external) {
                    // 处理外部链接的文章
                    articleElement = document.createElement('article');
                    articleElement.className = 'article-preview';
                    articleElement.innerHTML = `
                        <h3>${article.title}</h3>
                        <p class="article-meta">发布于 ${article.date}</p>
                        <p class="article-excerpt">${article.description}</p>
                        <a href="${article.url}" class="read-more" target="_blank">阅读全文 →</a>
                    `;
                } else {
                    // 处理本地文章
                    const articleData = await this._loadArticle(article.path || `${this.articlesBasePath}${article.slug}.md`);
                    if (!articleData) continue;
                    
                    const { frontmatter } = articleData;
                    
                    articleElement = document.createElement('article');
                    articleElement.className = 'article-preview';
                    articleElement.innerHTML = `
                        <h3>${frontmatter.title || article.title}</h3>
                        <p class="article-meta">发布于 ${frontmatter.date || article.date}</p>
                        <p class="article-excerpt">${frontmatter.description || article.description}</p>
                        <a href="${this.articlesBasePath}${article.slug}.html" class="read-more">阅读全文 →</a>
                    `;
                }
                
                if (this.articlesList && articleElement) {
                    this.articlesList.appendChild(articleElement);
                }
            } catch (error) {
                console.error(`加载文章 ${article.title || article.slug} 失败:`, error);
            }
        }
        
        // 触发文章加载完成事件
        this.emit('articles:loaded', { articlesCount: this.articlesConfig.length });
    }

    /**
     * 加载单篇文章
     * @param {string} path - 文章路径
     * @returns {Promise<Object|null>} - 文章数据
     * @private
     */
    async _loadArticle(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            
            const text = await response.text();
            
            // 解析frontmatter (YAML格式的元数据)
            const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
            const match = text.match(frontmatterRegex);
            
            if (match) {
                const frontmatterText = match[1];
                const frontmatter = this._parseFrontmatter(frontmatterText);
                const content = text.replace(frontmatterRegex, '').trim();
                
                return {
                    frontmatter,
                    content
                };
            }
            
            return null;
        } catch (error) {
            console.error('加载文章内容失败:', error);
            return null;
        }
    }

    /**
     * 解析frontmatter
     * @param {string} text - frontmatter文本
     * @returns {Object} - 解析后的对象
     * @private
     */
    _parseFrontmatter(text) {
        const result = {};
        const lines = text.split('\n');
        
        for (const line of lines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex !== -1) {
                const key = line.slice(0, colonIndex).trim();
                let value = line.slice(colonIndex + 1).trim();
                
                // 删除值周围的引号
                if ((value.startsWith('"') && value.endsWith('"')) || 
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                result[key] = value;
            }
        }
        
        return result;
    }

    /**
     * 添加新文章
     * @param {Object} article - 文章配置
     */
    addArticle(article) {
        this.articlesConfig.push(article);
        // 重新加载文章
        this.loadArticles();
    }

    /**
     * 获取文章列表
     * @returns {Array} - 文章配置列表
     */
    getArticles() {
        return [...this.articlesConfig];
    }
}

export default ArticleManager; 