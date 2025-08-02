// 主要JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // 滚动时导航栏效果
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 移动端菜单切换
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 飞机动画增强
    const airplane = document.querySelector('.airplane-model');
    if (airplane) {
        let mouseX = 0;
        let mouseY = 0;
        let airplaneX = 0;
        let airplaneY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        });

        function animateAirplane() {
            airplaneX += (mouseX - airplaneX) * 0.1;
            airplaneY += (mouseY - airplaneY) * 0.1;
            
            airplane.style.transform = `translate(-50%, -50%) translateX(${airplaneX}px) translateY(${airplaneY}px) rotate(${airplaneX * 0.5}deg)`;
            requestAnimationFrame(animateAirplane);
        }
        animateAirplane();
    }

    // 功能卡片悬停效果
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 滚动动画观察器
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 为需要动画的元素添加观察
    const animatedElements = document.querySelectorAll('.feature-card, .tech-item, .section-header');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 代码高亮效果
    const codeContent = document.querySelector('.code-content code');
    if (codeContent) {
        const codeText = codeContent.textContent;
        const highlightedCode = codeText
            .replace(/(@Model|final|class|var|Date|Double|UUID)/g, '<span style="color: #569cd6;">$1</span>')
            .replace(/(FlightData|timestamp|speed|pitch|roll|yaw|sessionId)/g, '<span style="color: #9cdcfe;">$1</span>')
            .replace(/(\/\/.*)/g, '<span style="color: #6a9955;">$1</span>');
        
        codeContent.innerHTML = highlightedCode;
    }

    // 添加粒子背景效果
    createParticleBackground();
});

// 粒子背景效果
function createParticleBackground() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(0, 122, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: float-particle ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        hero.appendChild(particle);
    }
    
    // 添加粒子动画CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .particle {
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
}

// 性能优化：节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 移动端优化
if (window.innerWidth <= 768) {
    // 禁用某些动画以提高性能
    document.querySelectorAll('.particle').forEach(particle => {
        particle.remove();
    });
    
    // 简化飞机动画
    const airplane = document.querySelector('.airplane-model');
    if (airplane) {
        airplane.style.animation = 'float 2s ease-in-out infinite';
    }
}
