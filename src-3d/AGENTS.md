# `src-3d/` 目录开发规则（作用域：`src-3d/**`）

本文件适用于 `src-3d/` 目录下的改动；该目录主要用于 3D/物理相关能力，避免与 `src/` 的常规页面/业务组件混杂。

## 技术栈
- React + TypeScript
- `@react-three/fiber` / `three`
- `@react-three/drei`
- `@react-three/rapier`（物理）

## 目录约定
- 3D 组件：`src-3d/components/`
- 资源（纹理/模型/配置等）：`src-3d/resources/`

## 性能与可维护性
- 避免在 render 中频繁创建新的 `Vector3/Quaternion/Material/Geometry`（优先复用、缓存、或用 `useMemo`）。
- 物理/渲染更新：把每帧更新集中在 `useFrame`（或相关 hook）中，避免分散在大量组件里。
- 交互：指针事件与相机控制保持一致的坐标/单位体系，避免“魔法数字”散落各处。

