/**
 * BaseModule - 所有模块的基类
 * 定义了模块的生命周期和通用接口
 */
class BaseModule {
    /**
     * 构造函数
     * @param {Object} options - 模块配置选项
     */
    constructor(options = {}) {
        this.options = options;
        this.initialized = false;
        this.eventListeners = [];
    }

    /**
     * 初始化模块
     * @returns {BaseModule} - 返回模块实例，支持链式调用
     */
    init() {
        if (this.initialized) return this;
        this.initialized = true;
        return this;
    }

    /**
     * 销毁模块，清理资源
     */
    destroy() {
        // 移除所有绑定的事件监听器
        this.eventListeners.forEach(listener => {
            const { element, type, callback, options } = listener;
            element.removeEventListener(type, callback, options);
        });
        this.eventListeners = [];
        this.initialized = false;
    }

    /**
     * 安全地添加事件监听器，便于后续统一移除
     * @param {Element} element - DOM元素
     * @param {string} type - 事件类型
     * @param {Function} callback - 事件回调函数
     * @param {Object} options - 事件选项
     */
    addEventListener(element, type, callback, options = {}) {
        element.addEventListener(type, callback, options);
        this.eventListeners.push({ element, type, callback, options });
    }

    /**
     * 触发自定义事件
     * @param {string} eventName - 事件名称
     * @param {Object} data - 事件数据
     */
    emit(eventName, data = {}) {
        const event = new CustomEvent(eventName, { 
            bubbles: true, 
            detail: data 
        });
        document.dispatchEvent(event);
    }

    /**
     * 监听自定义事件
     * @param {string} eventName - 事件名称
     * @param {Function} callback - 事件回调函数
     */
    on(eventName, callback) {
        const wrappedCallback = (e) => callback(e.detail);
        this.addEventListener(document, eventName, wrappedCallback);
    }
}

export default BaseModule; 