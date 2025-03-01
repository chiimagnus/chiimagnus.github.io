/**
 * ThemeManager - 主题管理器
 * 负责管理网站的主题和颜色方案
 */
import BaseModule from '../core/BaseModule.js';
import ColorUtils from '../utils/ColorUtils.js';

class ThemeManager extends BaseModule {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        super(options);
        
        // 主题相关元素
        this.paletteButton = null;
        this.colorPalette = null;
        this.closePalette = null;
        this.colorOptions = null;
        this.colorWheel = null;
        this.colorDots = null;
        this.previewGradient = null;
        this.colorInputs = {
            primary: null,
            secondary: null,
            accent: null
        };
        
        // 默认主题
        this.defaultTheme = options.defaultTheme || 'rainbow';
        
        // 当前激活的主题
        this.activeTheme = null;
        
        // 预定义的主题配置
        this.themes = {
            rainbow: { 
                primary: '#ff6b6b',
                secondary: '#6c5ce7',
                gradient: 'linear-gradient(45deg, #ff6b6b 0%, #ffd93d 20%, #6c5ce7 40%, #00b894 60%, #0984e3 80%, #e84393 100%)'
            },
            aurora: {
                primary: '#2d3436',
                secondary: '#81ecec',
                gradient: 'linear-gradient(45deg, #2d3436 0%, #6c5ce7 30%, #00b894 60%, #81ecec 100%)'
            },
            'sunset-beach': {
                primary: '#e17055',
                secondary: '#00cec9',
                gradient: 'linear-gradient(45deg, #e17055 0%, #fdcb6e 30%, #0984e3 70%, #00cec9 100%)'
            },
            'cherry-blossom': {
                primary: '#e84393',
                secondary: '#dfe6e9',
                gradient: 'linear-gradient(45deg, #e84393 0%, #fd79a8 30%, #fab1a0 60%, #dfe6e9 100%)'
            },
            autumn: {
                primary: '#d63031',
                secondary: '#ffeaa7',
                gradient: 'linear-gradient(45deg, #d63031 0%, #fdcb6e 50%, #ffeaa7 100%)'
            },
            'neon-noir': {
                primary: '#ff00ff',
                secondary: '#00ffff',
                gradient: 'linear-gradient(45deg, #000000 0%, #1a1a1a 30%, #ff00ff 60%, #00ffff 80%, #000000 100%)'
            }
        };
    }

    /**
     * 初始化主题管理器
     * @returns {ThemeManager} - 返回模块实例
     */
    init() {
        if (this.initialized) return this;
        
        // 查找DOM元素
        this.paletteButton = document.getElementById('paletteButton');
        this.colorPalette = document.getElementById('colorPalette');
        this.closePalette = document.getElementById('closePalette');
        this.colorOptions = document.querySelectorAll('.color-option');
        this.colorWheel = document.querySelector('.color-wheel');
        this.colorDots = document.querySelectorAll('.color-dot');
        this.previewGradient = document.querySelector('.preview-gradient');
        this.colorInputs = {
            primary: document.getElementById('primaryColor'),
            secondary: document.getElementById('secondaryColor'),
            accent: document.getElementById('accentColor')
        };
        
        // 从localStorage获取保存的主题颜色
        const savedThemeColor = localStorage.getItem('themeColor');
        if (savedThemeColor && this.themes[savedThemeColor]) {
            this.applyTheme(savedThemeColor);
            
            // 设置活动状态
            this.colorOptions.forEach(option => {
                if (option.getAttribute('data-theme') === savedThemeColor) {
                    option.classList.add('active');
                }
            });
        } else {
            // 应用默认主题
            this.applyTheme(this.defaultTheme);
        }
        
        // 绑定事件
        this._bindEvents();
        
        super.init();
        return this;
    }

    /**
     * 绑定事件处理函数
     * @private
     */
    _bindEvents() {
        // 打开调色盘
        if (this.paletteButton) {
            this.addEventListener(this.paletteButton, 'click', () => {
                this.colorPalette.classList.toggle('show');
            });
        }

        // 关闭调色盘
        if (this.closePalette) {
            this.addEventListener(this.closePalette, 'click', () => {
                this.colorPalette.classList.remove('show');
            });
        }

        // 点击外部关闭调色盘
        this.addEventListener(document, 'click', (e) => {
            if (this.colorPalette && !this.colorPalette.contains(e.target) && 
                this.paletteButton && !this.paletteButton.contains(e.target)) {
                this.colorPalette.classList.remove('show');
            }
        });

        // 预设主题选择
        if (this.colorOptions) {
            this.colorOptions.forEach(option => {
                this.addEventListener(option, 'click', () => {
                    const theme = option.getAttribute('data-theme');
                    this.applyTheme(theme);
                    localStorage.setItem('themeColor', theme);
                    
                    // 更新选中状态
                    this.colorOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                    
                    // 关闭调色盘
                    this.colorPalette.classList.remove('show');
                    
                    // 触发主题更改事件
                    this.emit('theme:changed', { theme });
                });
            });
        }

        // 初始化颜色选择器功能
        if (this.colorWheel && this.colorDots && this.colorDots.length > 0) {
            this._initColorWheel();
        }
    }

    /**
     * 初始化颜色选择器功能
     * @private
     */
    _initColorWheel() {
        // 优化色轮点击事件
        this.addEventListener(this.colorWheel, 'click', (e) => {
            requestAnimationFrame(() => {
                const wheelRect = this.colorWheel.getBoundingClientRect();
                const x = e.clientX - wheelRect.left;
                const y = e.clientY - wheelRect.top;
                
                const centerX = wheelRect.width / 2;
                const centerY = wheelRect.height / 2;
                const deltaX = x - centerX;
                const deltaY = y - centerY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                if (distance <= wheelRect.width / 2) {
                    this._updateDotPositions(x, y, wheelRect);
                }
            });
        }, { passive: true });

        // 优化拖拽事件
        this.colorDots.forEach((dot, index) => {
            let isDragging = false;
            let rafId = null;
            
            const handleDrag = (e) => {
                if (!isDragging) return;
                
                // 取消之前的动画帧
                if (rafId) cancelAnimationFrame(rafId);
                
                // 请求新的动画帧
                rafId = requestAnimationFrame(() => {
                    const wheelRect = this.colorWheel.getBoundingClientRect();
                    const x = e.clientX - wheelRect.left;
                    const y = e.clientY - wheelRect.top;
                    
                    // 限制在色轮范围内
                    const centerX = wheelRect.width / 2;
                    const centerY = wheelRect.height / 2;
                    const deltaX = x - centerX;
                    const deltaY = y - centerY;
                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    const maxDistance = wheelRect.width / 2;
                    
                    if (distance <= maxDistance) {
                        this._updateDotPositions(x, y, wheelRect);
                    }
                });
            };
            
            this.addEventListener(dot, 'mousedown', (e) => {
                if (index === 0) {
                    isDragging = true;
                    dot.style.cursor = 'grabbing';
                    e.preventDefault();
                }
            });
            
            this.addEventListener(document, 'mousemove', handleDrag, { passive: true });
            
            this.addEventListener(document, 'mouseup', () => {
                isDragging = false;
                dot.style.cursor = 'move';
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            });
        });

        // 监听颜色输入框变化
        Object.keys(this.colorInputs).forEach(key => {
            const input = this.colorInputs[key];
            if (input) {
                this.addEventListener(input, 'change', () => {
                    const primaryColor = this.colorInputs.primary.value;
                    const secondaryColor = this.colorInputs.secondary.value;
                    const accentColor = this.colorInputs.accent.value;
                    
                    // 应用自定义颜色
                    this.applyCustomColors(primaryColor, secondaryColor, accentColor);
                    
                    // 保存自定义主题
                    localStorage.setItem('customTheme', JSON.stringify({
                        primary: primaryColor,
                        secondary: secondaryColor,
                        accent: accentColor
                    }));
                    
                    // 触发颜色更改事件
                    this.emit('theme:colorsChanged', {
                        primary: primaryColor,
                        secondary: secondaryColor,
                        accent: accentColor
                    });
                });
            }
        });
    }

    /**
     * 更新颜色点的位置
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {DOMRect} wheelRect - 色轮的矩形区域
     * @private
     */
    _updateDotPositions(x, y, wheelRect) {
        // 使用 requestAnimationFrame 优化视觉更新
        requestAnimationFrame(() => {
            const centerX = wheelRect.width / 2;
            const centerY = wheelRect.height / 2;
            const radius = wheelRect.width / 2 * 0.8;
            
            // 批量更新样式
            const updates = () => {
                this.colorDots[0].style.left = `${x}px`;
                this.colorDots[0].style.top = `${y}px`;
                
                const primaryColorInfo = this._getColorFromPosition(x, y, wheelRect);
                const harmoniousColors = ColorUtils.calculateHarmoniousColors(primaryColorInfo);
                
                // 计算次要颜色点的位置
                const secondaryAngle = (primaryColorInfo.hue + 120) * (Math.PI / 180);
                const secondaryX = centerX + radius * Math.cos(secondaryAngle);
                const secondaryY = centerY + radius * Math.sin(secondaryAngle);
                this.colorDots[1].style.left = `${secondaryX}px`;
                this.colorDots[1].style.top = `${secondaryY}px`;
                
                // 计算点缀色点的位置
                const accentAngle = (primaryColorInfo.hue + 240) * (Math.PI / 180);
                const accentX = centerX + radius * Math.cos(accentAngle);
                const accentY = centerY + radius * Math.sin(accentAngle);
                this.colorDots[2].style.left = `${accentX}px`;
                this.colorDots[2].style.top = `${accentY}px`;
                
                // 批量更新颜色
                this._updateColors(
                    primaryColorInfo.color,
                    harmoniousColors.secondary.color,
                    harmoniousColors.accent.color
                );
            };
            
            // 使用 requestAnimationFrame 进行批量更新
            requestAnimationFrame(updates);
        });
    }

    /**
     * 计算颜色选择器上的位置对应的颜色
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {DOMRect} wheelRect - 色轮的矩形区域
     * @returns {Object} - 颜色信息对象
     * @private
     */
    _getColorFromPosition(x, y, wheelRect) {
        const centerX = wheelRect.width / 2;
        const centerY = wheelRect.height / 2;
        
        // 计算相对于中心的位置
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        
        // 计算角度（色相）
        let hue = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        if (hue < 0) hue += 360;
        
        // 计算距离中心的距离（饱和度）
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = wheelRect.width / 2;
        const saturation = Math.min(distance / maxDistance * 100, 100);
        
        // 根据距离计算明度
        const lightness = Math.max(50 - (distance / maxDistance * 30), 20);
        
        return {
            hue,
            saturation,
            lightness,
            color: `hsl(${hue}, ${saturation}%, ${lightness}%)`
        };
    }

    /**
     * 更新颜色值和预览
     * @param {string} primaryColor - 主色调
     * @param {string} secondaryColor - 次色调
     * @param {string} accentColor - 点缀色
     * @private
     */
    _updateColors(primaryColor, secondaryColor, accentColor) {
        document.documentElement.style.setProperty('--gradient-primary', primaryColor);
        document.documentElement.style.setProperty('--gradient-secondary', secondaryColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);
        
        // 更新渐变预览
        const gradient = `linear-gradient(45deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`;
        if (this.previewGradient) {
            this.previewGradient.style.background = gradient;
        }
        document.documentElement.style.setProperty('--bg-gradient', gradient);
        
        // 更新输入框
        if (this.colorInputs.primary) this.colorInputs.primary.value = primaryColor;
        if (this.colorInputs.secondary) this.colorInputs.secondary.value = secondaryColor;
        if (this.colorInputs.accent) this.colorInputs.accent.value = accentColor;
        
        // 更新点的颜色
        if (this.colorDots && this.colorDots.length >= 3) {
            this.colorDots[0].style.backgroundColor = primaryColor;
            this.colorDots[1].style.backgroundColor = secondaryColor;
            this.colorDots[2].style.backgroundColor = accentColor;
        }
    }

    /**
     * 应用预定义主题
     * @param {string} theme - 主题名称
     */
    applyTheme(theme) {
        const colors = this.getThemeColors(theme);
        this.activeTheme = theme;
        
        // 设置主要颜色变量
        document.documentElement.style.setProperty('--gradient-primary', colors.primary);
        document.documentElement.style.setProperty('--gradient-secondary', colors.secondary);
        document.documentElement.style.setProperty('--bg-gradient', colors.gradient);
        
        // 设置RGB值用于透明度渐变
        const primaryRGB = ColorUtils.hexToRgb(colors.primary);
        const secondaryRGB = ColorUtils.hexToRgb(colors.secondary);
        document.documentElement.style.setProperty('--gradient-primary-rgb', `${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}`);
        document.documentElement.style.setProperty('--gradient-secondary-rgb', `${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}`);
        
        // 设置其他颜色变量
        document.documentElement.style.setProperty('--primary-color', colors.primary);
        document.documentElement.style.setProperty('--secondary-color', colors.secondary);
        document.documentElement.style.setProperty('--accent-color', colors.primary);
        document.documentElement.style.setProperty('--link-color', colors.primary);
        document.documentElement.style.setProperty('--hover-color', colors.secondary);
    }

    /**
     * 应用自定义颜色
     * @param {string} primary - 主色调
     * @param {string} secondary - 次色调
     * @param {string} accent - 点缀色
     */
    applyCustomColors(primary, secondary, accent) {
        // 设置颜色变量
        document.documentElement.style.setProperty('--primary-color', primary);
        document.documentElement.style.setProperty('--secondary-color', secondary);
        document.documentElement.style.setProperty('--accent-color', accent);
        document.documentElement.style.setProperty('--link-color', primary);
        document.documentElement.style.setProperty('--hover-color', secondary);
        
        // 设置渐变
        const gradient = `linear-gradient(45deg, ${primary}, ${secondary}, ${accent})`;
        document.documentElement.style.setProperty('--bg-gradient', gradient);
        
        // 设置RGB值用于透明度渐变
        const primaryRGB = ColorUtils.hexToRgb(primary);
        const secondaryRGB = ColorUtils.hexToRgb(secondary);
        document.documentElement.style.setProperty('--gradient-primary-rgb', `${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}`);
        document.documentElement.style.setProperty('--gradient-secondary-rgb', `${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}`);
    }

    /**
     * 获取主题颜色配置
     * @param {string} theme - 主题名称
     * @returns {Object} - 主题颜色配置
     */
    getThemeColors(theme) {
        return this.themes[theme] || this.themes[this.defaultTheme];
    }
}

export default ThemeManager; 