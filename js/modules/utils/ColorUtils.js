/**
 * ColorUtils - 颜色处理工具类
 * 提供各种颜色转换和计算功能
 */
class ColorUtils {
    /**
     * 将十六进制颜色转换为RGB对象
     * @param {string} hex - 十六进制颜色值
     * @returns {Object} - 包含r、g、b属性的对象
     */
    static hexToRgb(hex) {
        // 移除#号如果存在
        hex = hex.replace('#', '');
        
        // 解析RGB值
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }

    /**
     * 将RGB值转换为十六进制颜色
     * @param {number} r - 红色值 (0-255)
     * @param {number} g - 绿色值 (0-255)
     * @param {number} b - 蓝色值 (0-255)
     * @returns {string} - 十六进制颜色值
     */
    static rgbToHex(r, g, b) {
        return '#' + [r, g, b]
            .map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
            .join('');
    }

    /**
     * 将HSL颜色转换为RGB
     * @param {number} h - 色相 (0-360)
     * @param {number} s - 饱和度 (0-100)
     * @param {number} l - 明度 (0-100)
     * @returns {Object} - 包含r、g、b属性的对象
     */
    static hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * 将RGB颜色转换为HSL
     * @param {number} r - 红色值 (0-255)
     * @param {number} g - 绿色值 (0-255)
     * @param {number} b - 蓝色值 (0-255)
     * @returns {Object} - 包含h、s、l属性的对象
     */
    static rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // 灰色
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    /**
     * 获取和谐的配色方案
     * @param {Object} primaryColor - 包含hue、saturation、lightness属性的对象
     * @returns {Object} - 包含secondary和accent颜色的对象
     */
    static calculateHarmoniousColors(primaryColor) {
        // 计算次要颜色（120度角）
        const secondaryHue = (primaryColor.hue + 120) % 360;
        // 计算点缀色（240度角）
        const accentHue = (primaryColor.hue + 240) % 360;
        
        return {
            secondary: {
                hue: secondaryHue,
                saturation: primaryColor.saturation * 0.9, // 稍微降低饱和度
                lightness: primaryColor.lightness * 1.1, // 稍微提高明度
                color: `hsl(${secondaryHue}, ${primaryColor.saturation * 0.9}%, ${primaryColor.lightness * 1.1}%)`
            },
            accent: {
                hue: accentHue,
                saturation: primaryColor.saturation * 0.8, // 更低的饱和度
                lightness: primaryColor.lightness * 1.2, // 更高的明度
                color: `hsl(${accentHue}, ${primaryColor.saturation * 0.8}%, ${primaryColor.lightness * 1.2}%)`
            }
        };
    }
}

export default ColorUtils; 