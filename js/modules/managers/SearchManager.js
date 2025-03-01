/**
 * SearchManager - 搜索管理器
 * 负责处理网站内容搜索功能
 */
import BaseModule from '../core/BaseModule.js';

class SearchManager extends BaseModule {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        super(options);
        
        // 搜索相关元素
        this.searchInput = null;
        
        // 可搜索区域配置
        this.searchableAreas = options.searchableAreas || [
            {
                selector: '.article-preview',
                type: 'articles'
            },
            {
                selector: '.product-card',
                type: 'products'
            },
            {
                selector: '.about-content',
                type: 'about',
                isSingle: true
            }
        ];
        
        // 搜索历史
        this.searchHistory = [];
        
        // 最大历史记录数
        this.maxHistoryItems = options.maxHistoryItems || 5;
    }

    /**
     * 初始化搜索管理器
     * @returns {SearchManager} - 返回模块实例
     */
    init() {
        if (this.initialized) return this;
        
        // 查找DOM元素
        this.searchInput = document.getElementById('searchInput');
        
        // 如果有本地存储的搜索历史，则加载它
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            try {
                this.searchHistory = JSON.parse(savedHistory);
            } catch (e) {
                console.error('无法解析搜索历史:', e);
                this.searchHistory = [];
            }
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
        if (this.searchInput) {
            // 搜索输入事件
            this.addEventListener(this.searchInput, 'input', (e) => {
                const query = e.target.value.toLowerCase();
                this.search(query);
            });
            
            // 快捷键 cmd+k 触发搜索框聚焦
            this.addEventListener(document, 'keydown', (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    this.searchInput.focus();
                }
            });
        }
    }

    /**
     * 执行搜索
     * @param {string} query - 搜索关键词
     */
    search(query) {
        // 如果查询为空，显示所有内容
        if (!query) {
            this.showAllContent();
            this.emit('search:reset', {});
            return;
        }
        
        // 对每个可搜索区域执行搜索
        let matchCount = 0;
        
        this.searchableAreas.forEach(area => {
            const elements = area.isSingle 
                ? [document.querySelector(area.selector)].filter(Boolean)
                : document.querySelectorAll(area.selector);
            
            elements.forEach(element => {
                const text = element.textContent.toLowerCase();
                const isMatch = text.includes(query);
                
                element.style.display = isMatch ? 'block' : 'none';
                
                if (isMatch) {
                    matchCount++;
                    // 可以在这里添加高亮匹配文本的逻辑
                }
            });
        });
        
        // 保存到搜索历史
        this._addToHistory(query);
        
        // 触发搜索事件
        this.emit('search:complete', {
            query,
            matchCount
        });
    }

    /**
     * 显示所有内容（重置搜索）
     */
    showAllContent() {
        this.searchableAreas.forEach(area => {
            const elements = area.isSingle 
                ? [document.querySelector(area.selector)].filter(Boolean)
                : document.querySelectorAll(area.selector);
            
            elements.forEach(element => {
                element.style.display = 'block';
                
                // 移除可能添加的高亮效果
                // 可以在这里添加移除高亮的逻辑
            });
        });
    }

    /**
     * 添加关键词到搜索历史
     * @param {string} query - 搜索关键词
     * @private
     */
    _addToHistory(query) {
        // 忽略空查询
        if (!query.trim()) return;
        
        // 如果已存在相同的查询，先移除旧的
        const index = this.searchHistory.indexOf(query);
        if (index !== -1) {
            this.searchHistory.splice(index, 1);
        }
        
        // 添加到历史的开头
        this.searchHistory.unshift(query);
        
        // 限制历史记录数量
        if (this.searchHistory.length > this.maxHistoryItems) {
            this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
        }
        
        // 保存到本地存储
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    /**
     * 获取搜索历史
     * @returns {Array} - 搜索历史数组
     */
    getHistory() {
        return [...this.searchHistory];
    }

    /**
     * 清除搜索历史
     */
    clearHistory() {
        this.searchHistory = [];
        localStorage.removeItem('searchHistory');
        this.emit('search:historyCleared', {});
    }
}

export default SearchManager; 