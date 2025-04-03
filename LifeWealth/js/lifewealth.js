/**
 * LifeWealth - 时间与关系管理应用脚本
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
                // 获取导航栏高度，用于计算滚动偏移量
                const headerHeight = document.querySelector('header').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // 如果在移动端，点击导航后关闭菜单
                const nav = document.querySelector('nav');
                const menuToggle = document.querySelector('.mobile-menu-toggle');
                const backdrop = document.querySelector('.menu-backdrop');
                
                if (nav && nav.classList.contains('mobile-menu-open')) {
                    nav.classList.remove('mobile-menu-open');
                    if (menuToggle) menuToggle.classList.remove('active');
                    if (backdrop) backdrop.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

/**
 * 初始化移动端菜单
 */
function initMobileMenu() {
    // 创建汉堡菜单按钮
    const menuToggle = document.createElement('div');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.setAttribute('aria-label', '菜单');
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    
    // 创建背景遮罩
    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    
    // 获取header和nav元素
    const headerContainer = document.querySelector('.header-container');
    const nav = document.querySelector('nav');
    
    if (headerContainer && nav) {
        // 添加菜单按钮到header-container和背景遮罩到body
        headerContainer.appendChild(menuToggle);
        document.body.appendChild(backdrop);
        
        // 点击汉堡菜单切换导航显示
        menuToggle.addEventListener('click', function() {
            toggleMobileMenu();
        });
        
        // 点击背景遮罩关闭菜单
        backdrop.addEventListener('click', function() {
            toggleMobileMenu(false);
        });
        
        // 监听窗口调整大小
        window.addEventListener('resize', handleResize);
    }
    
    // 切换移动菜单显示状态
    function toggleMobileMenu(show) {
        const shouldShow = show !== undefined ? show : !nav.classList.contains('mobile-menu-open');
        
        if (shouldShow) {
            nav.classList.add('mobile-menu-open');
            menuToggle.classList.add('active');
            backdrop.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        } else {
            nav.classList.remove('mobile-menu-open');
            menuToggle.classList.remove('active');
            backdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // 处理窗口大小变化
    function handleResize() {
        // 如果进入桌面视图，自动关闭移动菜单
        if (window.innerWidth > 768) {
            if (nav.classList.contains('mobile-menu-open')) {
                toggleMobileMenu(false);
            }
        }
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

// 导出函数，以便将来使用
window.LifeWealth = {
    initSmoothScrolling,
    initMobileMenu,
    initAnimations
}; 