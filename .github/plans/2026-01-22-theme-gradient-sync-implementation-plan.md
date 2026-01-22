# Theme 渐变（流动）与骰子 3D 光照同步 实施计划
> 执行方式：建议使用 `executing-plans` 按批次实现与验收。

**Goal（目标）:**
- 将全站背景渐变从“纯 CSS keyframes”改为“JS 统一驱动（requestAnimationFrame）”
- 让同一个动画相位（`phase`）同时驱动：
  - DOM 背景渐变的流动（保持现有 15s 循环的“波浪/流动感”）
  - Dice 3D 场景的灯光颜色/托盘丝绒 tint/骰子金属高光色，做到**同步流动变化**
- 切换主题时，背景渐变与 3D 效果**立即切换到新主题的配色**并继续流动

**Non-goals（非目标）:**
- 不追求“逐像素”从背景图采样来驱动光照（那会引入离屏渲染/采样复杂度）
- 不引入新的渲染后期（Bloom/SSAO 等），避免性能和调参成本
- 不重做主题系统的 UI（主题选择器外观/交互保持现状）

**Approach（方案）:**
- 以 Theme 数据为单一事实来源：为每个主题提供可程序化使用的 `gradientStops`（或从现有 `colors.gradient` 解析得到 stops）。
- 在 `ThemeProvider` 内启动一个全局的 `requestAnimationFrame` “GradientClock”：
  - 计算和原 CSS keyframes 等价的 `background-position`（0%→100%→0% 的三角波）
  - 直接更新 `document.body.style.backgroundPosition` / `backgroundImage` / `backgroundSize`
  - 同时更新一个“运行时对象”（ref）里的 `phase` 与 `palette`（不触发全 App 60fps rerender）
- Dice 侧通过 `useFrame` 每帧读取同一个 `phase/palette`，把颜色写到 three 的灯光/材质上（只改 `.color` 与少量材质字段，避免重建对象）。

**Acceptance（验收）:**
- 进入 `/#/`（骰子页）时：
  - 背景渐变持续流动（约 15s 一个来回），不再依赖 `.bg-gradient-main` keyframes
  - 托盘丝绒与骰子高光能看见随时间**连续变化**（不跳变、不停顿），且与背景流动节奏一致
- 在骰子页触发主题切换（抽到主题卡或 UI 切换）后：
  - 1 秒内背景与 3D 光照/材质配色切换到新主题，并继续流动
- 性能与稳定性：
  - 无 React 全局 60fps rerender（phase 通过 ref/runtime 读取）
  - React StrictMode 下不会启动多个 rAF 循环（可重复挂载/卸载无泄漏）
- 工程验证：
  - `npm run build` 通过
  - `npm run lint` 通过（如仓库启用 ESLint）

---

## Plan A（主方案）：JS 驱动背景 + 共享 phase/runtime

### P1（最高优先级）：建立“可程序化渐变”与全局 GradientClock

### Task 1: 增加渐变工具函数（三角波 + 颜色插值）

**Files:**
- Create: `src/utils/gradientRuntime.ts`

**Implementation notes:**
- 提供小而纯的函数（便于单测/复用）：
  - `triangle01(t: number): number`：把 0..1 映射为 0..1..0
  - `lerp(a: number, b: number, t: number): number`
  - `lerpHexColor(a: string, b: string, t: number): string`（或返回 `THREE.Color` 但尽量保持 UI/3D 两边可用）
  - `pickStop(stops: string[], t: number): { a: string; b: string; localT: number }`
- 为每个函数写清晰注释（本仓库规则要求函数/复杂逻辑有注释）。

**Verify:**
- Run: `npm run build`
- Expected: PASS

---

### Task 2: 扩展主题数据，提供 `gradientStops`

**Files:**
- Modify: `src/data/themes.ts`

**Implementation notes:**
- 方案 A（推荐）：在 `Theme.colors` 下新增 `gradientStops: string[]`，保留 `gradient: string` 给现有 UI 使用。
- 主题对象补齐 stops（与 `colors.gradient` 的色值一致，顺序一致）。
- 更新 `Theme` interface，确保 TS 类型一致。

**Verify:**
- Run: `npm run build`
- Expected: PASS（类型不报错）

---

### Task 3: 在 ThemeContext 中引入 GradientClock（rAF 驱动 body 背景）

**Files:**
- Modify: `src/context/ThemeContext.tsx`

**Implementation notes:**
- 新增一个“运行时对象”（ref，不触发 rerender）：
  - `phaseRef`：`number`（0..1）
  - `stopsRef`：当前主题的 `gradientStops`
  - `paletteRef`：预先计算/缓存的若干采样色（例如：`keyLight`, `fillLight`, `rimLight`, `velvetTint`）
- `useEffect` 启动 rAF：
  - 用 `performance.now()` 驱动时间
  - 周期默认 15000ms（与旧 CSS 一致）
  - 每帧：
    - 计算 `t = (now - start) / duration % 1`
    - 计算 `p = triangle01(t)`，写入 `body.style.backgroundPosition = `${p * 100}% 50%``
    - 写入 `body.style.backgroundImage = theme.colors.gradient`、`backgroundSize = '400% 400%'`
    - 更新 `phaseRef.current = t`（或 `p`，但建议同时保留 raw 与 triangle 两个值）
    - 基于 stops + phase 生成 `paletteRef.current = ...`
