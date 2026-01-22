# `src/` 目录开发规则（作用域：`src/**`）

本文件适用于 `src/` 目录下的改动；若更深层目录存在更具体的 `AGENTS.md`，则以更具体者为准（例如 `src/components/blog/AGENTS.md`）。

## 技术栈
- React + TypeScript
- Tailwind CSS
- Vite

## 目录约定
- 页面级组件：`src/pages/`
- 可复用组件：`src/components/`
- Context / 全局状态：`src/context/`
- 静态数据：`src/data/`
- 类型定义：`src/types/`

## 编码约定
- 组件文件使用 PascalCase（如 `BlogCard.tsx`）；非组件文件使用 camelCase。
- 保持组件职责单一：优先拆分可复用组件与纯逻辑函数。
- 性能：对昂贵计算使用 `useMemo`，对稳定回调使用 `useCallback`，必要时使用 `React.memo`。

