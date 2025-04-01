/**
 * App - 应用程序入口点
 * 整合所有模块，初始化应用
 */
import ModuleFactory from './modules/core/ModuleFactory.js';
import ThemeManager from './modules/managers/ThemeManager.js';
import SearchManager from './modules/managers/SearchManager.js';
import ArticleManager from './modules/managers/ArticleManager.js';
import ProductManager from './modules/managers/ProductManager.js';
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
        this.modules.register('product', ProductManager);
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
                visibleArticlesCount: 3
            });
            articleManager.init();
            
            // 创建并初始化产品管理器
            const productManager = this.modules.create('product', {});
            productManager.init();
            
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