- theme 切换时：
  - 更新 stopsRef/paletteRef（下一帧开始用新配色）
- 严格保证清理：
  - `cancelAnimationFrame`
  - StrictMode 下重复 mount/unmount 不会产生双循环
- Context value 里新增只读访问器（稳定引用）：
  - `getGradientPhase(): number`
  - `getGradientPalette(): { ... }`
  - 避免把 `phase` 放进 state（否则全站 60fps rerender）。

**Verify:**
- Run: `npm run build`
- Expected: PASS
- Manual: 打开任意页面，背景渐变仍然流动

---

### P2：Dice 侧消费 palette，让 3D 颜色随 phase 流动

### Task 4: 让 DicePage 不再用固定黑色遮罩“压死”主题背景

**Files:**
- Modify: `src/pages/DicePage.tsx`

**Implementation notes:**
- 将 `bg-black/60` 改为：
  - 更轻的遮罩（例如 `bg-black/15`），或
  - 跟主题相关的遮罩（例如用 `--primary-color-rgb` 做 `rgba(...)`），避免主题被统一压黑
- 目标：肉眼能明确看到背景渐变在骰子页也在流动。

**Verify:**
- Manual: 进入首页骰子页能看见主题渐变流动

---

### Task 5: DiceScene 读取 ThemeRuntime，按 phase 更新灯光颜色

**Files:**
- Modify: `src/components/dice/DiceScene.tsx`

**Implementation notes:**
- 通过 `useTheme()` 读取 `getGradientPhase/getGradientPalette`
- 将关键灯光用 `useRef` 保存（例如 `spotLightRef`、`fillLightRef`、`rimLightRef`、`underGlowRef`）
- 在 `useFrame` 内（每帧）：
  - 读取 palette
  - 只更新 `light.color.set(...)`、`light.intensity` 的小幅变化（保持物理感）
  - 可选：轻微驱动 `toneMappingExposure`（慎用，避免闪烁）
- 保持 `Canvas` 背景透明（当前已经是 `transparent`），让 DOM 背景可见。

**Verify:**
- Run: `npm run build`
- Expected: PASS
- Manual: 灯光颜色随背景节奏连续变化

---

### Task 6: 托盘丝绒随 palette 轻微染色（颜色/自发光）

**Files:**
- Modify: `src/components/dice/DiceTray.tsx`

**Implementation notes:**
- 增加 props（推荐）：
  - `velvetTint?: string`
  - `velvetEmissive?: string`
  - `velvetEmissiveIntensity?: number`
- 或在 DiceTray 内直接 `useTheme()`（但 props 更解耦、更易复用/测试）。
- 用 `useFrame` 或 `useEffect + requestAnimationFrame` 更新材质：
  - 只对“丝绒材质”做轻微 tint（避免整只托盘都变色）
  - 避免每帧创建新 `THREE.Color` 对象（复用一个临时对象）。

**Verify:**
- Run: `npm run build`
- Expected: PASS
- Manual: 丝绒底色随时间流动变化（肉眼可见）

---

### Task 7: 骰子金属高光随 palette 变化（高光色/反射强度）

**Files:**
- Modify: `src/components/dice/D20Dice.tsx`
- (Optional) Modify: `src/components/dice/DiceScene.tsx`（把高光色作为 props 传入）

**Implementation notes:**
- 维持 PBR：优先通过灯光色 + `envMapIntensity` 驱动高光“色调”，不要大幅改 `baseColor`
- 增加 props（推荐）：
  - `highlightColor?: string`（用于点光源/轮廓光）
  - `envIntensity?: number`（随 phase 小幅波动）

**Verify:**
- Run: `npm run build`
- Expected: PASS

---

### P3：清理旧 CSS 动画，避免“双重驱动”

### Task 8: 移除（或停用）旧的 `.bg-gradient-main` keyframes

**Files:**
- Modify: `src/index.css`
- Modify: `src/context/ThemeContext.tsx`

**Implementation notes:**
- 删除 `@keyframes gradient-animation` 与 `.bg-gradient-main` 的动画（或保留但不再给 body 添加该 class）
- 确保背景动画只由 JS 驱动，避免“CSS 动画 + JS 更新”造成抖动/竞态。

**Verify:**
- Manual: 背景仍然流动，且节奏稳定（无抖动）

---

## 回归验证（每完成一个 P 分组后跑一次）

- `npm run build`
- `npm run lint`

## 风险与注意事项

- React StrictMode 会重复执行 effect：GradientClock 必须保证不会重复启动多个 rAF 循环。
- 不要把 `phase` 存在 React state 并每帧 setState，否则会导致全站 60fps rerender。
- 主题渐变字符串解析较脆：优先在 `themes.ts` 提供结构化 `gradientStops`，减少解析风险。

