/**
 * ModuleFactory - 模块工厂类
 * 负责创建和管理不同类型的模块实例
 */
class ModuleFactory {
    constructor() {
        // 存储已创建的模块实例
        this.modules = new Map();
        // 存储已注册的模块类
        this.moduleClasses = new Map();
    }

    /**
     * 注册模块类
     * @param {string} type - 模块类型
     * @param {Class} ModuleClass - 模块类
     */
    register(type, ModuleClass) {
        this.moduleClasses.set(type, ModuleClass);
        return this;
    }

    /**
     * 创建模块实例
     * @param {string} type - 模块类型
     * @param {Object} options - 模块配置选项
     * @returns {Object} - 创建的模块实例
     */
    create(type, options = {}) {
        // 检查是否已注册该类型的模块
        if (!this.moduleClasses.has(type)) {
            throw new Error(`未找到模块类型: ${type}`);
        }

        // 创建模块实例
        const ModuleClass = this.moduleClasses.get(type);
        const instance = new ModuleClass(options);
        
        // 存储模块实例
        this.modules.set(type, instance);
        
        return instance;
    }

    /**
     * 获取已创建的模块实例
     * @param {string} type - 模块类型
     * @returns {Object|null} - 模块实例或null
     */
    get(type) {
        return this.modules.get(type) || null;
    }

    /**
     * 检查模块是否已经创建
     * @param {string} type - 模块类型
     * @returns {boolean} - 是否已创建
     */
    has(type) {
        return this.modules.has(type);
    }

    /**
     * 销毁模块实例
     * @param {string} type - 模块类型
     */
    destroy(type) {
        if (this.modules.has(type)) {
            const module = this.modules.get(type);
            if (typeof module.destroy === 'function') {
                module.destroy();
            }
            this.modules.delete(type);
        }
    }

    /**
     * 销毁所有模块实例
     */
    destroyAll() {
        this.modules.forEach((module, type) => {
            this.destroy(type);
        });
    }
}

// 导出单例
export default new ModuleFactory(); 