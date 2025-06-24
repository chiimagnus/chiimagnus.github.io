# ChiiBlog - 个人博客网站

一个使用 React + TypeScript + Vite + TailwindCSS 构建的现代化个人博客网站。

## 技术栈

- **前端框架**: React 18
- **类型系统**: TypeScript
- **构建工具**: Vite
- **样式框架**: TailwindCSS
- **路由**: React Router DOM
- **图标**: Lucide React
- **日期处理**: date-fns

## 功能特性

- 📱 响应式设计，适配各种设备
- 🎨 现代化 UI 设计，基于 TailwindCSS
- 🔍 分类和标签系统
- 📝 博客文章展示和详情页
- 🏷️ 精选文章推荐
- 📊 阅读时间估算
- 🔗 社交媒体链接
- ⚡ 快速加载和优化性能

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Header.tsx      # 头部导航组件
│   ├── Footer.tsx      # 底部组件
│   ├── Layout.tsx      # 布局组件
│   └── BlogCard.tsx    # 博客卡片组件
├── pages/              # 页面组件
│   └── Home.tsx        # 首页组件
├── types/              # TypeScript 类型定义
│   └── index.ts
├── data/               # 模拟数据
│   └── mockData.ts
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 安装和运行

### 前置要求

- Node.js (版本 16+)
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 组件化设计

项目采用高度组件化的设计理念：

### 布局组件
- `Layout`: 主布局，包含 Header 和 Footer
- `Header`: 响应式导航栏，支持移动端菜单
- `Footer`: 网站底部，包含链接和版权信息

### 内容组件
- `BlogCard`: 博客文章卡片，支持普通和精选两种样式
- `Home`: 首页，包含 Hero 区域、精选文章和最新文章

### 特色功能

1. **响应式设计**: 使用 TailwindCSS 实现完全响应式布局
2. **类型安全**: 完整的 TypeScript 类型定义
3. **模块化架构**: 清晰的目录结构和组件分离
4. **现代化工具链**: Vite 提供快速开发体验
5. **可扩展性**: 易于添加新页面和功能

## 自定义配置

### 网站信息
在 `src/data/mockData.ts` 中修改网站和作者信息：

```typescript
export const siteConfig: SiteConfig = {
  title: 'ChiiBlog',
  description: '分享技术、记录生活的个人博客',
  author: {
    // 作者信息
  },
  // ...
};
```

### 样式自定义
在 `tailwind.config.js` 中自定义主题色彩和样式。

### 添加新页面
1. 在 `src/pages/` 中创建新的页面组件
2. 在 `src/App.tsx` 中添加路由配置
3. 在 `src/components/Header.tsx` 中添加导航链接

## 部署

项目构建后可以部署到任何静态网站托管服务：

- Vercel
- Netlify
- GitHub Pages
- 阿里云 OSS
- 腾讯云 COS

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！ 