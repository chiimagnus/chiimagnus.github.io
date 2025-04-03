/**
 * 语言切换功能
 * 支持中英文切换
 */

// 语言数据对象
const languageData = {
    zh: {
        // Meta 数据
        'meta-description': '时间和关系管理工具，帮助你珍惜与重要的人相处的时间。',
        
        // 导航栏
        'logo-text': '人生财富',
        'nav-about': '关于理念',
        'nav-contacts': '重要的人',
        'nav-records': '活动记录',
        
        // 英文按钮文本
        'lang-text': 'English',
        
        // 首页英雄区
        'hero-tagline': '珍惜时间，珍视关系',
        'hero-subtitle': '你很清楚自己每个月收入多少，但没有一个倒计时表，告诉你还剩下多少次见到父母的机会，还能再陪孩子度过多少个完整的周末。',
        'manage-contacts-btn': '管理重要的人',
        
        // 关于理念
        'about-title': '认识时间的真正价值',
        'lead-text': '为什么我们对金钱特别敏感，对陪伴父母的次数不敏感？因为金钱是非常可测量的。',
        'quote-text': '当时他(作者)在加州工作，而他的父母住在美国东海岸。有一次一个朋友问他，你多久见一次你的父母？他说大概一年一次。朋友又问你父母现在多大年纪了？他说65岁左右。然后朋友淡淡地说了一句："那你大概还能再见他们15次。"',
        'quote-author': '— 摘自《五种财富》，萨希尔·布卢姆著',
        'insight-text': '你很清楚自己每个月收入多少。但是并没有一个倒计时表，告诉你还剩下多少次见到父母的机会，还能再陪孩子度过多少个完整的周末。',
        'caption-time': '珍惜与重要的人相处的时光',
        
        // 联系人管理
        'contacts-title': '管理重要的社交关系',
        'contacts-desc': '添加并管理与你生命中重要的人，了解你们相处的宝贵时间。',
        'feature-manage-contacts': '管理重要联系人',
        'feature-manage-contacts-desc': '添加父母、子女、朋友等重要人物',
        'feature-set-frequency': '设置见面频率',
        'feature-set-frequency-desc': '每天、每周、每月或自定义时间间隔',
        'feature-import-contacts': '从通讯录导入',
        'feature-import-contacts-desc': '一键导入已有联系人信息',
        'caption-contacts': '联系人管理 - 添加并管理生命中重要的人',
        
        // 活动记录
        'records-title': '活动记录',
        'records-subtitle': '记录与重要的人相处的点滴，珍藏美好回忆',
        'create-activity': '创建活动记录',
        'create-activity-desc': '记录与重要的人相处的活动、经历和感受，添加照片和思考。',
        'view-stats': '查看时间统计',
        'view-stats-desc': '追踪与不同人相处的时间，发现需要更多关注的关系。',
        'caption-activities': '活动记录 - 记录与重要的人相处的点滴',
        
        // 底部CTA
        'cta-title': '开始珍惜与重要的人相处的时间',
        'cta-description': '记录重要的人和活动，不再错过珍贵的相处时光',
        'start-now-btn': '立即开始',
        
        // 页脚
        'footer-desc': '珍惜时间，珍视关系，记录与重要的人相处的珍贵时光。',
        'footer-features': '功能',
        'footer-link-contacts': '联系人管理',
        'footer-link-records': '活动记录',
        'footer-resources': '资源',
        'footer-link-about': '关于理念',
        'footer-link-guide': '使用指南',
        'footer-link-faq': '常见问题',
        'footer-contact': '联系我们',
        'footer-link-email': '邮箱: chii_magnus@outlook.com',
        'footer-link-github': 'GitHub',
        'footer-copyright': '© 2025 Who Matters by Chii Magnus. All rights reserved.'
    },
    
    en: {
        // Meta data
        'meta-description': 'Time and relationship management tool, helping you cherish the time spent with important people.',
        
        // Navigation
        'logo-text': 'Who Matters',
        'nav-about': 'About',
        'nav-contacts': 'Important People',
        'nav-records': 'Activity Records',
        
        // Language button text
        'lang-text': '中文',
        
        // Hero section
        'hero-tagline': 'Cherish Time, Value Relationships',
        'hero-subtitle': 'Connect with who matters - they define your life\'s value.',
        'manage-contacts-btn': 'Manage Important People',
        
        // About concept
        'about-title': 'Recognize the True Value of Time',
        'lead-text': 'Why are we so sensitive to money but not to how often we see our parents? Because money is highly measurable.',
        'quote-text': 'At that time, the author was working in California while his parents lived on the East Coast of the US. Once, a friend asked him, "How often do you see your parents?" He said about once a year. The friend then asked, "How old are your parents now?" He said around 65. Then the friend calmly said, "So you probably have about 15 more times to see them."',
        'quote-author': '— Excerpt from "Die With Zero" by Bill Perkins',
        'insight-text': 'You know exactly how much you earn each month. But there\'s no countdown timer telling you how many more chances you have to see your parents, or how many complete weekends you can spend with your children.',
        'caption-time': 'Cherish the time spent with important people',
        
        // Contact management
        'contacts-title': 'Manage Important Social Relationships',
        'contacts-desc': 'Add and manage the important people in your life, understanding the precious time you spend together.',
        'feature-manage-contacts': 'Manage Important Contacts',
        'feature-manage-contacts-desc': 'Add parents, children, friends, and other important people',
        'feature-set-frequency': 'Set Meeting Frequency',
        'feature-set-frequency-desc': 'Daily, weekly, monthly, or custom time intervals',
        'feature-import-contacts': 'Import from Contacts',
        'feature-import-contacts-desc': 'One-click import of existing contact information',
        'caption-contacts': 'Contact Management - Add and manage important people in your life',
        
        // Activity records
        'records-title': 'Activity Records',
        'records-subtitle': 'Record the moments spent with important people, treasure beautiful memories',
        'create-activity': 'Create Activity Records',
        'create-activity-desc': 'Record activities, experiences, and feelings with important people, add photos and reflections.',
        'view-stats': 'View Time Statistics',
        'view-stats-desc': 'Track time spent with different people, discover relationships that need more attention.',
        'caption-activities': 'Activity Records - Record the moments spent with important people',
        
        // CTA section
        'cta-title': 'Start Cherishing the Time with Important People',
        'cta-description': 'Record important people and activities, never miss precious time together',
        'start-now-btn': 'Start Now',
        
        // Footer
        'footer-desc': 'Cherish time, value relationships, record the precious moments spent with important people.',
        'footer-features': 'Features',
        'footer-link-contacts': 'Contact Management',
        'footer-link-records': 'Activity Records',
        'footer-resources': 'Resources',
        'footer-link-about': 'About the Concept',
        'footer-link-guide': 'User Guide',
        'footer-link-faq': 'FAQ',
        'footer-contact': 'Contact Us',
        'footer-link-email': 'Email: chii_magnus@outlook.com',
        'footer-link-github': 'GitHub',
        'footer-copyright': '© 2025 Who Matters by Chii Magnus. All rights reserved.'
    }
};

