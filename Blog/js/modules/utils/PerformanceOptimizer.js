/**
 * PerformanceOptimizer - 性能优化工具
 * 提供通用的性能优化功能，可在不同页面中使用
 */
class PerformanceOptimizer {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        // 配置项
        this.scrollThrottleDelay = options.scrollThrottleDelay || 50;
        this.scrollEndDelay = options.scrollEndDelay || 150;
        
        // 状态
        this.isScrolling = false;
        this.lastScrollTime = 0;
        this.scrollTimer = null;
        this.animationFrame = null;
        
        // 绑定方法
        this._handleScroll = this._handleScroll.bind(this);
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化性能优化
     */
    init() {
        // 添加滚动事件监听
        window.addEventListener('scroll', this._handleScroll, { passive: true });
        
        // 优化DOM元素
        this._optimizeElements();
        
        // 预加载资源
        this._preloadResources();
        
        // 优化图像加载
        this._optimizeImages();
        
        // 定期优化图像加载（适用于动态加载的内容）
        setInterval(() => {
            this._optimizeImages();
        }, 3000);
        
        console.log('性能优化模块已初始化');
    }

    /**
     * 处理滚动事件
     * @private
     */
    _handleScroll() {
        const now = Date.now();
        
        // 应用滚动节流
        if (now - this.lastScrollTime < this.scrollThrottleDelay) {
            return;
        }
        
        this.lastScrollTime = now;
        
        // 标记滚动状态，但不应用影响背景颜色的class
        if (!this.isScrolling) {
            this.isScrolling = true;
            // 不再添加会影响背景颜色的class
            // document.body.classList.add('is-scrolling');
            
            // 可以用自定义属性标记滚动状态，而不影响样式
            document.body.setAttribute('data-scrolling', 'true');
        }
        
        // 清除之前的定时器
        if (this.scrollTimer) {
            clearTimeout(this.scrollTimer);
        }
        
        // 设置滚动结束检测
        this.scrollTimer = setTimeout(() => {
            this.isScrolling = false;
            // document.body.classList.remove('is-scrolling');
            document.body.removeAttribute('data-scrolling');
            
            // 滚动结束后延迟一帧再恢复样式，避免卡顿
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                    // 双重requestAnimationFrame确保平滑过渡
                });
            });
        }, this.scrollEndDelay);
    }
    
    /**
     * 优化DOM元素
     * @private
     */
    _optimizeElements() {
        // 预先设置transform以激活GPU加速
        const elementsToOptimize = [
            document.body,
            document.querySelector('.container'),
            document.querySelector('.main-content'),
            ...Array.from(document.querySelectorAll('article, .product-card, .avatar-container'))
        ];
        
        // 应用GPU加速
        elementsToOptimize.forEach(el => {
            if (el) {
                // 强制GPU渲染
                el.style.transform = 'translateZ(0)';
                el.style.backfaceVisibility = 'hidden';
                el.style.willChange = 'transform';
            }
        });
    }
    
    /**
     * 预加载资源
     * @private
     */
    _preloadResources() {
        // 预加载关键图片
        const preloadImages = () => {
            const images = Array.from(document.querySelectorAll('img[src]'));
            images.forEach(img => {
                if (img.dataset.src) {
                    const preloadLink = document.createElement('link');
                    preloadLink.rel = 'preload';
                    preloadLink.as = 'image';
                    preloadLink.href = img.dataset.src;
                    document.head.appendChild(preloadLink);
                }
            });
        };
        
        // 在页面加载完成后执行预加载
        if (document.readyState === 'complete') {
            preloadImages();
        } else {
            window.addEventListener('load', preloadImages);
        }
    }
    
    /**
     * 优化图像加载
     * @private
     */
    _optimizeImages() {
        // 查找所有图片元素
        const images = Array.from(document.querySelectorAll('img'));
        
        // 为每个图片应用懒加载
        images.forEach(img => {
            // 跳过已处理的图片
            if (img.dataset.optimized) return;
            
            // 为未加载的图片设置懒加载
            if (!img.dataset.src && img.src) {
                const originalSrc = img.src;
                
                // 只有在视口中才加载图片
                if (!this._isElementInViewport(img)) {
                    img.dataset.src = originalSrc;
                    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
                    
                    // 创建IntersectionObserver来监测图片何时进入视口
                    const observer = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const image = entry.target;
                                if (image.dataset.src) {
                                    image.src = image.dataset.src;
                                    image.removeAttribute('data-src');
                                }
                                observer.unobserve(image);
                            }
                        });
                    }, {
                        rootMargin: '200px 0px' // 提前200px开始加载图片
                    });
                    
                    observer.observe(img);
                }
            }
            
            // 标记图片已处理
            img.dataset.optimized = 'true';
        });
    }
    
    /**
     * 判断元素是否在视口中
     * @param {Element} el - 要检查的元素
     * @returns {boolean} - 是否在视口中
     * @private
     */
    _isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 1.2 &&
            rect.bottom >= 0 &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth) * 1.2 &&
            rect.right >= 0
        );
    }
    
    /**
     * 销毁实例
     */
    destroy() {
        window.removeEventListener('scroll', this._handleScroll);
        
        if (this.scrollTimer) {
            clearTimeout(this.scrollTimer);
        }
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        console.log('性能优化模块已销毁');
    }
}

export default PerformanceOptimizer;