/**
 * ProductManager - 产品管理器
 * 负责产品信息的加载、显示和交互
 */
import BaseModule from '../core/BaseModule.js';

class ProductManager extends BaseModule {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        super(options);
        
        // 产品相关元素
        this.productsContainer = null;
        this.productsGrid = null;
        
        // 产品配置
        this.productsConfig = options.products || [];
    }

    /**
     * 初始化产品管理器
     * @returns {ProductManager} - 返回模块实例
     */
    init() {
        if (this.initialized) return this;
        
        // 查找DOM元素
        this.productsContainer = document.getElementById('products');
        this.productsGrid = this.productsContainer ? this.productsContainer.querySelector('.products-grid') : null;
        
        // 加载产品
        if (this.productsGrid) {
            this.loadProducts();
        } else {
            console.error('未找到产品列表容器元素');
        }
        
        super.init();
        return this;
    }

    /**
     * 加载产品列表
     * @returns {Promise} - 加载完成的Promise
     */
    async loadProducts() {
        if (!this.productsGrid) {
            console.error('未找到产品列表容器');
            return;
        }
        
        // 如果没有预先配置的产品，可以尝试从配置文件加载
        if (this.productsConfig.length === 0) {
            try {
                const response = await fetch('js/config/products.json');
                if (response.ok) {
                    this.productsConfig = await response.json();
                    console.log('从配置文件加载了产品列表');
                } else {
                    console.error('加载产品配置失败:', response.status);
                }
            } catch (error) {
                console.error('加载产品配置失败:', error);
                // 使用一些默认配置
                this.productsConfig = [];
            }
        }
        
        // 清空容器
        if (this.productsGrid) {
            // 保留原有DOM，仅清空内容
            while (this.productsGrid.firstChild) {
                this.productsGrid.removeChild(this.productsGrid.firstChild);
            }
        }
        
        // 加载每个产品
        for (const product of this.productsConfig) {
            try {
                const productElement = document.createElement('article');
                productElement.className = 'product-card';
                
                let tagsHTML = '';
                if (product.tags && product.tags.length > 0) {
                    tagsHTML = product.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
                }
                
                // 添加状态标签（如果有）
                if (product.status) {
                    tagsHTML += `<span class="tag status">${product.status}</span>`;
                }
                
                let linksHTML = '';
                if (product.links && product.links.length > 0) {
                    linksHTML = product.links.map(link => 
                        `<a href="${link.url}" class="product-link" target="_blank">${link.text}</a>`
                    ).join('');
                }
                
                productElement.innerHTML = `
                    <div class="product-content">
                        <h3>${product.title}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-tags">
                            ${tagsHTML}
                        </div>
                        <div class="product-links">
                            ${linksHTML}
                        </div>
                    </div>
                `;
                
                if (this.productsGrid) {
                    this.productsGrid.appendChild(productElement);
                }
            } catch (error) {
                console.error(`加载产品 ${product.title} 失败:`, error);
            }
        }
        
        // 触发产品加载完成事件
        this.emit('products:loaded', { productsCount: this.productsConfig.length });
    }

    /**
     * 添加新产品
     * @param {Object} product - 产品配置
     */
    addProduct(product) {
        this.productsConfig.push(product);
        // 重新加载产品
        this.loadProducts();
    }

    /**
     * 获取产品列表
     * @returns {Array} - 产品配置列表
     */
    getProducts() {
        return [...this.productsConfig];
    }
}

export default ProductManager; 