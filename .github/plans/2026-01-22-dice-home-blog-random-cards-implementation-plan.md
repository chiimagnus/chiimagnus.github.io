# 骰子作为主站（`/`）+ 博客迁移到 `/blog` + “命运抽卡”融合 实施计划

> 执行方式：建议使用 `executing-plans` 按批次实现与验收。

**Goal（目标）:** 把 3D 命运骰子做成主入口 `/`，把原本的 2D 博客首页迁移到 `/blog`，并在骰子页投掷后从“博客最小内容单元”中扁平等概率抽取并展示 1 张结果卡（主题卡立即生效；内容卡停留展示，用户点击后再跳转）。

**Non-goals（非目标）:**
- 不把 “Chii 的 AI 小助手（`/ai-chat`）” 纳入随机池
- 不新增文章详情页/产品详情页（沿用现有 URL/外链）
- 不做概率权重/规则编辑器（先固定扁平等概率）

**Approach（方案）:**
- 把 `src-3d/` 的 3D 场景合并进主站 SPA：新增 `src/pages/DicePage.tsx` 并挂到路由 `/`
- 原博客首页（`<Layout><Home/></Layout>`）迁移到路由 `/blog`
- 结果卡 UI **复用 2D 卡片组件的样式**：优先直接复用 `BlogCard` / `ProductCard` / `AboutCard`；主题卡新增一个同风格卡片（基于 `LiquidGlass`）
- 主题切换复用 `ThemeContext`（同时写入 `localStorage.theme`，与现有逻辑一致）

**Acceptance（验收）:**
- 访问 `/` 进入 3D 骰子；投掷结束后展示“结果卡”浮层并停留
- 结果卡类型覆盖：文章 / 产品 / 关于我 / 主题；且 **不包含** AI 小助手
- 抽到主题卡：立即切换主题（`ThemeProvider` 生效 + `localStorage.theme` 更新），结果卡提示“已生效”
- 抽到产品卡：展示与 2D 一致的完整 `ProductCard`（含全部 links，可点击）
- 抽到文章卡：展示与 2D 一致的 `BlogCard`（可点击“阅读全文”）
- 抽到关于我：展示与 2D 一致的卡片（或同风格卡片），提供跳转到 `/blog#about`
- 访问 `/blog` 进入原 2D 博客首页（Sidebar/滚动/搜索/主题选择正常）
- 构建与检查通过：`npm run lint`、`npm run build`

---

## Plan A（主方案）

### P1（最高优先级）：路由改造 + 3D 场景并入 SPA

### Task 1: 新增骰子主页面 `DicePage`（不影响全站滚动）

**Files:**
- Create: `src/pages/DicePage.tsx`
- Modify: `src/main.tsx`

**Steps:**
1. 在 `src/pages/DicePage.tsx` 创建页面组件：全屏容器 + 顶部“进入博客（/blog）”按钮 + 3D 场景占满背景
2. 在 `DicePage` 的 `useEffect` 中只在该页挂载时设置 `document.body.style.overflow = 'hidden'`，卸载时还原（避免影响 `/blog` 滚动）
3. 修改 `src/main.tsx`：把 `/` 指向 `DicePage`；把原本 `/` 的 `<Layout><Home/></Layout>` 迁移到 `/blog`；其余路由保持不变（`/lifewealth`、`/jetjetjet`、`/ai-chat`、`/syncnos-oauth/*`）

**Verify:**
- Run: `npm run build`
- Manual: `npm run dev` 后打开 `/` 与 `/blog`，确认 `/blog` 可滚动、`/` 全屏无滚动条

### Task 2: 把 `src-3d/components` 合并为主站可复用组件

**Files:**
- Create: `src/components/dice/DiceScene.tsx`
- Create: `src/components/dice/D20Dice.tsx`
- Create: `src/components/dice/DiceTray.tsx`
- Create: `src/components/dice/index.ts`
- Modify: `src/pages/DicePage.tsx`

**Steps:**
1. 复制/迁移 `src-3d/components/*` 到 `src/components/dice/*`（保持 PascalCase 文件名与现有实现）
2. 更新 `src/pages/DicePage.tsx` 引用 `src/components/dice/DiceScene`
3. 确保每个组件/关键函数有清晰注释（遵循仓库 AGENTS 要求：函数/组件/复杂逻辑加注释）

**Verify:**
- Run: `npm run lint`
- Manual: `npm run dev` 打开 `/`，确认 3D 场景可交互、可投掷

### Task 3: 处理 3D 页面所需样式（不污染全局）

**Files:**
- Create: `src/styles/dice.css`（或 `src/pages/DicePage.css`，二选一）
- Modify: `src/pages/DicePage.tsx`

**Steps:**
1. 从 `src-3d/index.css` 提取“必须的局部样式”（如 `@keyframes fade-in`、`.animate-fade-in`），避免引入 `html, body, #root { overflow: hidden; }` 这类全局影响
2. 在 `DicePage` 内 import 该样式文件（确保只影响骰子页或通过 class 范围限制）

**Verify:**
- Run: `npm run build`
- Manual: 在 `/` 投掷后确认结果数字的淡入动画仍正常

---

### P2：命运抽卡（扁平等概率）+ 结果卡 UI（与 2D 一致）

### Task 4: 定义“卡牌池”与随机抽取（排除 AI 小助手）

**Files:**
- Create: `src/features/dice/dicePool.ts`

