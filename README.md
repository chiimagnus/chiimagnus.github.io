Welcom to Chii Magnus's Blog~

# 新增了六种预设主题！太惊艳了！😍
## 1. 彩虹
![alt text](assets/彩虹.png)

## 2. 极光
![alt text](assets/极光.png)

## 3. 日落海滩
![alt text](assets/日落海滩1.png)
![alt text](assets/日落海滩2.png)

## 4. 樱花
![alt text](assets/樱花.png)

## 5. 秋季
![alt text](assets/秋季.png)

## 6. 霓虹暗夜
![alt text](assets/霓虹暗夜1.png)
![alt text](assets/霓虹暗夜2.png)

# 文件结构
```
├── index.html                # 网站主页面
├── js                        # JavaScript文件目录
    ├── app.js                # 应用程序入口，整合所有模块
    ├── main.js               # 主脚本文件，初始化应用程序
    └── modules               # 模块化组件目录
        ├── core              # 核心模块目录
        │   ├── BaseModule.js # 所有模块的基类，提供通用功能
        │   └── ModuleFactory.js # 模块工厂，负责创建和管理模块实例
        ├── managers          # 管理器模块目录
        │   ├── ArticleManager.js # 文章管理器，处理文章加载和显示
        │   ├── SearchManager.js  # 搜索管理器，处理搜索功能
        │   ├── ThemeManager.js   # 主题管理器，处理网站主题切换
        │   └── UIManager.js      # UI管理器，处理整体界面交互
        └── utils             # 工具类目录
            └── ColorUtils.js # 颜色处理工具，提供颜色转换和处理功能
```