// 当前语言，默认为中文
let currentLanguage = 'zh';

// 在页面加载时初始化语言切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取语言切换按钮
    const languageToggle = document.getElementById('languageToggle');
    
    // 添加点击事件
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            // 切换语言
            currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
            
            // 更新页面文本
            updatePageLanguage();
            
            // 更新语言按钮文本
            updateLanguageButton();
            
            // 保存语言偏好到本地存储
            localStorage.setItem('preferredLanguage', currentLanguage);
        });
    }
    
    // 检查本地存储中的语言偏好
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
        updatePageLanguage();
        updateLanguageButton();
    }
});

// 更新页面上的所有文本
function updatePageLanguage() {
    // 更新HTML语言属性
    document.documentElement.lang = currentLanguage;
    
    // 特殊处理导航元素 - 直接通过具体类名选择
    const navAbout = document.querySelector('.nav-about');
    const navContacts = document.querySelector('.nav-contacts');
    const navRecords = document.querySelector('.nav-records');
    
    if (navAbout) navAbout.textContent = languageData[currentLanguage]['nav-about'];
    if (navContacts) navContacts.textContent = languageData[currentLanguage]['nav-contacts'];
    if (navRecords) navRecords.textContent = languageData[currentLanguage]['nav-records'];
    
    // 特殊处理首页标语
    const heroTagline = document.querySelector('.hero-tagline');
    if (heroTagline) heroTagline.textContent = languageData[currentLanguage]['hero-tagline'];
    
    // 处理其他元素
    const languageItems = document.querySelectorAll('[class*="-text"], [class*="-title"], [class*="-subtitle"], [class*="-desc"], [class*="-btn"], [class*="caption-"], [class*="feature-"], [class*="footer-link-"], .meta-description');
    
    languageItems.forEach(element => {
        // 获取元素的类名，查找匹配的翻译键
        const classes = element.className.split(' ');
        let translationKey = null;
        
        // 寻找匹配的翻译键
        for (const className of classes) {
            if (languageData[currentLanguage][className]) {
                translationKey = className;
                break;
            }
        }
        
        // 如果找到匹配的键，则更新文本或内容
        if (translationKey) {
            if (element.tagName.toLowerCase() === 'meta') {
                element.setAttribute('content', languageData[currentLanguage][translationKey]);
            } else {
                element.textContent = languageData[currentLanguage][translationKey];
            }
        }
    });
    
    // 特殊处理email链接，因为它包含额外文本
    const emailLink = document.querySelector('.footer-link-email');
    if (emailLink) {
        emailLink.textContent = languageData[currentLanguage]['footer-link-email'];
    }
}

// 更新语言切换按钮的文本
function updateLanguageButton() {
    const langText = document.querySelector('.lang-text');
    if (langText) {
        langText.textContent = languageData[currentLanguage]['lang-text'];
    }
} 