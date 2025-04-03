/**
 * LifeWealth 页面性能优化脚本
 */

// 滚动优化变量
let isScrolling = false;
let lastScrollTime = 0;
let scrollTimer = null;
const scrollThrottleDelay = 50;
const scrollEndDelay = 150;

// 保存原始滚动处理函数引用
let originalScrollHandlers = [];

// 初始化函数
function init() {
    // 添加样式
    addPerformanceStyles();
    
    // 备份所有现有的滚动事件处理函数
    saveOriginalScrollHandlers();
    
    // 移除原有的滚动事件监听器，使用我们的优化版本
    window.removeEventListener('scroll', addAnimationClass);
    
    // 注册滚动事件
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 优化DOM元素
    optimizeElements();
    
    console.log('LifeWealth 性能优化已启用');
}

// 保存原始滚动处理函数
function saveOriginalScrollHandlers() {
    // 保存原始动画类添加函数的引用，如果它存在的话
    if (typeof addAnimationClass === 'function') {
        originalScrollHandlers.push(addAnimationClass);
    }
}

// 处理滚动事件
function handleScroll() {
    const now = Date.now();
    
    // 应用滚动节流
    if (now - lastScrollTime < scrollThrottleDelay) {
        return;
    }
    
    lastScrollTime = now;
    
    // 标记滚动状态
    if (!isScrolling) {
        isScrolling = true;
        document.body.classList.add('is-scrolling');
        
        // 强制重新计算样式，确保滚动优化立即生效
        window.requestAnimationFrame(() => {
            document.body.offsetHeight; // 触发重排
        });
    }
    
    // 清除之前的定时器
    if (scrollTimer) {
        clearTimeout(scrollTimer);
    }
    
    // 设置滚动结束检测
    scrollTimer = setTimeout(() => {
        isScrolling = false;
        document.body.classList.remove('is-scrolling');
        
        // 滚动结束后延迟一帧再恢复样式，避免卡顿
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                // 双重requestAnimationFrame确保平滑过渡
                
                // 滚动结束后执行原始滚动处理函数
                originalScrollHandlers.forEach(handler => {
                    try {
                        handler();
                    } catch (e) {
                        console.error('执行原始滚动处理函数时出错:', e);
                    }
                });
            });
        });
    }, scrollEndDelay);
    
    // 使用requestAnimationFrame执行原始滚动处理函数
    // 这样可以将它们的执行时间推迟到下一帧，减少滚动期间的计算
    window.requestAnimationFrame(() => {
        // 暂不执行原始处理函数，等到滚动结束后再执行
    });
}

// 添加性能优化样式
function addPerformanceStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        /* 预加载元素，提高初始渲染速度 */
        body, main, section, .container, .card, .feature-card {
            will-change: transform;
            transform: translateZ(0);
            backface-visibility: hidden;
        }
        
        /* 滚动时优化样式 */
        body.is-scrolling {
            pointer-events: none;
        }
        
        body.is-scrolling {
            /* 滚动时简化背景以提高性能 */
            background-image: none !important;
            animation: none !important;
        }
        
        body.is-scrolling .container {
            animation-play-state: paused;
        }
        
        body.is-scrolling .card,
        body.is-scrolling .feature-card,
        body.is-scrolling section,
        body.is-scrolling header {
            /* 滚动时简化卡片效果 */
            transition: none !important;
            transform: translateZ(0);
            box-shadow: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
        }
        
        body.is-scrolling * {
            animation-play-state: paused;
            text-shadow: none !important;
            box-shadow: none !important;
        }

        /* 优化动画性能 */
        .fade-in {
            will-change: opacity, transform;
        }
    `;
    document.head.appendChild(styleEl);
}

// 优化DOM元素
function optimizeElements() {
    // 预先设置transform以激活GPU加速
    const elementsToOptimize = [
        document.body,
        document.querySelector('.container'),
        ...Array.from(document.querySelectorAll(
            '.feature-card, .section-title, .section-subtitle, .app-screenshot, header, footer, section'
        ))
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
    
    // 如果已经有动画元素，优化它们
    const animatedElements = document.querySelectorAll('.animated, .fade-in');
    animatedElements.forEach(el => {
        if (el) {
            el.style.willChange = 'opacity, transform';
        }
    });
}

// DOM加载完成后执行初始化
document.addEventListener('DOMContentLoaded', init);