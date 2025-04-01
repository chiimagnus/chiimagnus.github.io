/**
 * LifeWealth - 产品页面交互脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动功能
    setupSmoothScroll();
    
    // 初始化特性卡片动画
    initFeatureCards();
    
    // 初始化返回主站按钮效果
    initBackButton();
});

/**
 * 设置平滑滚动功能
 */
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(!targetElement) return;
            
            const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * 初始化特性卡片动画
 */
function initFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach((card, index) => {
        // 添加延迟出现动画
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // 监听滚动，当卡片进入视口时添加动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100); // 依次显示
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(card);
    });
}

/**
 * 初始化返回主站按钮效果
 */
function initBackButton() {
    const backButton = document.querySelector('.back-to-main');
    
    if (backButton) {
        // 滚动时显示/隐藏返回按钮
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backButton.style.opacity = '1';
                backButton.style.transform = 'scale(1)';
            } else {
                backButton.style.opacity = '0.7';
                backButton.style.transform = 'scale(0.9)';
            }
        });
        
        // 初始状态
        backButton.style.opacity = '0.7';
        backButton.style.transform = 'scale(0.9)';
        backButton.style.transition = 'all 0.3s ease';
    }
} 