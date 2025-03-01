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
├── css                       # CSS样式文件目录
│   └── style.css             # 主样式表
├── js                        # JavaScript文件目录
│   ├── main.js               # 应用程序入口点（简化后）
│   ├── app.js                # 应用程序核心，整合所有模块
│   ├── config                # 配置文件目录
│   │   └── articles.json     # 文章配置文件
│   └── modules               # 模块化组件目录
│       ├── core              # 核心模块目录
│       │   ├── BaseModule.js # 所有模块的基类，提供通用功能
│       │   └── ModuleFactory.js # 模块工厂，负责创建和管理模块实例
│       ├── managers          # 管理器模块目录
│       │   ├── ArticleManager.js # 文章管理器，处理文章加载和显示
│       │   ├── SearchManager.js  # 搜索管理器，处理搜索功能
│       │   ├── ThemeManager.js   # 主题管理器，处理网站主题切换
│       │   └── UIManager.js      # UI管理器，处理整体界面交互
│       └── utils             # 工具类目录
│           └── ColorUtils.js # 颜色处理工具，提供颜色转换和处理功能
└── assets                    # 资源文件目录（图片等）
```

# 如何添加新文章

## 方式1: 添加外部链接文章
只需编辑 `js/config/articles.json` 文件，添加新的文章配置：

```json
{
  "title": "文章标题",
  "date": "2024年12月01日 10:00",
  "description": "文章简短描述...",
  "url": "https://example.com/your-article-url",
  "slug": "unique-article-slug",
  "external": true
}
```

## 方式2: 添加本地Markdown文章
1. 在articles目录创建Markdown文件（例如：`articles/my-new-article.md`）
2. 在文件开头添加frontmatter：
   ```markdown
   ---
   title: 文章标题
   date: 2024年12月01日 10:00
   description: 文章简短描述...
   ---
   
   这里是文章正文内容...
   ```
3. 在 `js/config/articles.json` 中添加对应的配置：
   ```json
   {
     "title": "文章标题",
     "date": "2024年12月01日 10:00",
     "description": "文章简短描述...",
     "slug": "my-new-article",
     "external": false
   }
   ```

# 如何添加新产品
编辑 `index.html` 文件中的产品卡片部分，添加新的产品卡片：

```html
<article class="product-card">
  <div class="product-content">
    <h3>产品名称</h3>
    <p class="product-description">
      产品描述...
    </p>
    <div class="product-tags">
      <span class="tag">标签1</span>
      <span class="tag">标签2</span>
      <span class="tag status">🚧 开发中</span>
    </div>
    <div class="product-links">
      <a href="https://github.com/yourusername/project" class="product-link" target="_blank">GitHub</a>
      <a href="https://example.com/demo" class="product-link" target="_blank">演示</a>
    </div>
  </div>
</article>
```