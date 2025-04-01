/**
 * UIManager - UI管理器
 * 负责处理整体用户界面和交互
 */
import BaseModule from '../core/BaseModule.js';

class UIManager extends BaseModule {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        super(options);
        
        // UI元素
        this.container = null;
        this.content = null;
        this.sidebar = null;
        this.navItems = null;
        
        // 媒体查询
        this.mobileMediaQuery = window.matchMedia('(max-width: 768px)');
        
        // 动画帧请求ID
        this.animationFrame = null;
    }

    /**
     * 初始化UI管理器
     * @returns {UIManager} - 返回模块实例
     */
    init() {
        if (this.initialized) return this;
        
        // 查找DOM元素
        this.container = document.querySelector('.container');
        this.content = document.querySelector('.content');
        this.sidebar = document.querySelector('.sidebar');
        this.navItems = document.querySelectorAll('.nav-item');
        
        // 绑定事件
        this._bindEvents();
        
        // 初始化UI状态
        this._initUI();
        
        super.init();
        return this;
    }

    /**
     * 绑定事件处理函数
     * @private
     */
    _bindEvents() {
        // 导航项点击事件
        if (this.navItems) {
            this.navItems.forEach(item => {
                this.addEventListener(item, 'click', (e) => {
                    const target = e.currentTarget.getAttribute('data-target');
                    if (target) {
                        this.navigateTo(target);
                    }
                });
            });
        }
        
        // 监听窗口调整大小
        this.addEventListener(window, 'resize', this._handleResize.bind(this));
        
        // 监听移动端媒体查询变化
        this.mobileMediaQuery.addEventListener('change', this._handleMediaQueryChange.bind(this));
        
        // 监听页面滚动，添加阴影效果
        this.addEventListener(window, 'scroll', this._handleScroll.bind(this));
    }

    /**
     * 初始化UI状态
     * @private
     */
    _initUI() {
        // 初始化导航选中状态
        this._updateNavState();
        
        // 处理移动端状态
        this._handleMediaQueryChange({ matches: this.mobileMediaQuery.matches });
        
        // 初始化滚动状态
        this._handleScroll();
    }

    /**
     * 处理窗口调整大小
     * @private
     */
    _handleResize() {
        // 使用 requestAnimationFrame 优化性能
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        this.animationFrame = requestAnimationFrame(() => {
            // 执行需要响应窗口大小变化的操作
            this._updateLayout();
        });
    }

    /**
     * 处理媒体查询变化
     * @param {MediaQueryListEvent} event - 媒体查询事件
     * @private
     */
    _handleMediaQueryChange(event) {
        if (event.matches) {
            // 切换到移动视图
            this._enableMobileView();
        } else {
            // 切换到桌面视图
            this._enableDesktopView();
        }
    }

    /**
     * 处理页面滚动
     * @private
     */
    _handleScroll() {
        // 使用 requestAnimationFrame 优化性能
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        this.animationFrame = requestAnimationFrame(() => {
            const header = document.querySelector('header');
            if (header) {
                if (window.scrollY > 0) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });
    }

    /**
     * 更新布局
     * @private
     */
    _updateLayout() {
        // 可以在这里添加更新布局的代码
        // 例如调整元素尺寸或位置
    }

    /**
     * 启用移动视图
     * @private
     */
    _enableMobileView() {
        if (this.container) {
            this.container.classList.add('mobile-view');
        }
        
        // 触发事件
        this.emit('ui:mobileViewEnabled', {});
    }

    /**
     * 启用桌面视图
     * @private
     */
    _enableDesktopView() {
        if (this.container) {
            this.container.classList.remove('mobile-view');
        }
        
        // 触发事件
        this.emit('ui:desktopViewEnabled', {});
    }

    /**
     * 导航到指定部分
     * @param {string} target - 目标ID
     */
    navigateTo(target) {
        const element = document.getElementById(target);
        if (!element) return;
        
        // 滚动到目标元素
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // 更新导航状态
        this._updateNavState(target);
        
        // 触发事件
        this.emit('ui:navigated', { target });
    }

    /**
     * 更新导航选中状态
     * @param {string} activeTarget - 活动目标
     * @private
     */
    _updateNavState(activeTarget = null) {
        if (!this.navItems) return;
        
        // 如果未提供活动目标，尝试从URL或当前可见部分确定
        if (!activeTarget) {
            // 从URL哈希中获取
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                activeTarget = hash;
            } else {
                // 获取当前可见部分
                activeTarget = this._getCurrentVisibleSection();
            }
        }
        
        // 更新导航项状态
        this.navItems.forEach(item => {
            const target = item.getAttribute('data-target');
            if (target === activeTarget) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * 获取当前可见部分
     * @returns {string|null} - 当前可见部分的ID
     * @private
     */
    _getCurrentVisibleSection() {
        const sections = document.querySelectorAll('section[id]');
        
        let currentSection = null;
        let maxVisibility = 0;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // 计算可见部分高度
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const visibility = visibleHeight / section.clientHeight;
            
            if (visibility > maxVisibility) {
                maxVisibility = visibility;
                currentSection = section.id;
            }
        });
        
        return currentSection;
    }

    /**
     * 显示加载指示器
     */
    showLoader() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.classList.add('active');
        }
    }

    /**
     * 隐藏加载指示器
     */
    hideLoader() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.classList.remove('active');
        }
    }

    /**
     * 显示通知消息
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (success, error, info, warning)
     * @param {number} duration - 显示持续时间 (毫秒)
     */
    showNotification(message, type = 'info', duration = 3000) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // 添加到文档
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 自动关闭
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
}

export default UIManager; 