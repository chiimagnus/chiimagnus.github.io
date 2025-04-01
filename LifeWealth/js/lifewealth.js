/**
 * LifeWealth - 五种财富理念应用脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动功能
    initSmoothScrolling();
    
    // 移动端菜单交互
    initMobileMenu();
    
    // 初始化页面动画
    initAnimations();
});

/**
 * 初始化平滑滚动
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // 如果在移动端，点击导航后关闭菜单
                const mobileMenu = document.querySelector('.mobile-menu-open');
                if (mobileMenu) {
                    mobileMenu.classList.remove('mobile-menu-open');
                }
            }
        });
    });
}

/**
 * 初始化移动端菜单
 */
function initMobileMenu() {
    const menuToggle = document.createElement('div');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    if (header && nav) {
        header.appendChild(menuToggle);
        
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('mobile-menu-open');
            menuToggle.classList.toggle('active');
        });
    }
}

/**
 * 初始化页面动画
 */
function initAnimations() {
    // 检测元素是否在视口中
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    }
    
    // 添加动画类
    function addAnimationClass() {
        const elements = document.querySelectorAll('.feature-card, .section-title, .section-subtitle, .app-screenshot');
        
        elements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated', 'fade-in');
            }
        });
    }
    
    // 初始检查
    addAnimationClass();
    
    // 滚动时检查
    window.addEventListener('scroll', addAnimationClass);
}

// 跟踪5种财富平衡度的简单示例功能
class WealthBalance {
    constructor() {
        this.wealthTypes = {
            time: 0,
            social: 0,
            mental: 0,
            material: 0,
            experience: 0
        };
    }
    
    // 更新某类财富的平衡度
    updateBalance(type, value) {
        if (this.wealthTypes.hasOwnProperty(type)) {
            this.wealthTypes[type] = Math.max(0, Math.min(100, value));
            return true;
        }
        return false;
    }
    
    // 获取总体平衡度
    getOverallBalance() {
        const sum = Object.values(this.wealthTypes).reduce((a, b) => a + b, 0);
        return sum / Object.keys(this.wealthTypes).length;
    }
    
    // 获取最弱的财富类型
    getWeakestArea() {
        let weakestType = null;
        let lowestValue = 101;
        
        for (const [type, value] of Object.entries(this.wealthTypes)) {
            if (value < lowestValue) {
                lowestValue = value;
                weakestType = type;
            }
        }
        
        return {
            type: weakestType,
            value: lowestValue
        };
    }
}

// 导出功能，以便将来使用
window.LifeWealth = {
    WealthBalance: WealthBalance
}; 