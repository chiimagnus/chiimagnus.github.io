/**
 * App - 应用程序入口点
 * 整合所有模块，初始化应用
 */
import ModuleFactory from './modules/core/ModuleFactory.js';
import ThemeManager from './modules/managers/ThemeManager.js';
import SearchManager from './modules/managers/SearchManager.js';
import ArticleManager from './modules/managers/ArticleManager.js';
import UIManager from './modules/managers/UIManager.js';

class App {
    /**
     * 构造函数
     * @param {Object} options - 应用程序配置选项
     */
    constructor(options = {}) {
        this.options = options;
        this.modules = ModuleFactory;
        
        // 注册模块
        this._registerModules();
    }

    /**
     * 注册所有模块
     * @private
     */
    _registerModules() {
        // 注册模块类
        this.modules.register('theme', ThemeManager);
        this.modules.register('search', SearchManager);
        this.modules.register('article', ArticleManager);
        this.modules.register('ui', UIManager);
    }

    /**
     * 初始化应用程序
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            // 创建并初始化UI管理器
            const uiManager = this.modules.create('ui', {});
            uiManager.init();
            
            // 创建并初始化主题管理器
            const themeManager = this.modules.create('theme', {
                defaultTheme: this.options.defaultTheme || 'rainbow'
            });
            themeManager.init();
            
            // 创建并初始化搜索管理器
            const searchManager = this.modules.create('search', {});
            searchManager.init();
            
            // 创建并初始化文章管理器
            const articleManager = this.modules.create('article', {
                visibleArticlesCount: 2
            });
            articleManager.init();
            
            // 可以在这里添加模块间的事件监听和交互
            this._setupModuleInteractions();
            
            // 应用程序初始化完成
            console.log('应用程序初始化完成');
            
            // 触发应用程序初始化完成事件
            const event = new CustomEvent('app:initialized', {
                detail: { app: this }
            });
            document.dispatchEvent(event);
        });
    }

    /**
     * 设置模块间的交互
     * @private
     */
    _setupModuleInteractions() {
        const uiManager = this.modules.get('ui');
        const themeManager = this.modules.get('theme');
        const searchManager = this.modules.get('search');
        const articleManager = this.modules.get('article');
        
        if (uiManager && themeManager) {
            // 当主题变化时更新UI
            document.addEventListener('theme:changed', (e) => {
                uiManager.showNotification(`主题已更改为: ${e.detail.theme}`, 'success');
            });
        }
        
        if (uiManager && searchManager) {
            // 当搜索完成时更新UI
            document.addEventListener('search:complete', (e) => {
                if (e.detail.matchCount === 0) {
                    uiManager.showNotification(`未找到匹配 "${e.detail.query}" 的内容`, 'info');
                }
            });
        }
        
        if (uiManager && articleManager) {
            // 当文章加载完成时更新UI
            document.addEventListener('articles:loaded', (e) => {
                console.log(`已加载 ${e.detail.articlesCount} 篇文章`);
                if (e.detail.articlesCount === 0) {
                    uiManager.showNotification('没有可显示的文章', 'info');
                }
            });
        }
    }
    
    /**
     * 获取模块实例
     * @param {string} name - 模块名称
     * @returns {Object|null} - 模块实例
     */
    getModule(name) {
        return this.modules.get(name);
    }
}

// 创建并导出应用实例
const app = new App({
    defaultTheme: 'rainbow'
});

// 初始化应用
app.init();

export default app; 