**Steps:**
1. 定义 TypeScript 联合类型 `DiceCard`（`article | product | about | theme`）
2. 从 `src/data/articles.json` / `src/data/products.json` / `src/data/themes.ts` 构建扁平数组（About 固定 1 项；Theme 按 themes 全量）
3. 提供 `drawCard({ diceResult, pool })`：使用 `crypto.getRandomValues` 生成随机整数，并与 `diceResult` 混合后对 `pool.length` 取模，返回 1 张卡（保证“骰子点数与抽卡有关”，同时仍是随机）
4. 明确不从路由/Sidebar 构建池，避免意外把 `/ai-chat` 纳入

**Verify:**
- Run: `npm run lint`

**Swift 示例（按 skill 模板要求，仅用于说明随机取模思路）:**
```swift
import Foundation

/// Returns a stable index in [0, count), mixing diceResult and a random UInt32.
func drawIndex(diceResult: Int, count: Int) -> Int {
    precondition(count > 0)
    var rnd: UInt32 = 0
    _ = SecRandomCopyBytes(kSecRandomDefault, MemoryLayout.size(ofValue: rnd), &rnd)
    return Int((UInt32(diceResult) &+ rnd) % UInt32(count))
}
```

### Task 5: 在 `DiceScene` 暴露“投掷结束事件”，驱动抽卡

**Files:**
- Modify: `src/components/dice/DiceScene.tsx`
- Modify: `src/pages/DicePage.tsx`
- Modify: `src/features/dice/dicePool.ts`

**Steps:**
1. 给 `DiceScene` 新增 props：`onRollSettled?: (diceResult: number) => void`
2. 在 `DiceScene` 的 `handleDiceSettled` 中触发 `onRollSettled(diceResult)`
3. `DicePage` 监听该回调：调用 `drawCard(...)` 并把结果存入 state（作为“结果卡”数据源）

**Verify:**
- Run: `npm run build`
- Manual: 连续投掷多次，确认每次都会更新结果卡

### Task 6: 结果卡浮层（复用 2D 卡片样式）

**Files:**
- Create: `src/components/dice/DiceResultOverlay.tsx`
- Modify: `src/pages/DicePage.tsx`

**Steps:**
1. `DiceResultOverlay`：接收 `card: DiceCard | null` 与 `onClose`；使用半透明遮罩 + `LiquidGlass` 容器，保持与 2D 视觉一致
2. Overlay 内部按类型渲染：
   - `article`：构造 `BlogPost` 并直接渲染 `src/components/blog/BlogCard`
   - `product`：直接渲染 `src/components/blog/ProductCard`（展示全部 links）
   - `about`：渲染 `src/components/blog/AboutCard` 或同风格精简卡，并提供按钮链接到 `/blog#about`
   - `theme`：渲染 Theme 卡（Task 7）
3. Overlay 保持“停留展示”：不自动跳转；用户点击 links/按钮才跳转

**Verify:**
- Run: `npm run lint`
- Manual: `/` 投掷后 Overlay 出现；点击关闭不影响再次投掷

### Task 7: 主题卡（抽到即生效，UI 同风格）

**Files:**
- Create: `src/components/dice/ThemeResultCard.tsx`
- Modify: `src/pages/DicePage.tsx`
- Modify: `src/components/dice/DiceResultOverlay.tsx`

**Steps:**
1. `ThemeResultCard` 使用 `LiquidGlass`，展示主题名 + 渐变预览（使用 `theme.colors.gradient`）
2. `DicePage` 抽到主题卡时立刻调用 `useTheme().setTheme(themeName)`（ThemeProvider 会写入 `localStorage`）
3. 在卡片上明确提示“已生效，可点‘进入博客’查看”

**Verify:**
- Run: `npm run build`
- Manual: 抽到主题卡后切到 `/blog`，确认主题已变更

---

### P3：导航与清理（避免遗留多入口）

### Task 8: 让博客侧边栏提供“回到命运骰子”入口

**Files:**
- Modify: `src/components/blog/Sidebar.tsx`

**Steps:**
1. 在 Sidebar 导航卡中新增一个 Link：`to="/"`（例如文案“命运骰子”）
2. 保持 AI 小助手入口不变（仍仅在 Sidebar 中可见，不参与抽卡）

**Verify:**
- Run: `npm run lint`
- Manual: `/blog` 点击“命运骰子”能回到 `/`

### Task 9: 删除旧的多入口骰子构建（只保留 SPA）

**Files:**
- Delete: `dice.html`
- Delete: `src-3d/main.tsx`
- Delete: `src-3d/App.tsx`
- Delete: `src-3d/index.css`
- Delete: `src-3d/components/*`（确认已迁移后再删）
- Modify: `vite.config.ts`

**Steps:**
1. `vite.config.ts` 移除 multi-page `rollupOptions.input.dice` 与 dev rewrite 插件（如不再需要 `/dice -> /dice.html`）
2. 删除 `dice.html` 与 `src-3d/`（避免后续维护困惑）

**Verify:**
- Run: `npm run build`
- Run: `npm run preview` 后打开 `/`、`/blog`

---

## 不确定项 / 风险（先记录，执行时再确认）

1. **部署平台与 SPA 刷新问题**：
   - 若是 GitHub Pages：需要配置 `404.html` fallback（或改用 HashRouter）
   - 若是 Cloudflare Pages / Nginx：需要 rewrite 规则把任意路径回退到 `index.html`
2. **关于我卡的“最小层级”**：MVP 可直接复用现有 `AboutCard`（内容较多）。若想更“卡牌化”，后续再做精简版 About 卡（仍用 `LiquidGlass` 保持一致）。

## 回归命令（每完成一个优先级后执行）

- P1 完成：`npm run lint && npm run build`
- P2 完成：`npm run lint && npm run build`
- P3 完成：`npm run lint && npm run build && npm run preview`

