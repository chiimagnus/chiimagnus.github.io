# 骰子场景音效增强 实施计划（v2 - 已更新）

> 执行方式：建议使用 `executing-plans` 按批次实现与验收。

**Goal（目标）:** 为骰子场景添加完整的声音叙事，包含 5 种新音效：起手音效、滚动摩擦声、落定音效、弹跳音效、边缘摩擦声。全部使用 Web Audio API 合成，无需外部音频文件。

**Non-goals（非目标）:**
- 不做材质区分（木头/毛毡/金属碰撞音的差异）— 留待后续迭代
- 不使用外部音频文件
- 不修改现有碰撞音效的核心逻辑（但会添加互斥判断）

**Approach（方案）:**
- 在现有 `diceSfx.ts` 基础上扩展，新增 5 个音效合成函数
- 滚动摩擦声需要持续播放机制（start/stop/update），使用单例模式管理生命周期
- 弹跳音效与普通碰撞音效互斥，避免重叠
- 在 `D20Dice.tsx` 和 `DiceScene.tsx` 中添加触发点
- 音效参数（音量、音调）根据物理状态（速度、角速度）动态调整

**Acceptance（验收）:**
- [ ] 点击投掷时播放起手音效
- [ ] 骰子滚动时播放持续的摩擦声（角速度越快声音越明显）
- [ ] 骰子从高处落下时播放弹跳音效（与普通碰撞音互斥）
- [ ] 骰子贴边滑动时播放刮擦声
- [ ] 骰子完全静止时播放落定音效
- [ ] 各音效音量平衡，不互相掩盖
- [ ] 移动端（iOS Safari）正常工作
- [ ] `pnpm run build` 无报错

---

## Plan A（主方案）

### P1a（最高优先级）：核心流程音效

#### Task 1: 实现起手/投掷音效 `playThrowSfx`

**Files:**
- Modify: `src/features/dice/diceSfx.ts`

**Step 1: 设计音效特征**

起手音效应该是一个短促的轻微「咔」声，模拟手指离开骰子的摩擦：
- 使用中频噪声 + 快速衰减（比原设计更短、更低频）
- 时长约 0.04-0.06 秒（原设计 0.08-0.12 秒过长）
- 起始频率 2000Hz（原设计 4000Hz 过高）
- 音量适中，不抢碰撞音的风头

**Step 2: 在 `diceSfx.ts` 末尾添加函数**

```typescript
/**
 * playThrowSfx
 * 投掷起手音效：短促的轻微「咔」声，模拟手指离开骰子。
 */
export const playThrowSfx = (): void => {
  const context = getOrCreateContext();
  if (!context || !masterGain) return;
  if (context.state !== 'running') return;

  const now = context.currentTime;

  // 输出增益（整体包络）- 更短的衰减
  const throwGain = context.createGain();
  throwGain.gain.setValueAtTime(0, now);
  throwGain.gain.linearRampToValueAtTime(0.28, now + 0.005);
  throwGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  throwGain.connect(masterGain);

  // 中频噪声 + 下扫滤波器 = 轻微「咔」
  const noiseSource = context.createBufferSource();
  noiseSource.buffer = getNoiseBuffer(context);
  noiseSource.playbackRate.setValueAtTime(1.2, now);

  const sweepFilter = context.createBiquadFilter();
  sweepFilter.type = 'bandpass';
  sweepFilter.frequency.setValueAtTime(2000, now);
  sweepFilter.frequency.exponentialRampToValueAtTime(600, now + 0.04);
  sweepFilter.Q.setValueAtTime(1.5, now);

  noiseSource.connect(sweepFilter);
  sweepFilter.connect(throwGain);

  noiseSource.start(now);
  noiseSource.stop(now + 0.06);
};
```

**Step 3: 验证**

Run: `pnpm run build`
Expected: 无 TypeScript 编译错误

---

#### Task 2: 实现落定音效 `playSettleSfx`

**Files:**
- Modify: `src/features/dice/diceSfx.ts`

**Step 1: 设计音效特征**

落定音效是骰子完全静止时的收尾音，应该是一个低沉、短促的「笃」：
- 低频正弦波（60-80Hz）+ 轻微噪声
- 时长约 0.06-0.1 秒
- 音量较轻，作为「句号」而非「惊叹号」

**Step 2: 在 `diceSfx.ts` 添加函数**

```typescript
/**
 * playSettleSfx
 * 骰子落定音效：低沉短促的「笃」，标志骰子完全静止。
 */
export const playSettleSfx = (): void => {
  const context = getOrCreateContext();
  if (!context || !masterGain) return;
  if (context.state !== 'running') return;

  const now = context.currentTime;

  const settleGain = context.createGain();
  settleGain.gain.setValueAtTime(0, now);
  settleGain.gain.linearRampToValueAtTime(0.22, now + 0.005);
  settleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
  settleGain.connect(masterGain);

  // 低频「笃」
  const thumpOsc = context.createOscillator();
  thumpOsc.type = 'sine';
  thumpOsc.frequency.setValueAtTime(70, now);
  thumpOsc.frequency.exponentialRampToValueAtTime(50, now + 0.06);
  thumpOsc.connect(settleGain);

  thumpOsc.start(now);
  thumpOsc.stop(now + 0.1);
};
```

**Step 3: 验证**

Run: `pnpm run build`
Expected: 无 TypeScript 编译错误

---

#### Task 3: 实现滚动摩擦声 `RollingSfx`（单例模式）

**Files:**
- Modify: `src/features/dice/diceSfx.ts`

**Step 1: 设计音效特征**

滚动摩擦声是骰子滚动时的持续「咕噜」声，需要：
- 持续播放机制（start/stop/update）
- **单例模式**：确保只有一个实例，避免快速连续投掷时资源泄漏
- 根据角速度动态调整音量和音调
- 低频隆隆声 + 中频颗粒感
- 音量整体偏低，作为背景音

**Step 2: 添加单例类**

```typescript
/**
 * RollingSfx
 * 滚动摩擦声管理器（单例）：持续播放的「咕噜」声。
 * 使用方式：
 *   RollingSfx.instance.start();
 *   RollingSfx.instance.update({ angularSpeed: 5 }); // 每帧调用
 *   RollingSfx.instance.stop();
 */
export class RollingSfx {
  private static _instance: RollingSfx | null = null;
  
  static get instance(): RollingSfx {
    if (!RollingSfx._instance) {
      RollingSfx._instance = new RollingSfx();
    }
    return RollingSfx._instance;
  }

  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private rumbleOsc: OscillatorNode | null = null;
  private rumbleGain: GainNode | null = null;
  private isPlaying = false;

  private constructor() {} // 私有构造函数，强制使用单例

  start(): void {
    // 先停止旧实例，确保资源清理
    if (this.isPlaying) {
      this.stopImmediate();
    }

    const context = getOrCreateContext();
    if (!context || !masterGain) return;
    if (context.state !== 'running') return;

    this.isPlaying = true;

    // 低频隆隆声
    this.rumbleOsc = context.createOscillator();
    this.rumbleOsc.type = 'sine';
    this.rumbleOsc.frequency.value = 45;

    this.rumbleGain = context.createGain();
    this.rumbleGain.gain.value = 0;
    this.rumbleOsc.connect(this.rumbleGain);
    this.rumbleGain.connect(masterGain);

    // 中频颗粒噪声（循环播放）- 音量降低作为背景
    this.noiseSource = context.createBufferSource();
    this.noiseSource.buffer = getNoiseBuffer(context);
    this.noiseSource.loop = true;
    this.noiseSource.playbackRate.value = 0.6;

    this.noiseFilter = context.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.frequency.value = 400;
    this.noiseFilter.Q.value = 0.8;

    this.noiseGain = context.createGain();
    this.noiseGain.gain.value = 0;

    this.noiseSource.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(masterGain);

    this.rumbleOsc.start();
    this.noiseSource.start();
  }

  update({ angularSpeed }: { angularSpeed: number }): void {
    if (!this.isPlaying) return;

    // 角速度映射到音量和音调 - 整体音量降低
    const normalized = clamp01(angularSpeed / 12);
    const targetVolume = normalized * 0.12; // 降低音量，作为背景

    if (this.rumbleGain) {
      this.rumbleGain.gain.value += (targetVolume * 0.5 - this.rumbleGain.gain.value) * 0.15;
    }
    if (this.noiseGain) {
      this.noiseGain.gain.value += (targetVolume - this.noiseGain.gain.value) * 0.15;
    }
    if (this.noiseFilter) {
      const targetFreq = 300 + normalized * 600;
      this.noiseFilter.frequency.value += (targetFreq - this.noiseFilter.frequency.value) * 0.1;
    }
    if (this.noiseSource) {
      const targetRate = 0.5 + normalized * 0.8;
      this.noiseSource.playbackRate.value += (targetRate - this.noiseSource.playbackRate.value) * 0.1;
    }
    if (this.rumbleOsc) {
      const targetFreq = 40 + normalized * 30;
      this.rumbleOsc.frequency.value += (targetFreq - this.rumbleOsc.frequency.value) * 0.1;
    }
  }

  stop(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    // 快速淡出后停止
    const context = getOrCreateContext();
    const now = context?.currentTime ?? 0;

    if (this.rumbleGain && context) {
      this.rumbleGain.gain.setValueAtTime(this.rumbleGain.gain.value, now);
      this.rumbleGain.gain.linearRampToValueAtTime(0, now + 0.05);
    }
    if (this.noiseGain && context) {
      this.noiseGain.gain.setValueAtTime(this.noiseGain.gain.value, now);
      this.noiseGain.gain.linearRampToValueAtTime(0, now + 0.05);
    }

    setTimeout(() => this.cleanup(), 80);
  }

  /** 立即停止，不淡出（用于 start() 前清理） */
  private stopImmediate(): void {
    this.isPlaying = false;
    this.cleanup();
  }

  private cleanup(): void {
    try {
      this.rumbleOsc?.stop();
    } catch { /* ignore */ }
    try {
      this.noiseSource?.stop();
    } catch { /* ignore */ }
    this.rumbleOsc = null;
    this.noiseSource = null;
    this.rumbleGain = null;
    this.noiseGain = null;
    this.noiseFilter = null;
  }
}
```

**Step 3: 验证**

Run: `pnpm run build`
Expected: 无 TypeScript 编译错误

---

### P1b（高优先级）：增强音效

#### Task 4: 实现弹跳音效 `playBounceSfx`（返回是否播放）

**Files:**
- Modify: `src/features/dice/diceSfx.ts`

**Step 1: 设计音效特征**

弹跳音效强调垂直方向的冲击，与普通碰撞音的区别：
- 更强的低频成分（模拟重力落下的「砰」）
- 带有轻微的「弹性」感（音调快速上扬后下降）
- 根据下落速度调整音量和音调
- **返回 boolean**：告知调用方是否播放了音效，用于互斥判断

**Step 2: 添加接口和函数**

```typescript
export interface BounceSfxParams {
  /** 垂直方向的冲击速度（向下为正），典型范围 0..8 */
  impactSpeed: number;
}

/**
 * playBounceSfx
 * 弹跳音效：强调垂直冲击的「砰」声。
 * @returns 是否播放了音效（用于与碰撞音效互斥）
 */
export const playBounceSfx = ({ impactSpeed }: BounceSfxParams): boolean => {
  const context = getOrCreateContext();
  if (!context || !masterGain) return false;
  if (context.state !== 'running') return false;

  const normalized = clamp01((impactSpeed - 1.5) / 4.5);
  if (normalized <= 0) return false;

  const now = context.currentTime;
  const volume = 0.18 + normalized * 0.35;

  const bounceGain = context.createGain();
  bounceGain.gain.setValueAtTime(0, now);
  bounceGain.gain.linearRampToValueAtTime(volume, now + 0.003);
  bounceGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
  bounceGain.connect(masterGain);

  // 低频「砰」：频率先上扬再下降（弹性感）
  const bounceOsc = context.createOscillator();
  bounceOsc.type = 'sine';
  const baseFreq = 80 + normalized * 40;
  bounceOsc.frequency.setValueAtTime(baseFreq, now);
  bounceOsc.frequency.linearRampToValueAtTime(baseFreq * 1.3, now + 0.01);
  bounceOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.12);
  bounceOsc.connect(bounceGain);

  // 叠加一点噪声增加质感
  const noiseSource = context.createBufferSource();
  noiseSource.buffer = getNoiseBuffer(context);

  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(600, now);

  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.12 * normalized, now + 0.002);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(bounceGain);

  bounceOsc.start(now);
  bounceOsc.stop(now + 0.15);
  noiseSource.start(now);
  noiseSource.stop(now + 0.1);

  return true; // 表示已播放
};
```

**Step 3: 验证**

Run: `pnpm run build`
Expected: 无 TypeScript 编译错误

---

#### Task 5: 实现边缘摩擦音效 `playScrapeSfx`（简化版）

**Files:**
- Modify: `src/features/dice/diceSfx.ts`

**Step 1: 设计音效特征**

边缘摩擦是骰子贴着托盘边缘滑动时的刮擦声：
- 中高频噪声 + 窄带滤波（模拟金属/木头摩擦）
- 时长较短（0.05-0.1 秒）
- 根据滑动速度调整音量和滤波频率
- **简化触发条件**：水平速度 > 垂直速度 × 2 时触发

**Step 2: 添加接口和函数**

```typescript
export interface ScrapeSfxParams {
  /** 水平滑动速度，典型范围 0..4 */
  horizontalSpeed: number;
  /** 垂直速度，用于判断是否为「贴边滑动」 */
  verticalSpeed: number;
}

/**
 * playScrapeSfx
 * 边缘摩擦音效：骰子贴边滑动时的刮擦声。
 * 触发条件：水平速度 > 垂直速度 × 2（表示贴边滑动而非弹跳）
 * @returns 是否播放了音效
 */
export const playScrapeSfx = ({ horizontalSpeed, verticalSpeed }: ScrapeSfxParams): boolean => {
  const context = getOrCreateContext();
  if (!context || !masterGain) return false;
  if (context.state !== 'running') return false;

  // 简化判断：水平速度远大于垂直速度时，认为是贴边滑动
  if (horizontalSpeed < verticalSpeed * 2) return false;

  const normalized = clamp01((horizontalSpeed - 0.8) / 2.5);
  if (normalized <= 0) return false;

  const now = context.currentTime;
  const volume = 0.08 + normalized * 0.18;

  const scrapeGain = context.createGain();
  scrapeGain.gain.setValueAtTime(0, now);
  scrapeGain.gain.linearRampToValueAtTime(volume, now + 0.005);
  scrapeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
  scrapeGain.connect(masterGain);

  const noiseSource = context.createBufferSource();
  noiseSource.buffer = getNoiseBuffer(context);
  noiseSource.playbackRate.setValueAtTime(0.8 + normalized * 0.4, now);

  const scrapeFilter = context.createBiquadFilter();
  scrapeFilter.type = 'bandpass';
  scrapeFilter.frequency.setValueAtTime(1800 + normalized * 1200, now);
  scrapeFilter.Q.setValueAtTime(2.5, now);

  noiseSource.connect(scrapeFilter);
  scrapeFilter.connect(scrapeGain);

  noiseSource.start(now);
  noiseSource.stop(now + 0.1);

  return true;
};
```

**Step 3: 验证**

Run: `pnpm run build`
Expected: 无 TypeScript 编译错误

---

### P2（中优先级）：触发点集成

#### Task 6: 在 `D20Dice.tsx` 集成起手音效

**Files:**
- Modify: `src/components/dice/D20Dice.tsx`

**Step 1: 导入新函数**

在文件顶部修改导入：
```typescript
import { playDiceCollisionSfx, playThrowSfx } from '../../features/dice/diceSfx';
```

**Step 2: 在投掷触发时播放**

在 `useEffect` 中处理 `rollId` 变化的地方（约第 136-183 行），在施加冲量之前添加：

```typescript
// 播放起手音效
playThrowSfx();
```

**Step 3: 验证**

Run: `pnpm run dev`
Expected: 点击骰子投掷时听到短促「咔」声

---

#### Task 7: 在 `D20Dice.tsx` 集成落定音效

**Files:**
- Modify: `src/components/dice/D20Dice.tsx`

**Step 1: 导入新函数**

更新导入：
```typescript
import { playDiceCollisionSfx, playThrowSfx, playSettleSfx } from '../../features/dice/diceSfx';
```

**Step 2: 在骰子稳定时播放**

在 `useFrame` 中判定骰子稳定的地方（约第 215-224 行），在调用 `onSettled` 之前添加：

```typescript
playSettleSfx();
```

同样在 `onSleep` 回调中（约第 271-279 行）添加：

```typescript
playSettleSfx();
```

**Step 3: 验证**

Run: `pnpm run dev`
Expected: 骰子停止时听到低沉的「笃」声

---

#### Task 8: 在 `D20Dice.tsx` 集成滚动摩擦声

**Files:**
- Modify: `src/components/dice/D20Dice.tsx`

**Step 1: 导入 RollingSfx 类**

更新导入：
```typescript
import { playDiceCollisionSfx, playThrowSfx, playSettleSfx, RollingSfx } from '../../features/dice/diceSfx';
```

**Step 2: 在投掷开始时启动滚动声**

在处理 `rollId` 变化的 `useEffect` 中，施加冲量后添加：
```typescript
// 启动滚动摩擦声（单例自动处理重复调用）
RollingSfx.instance.start();
```

**Step 3: 在 useFrame 中更新滚动声**

在 `useFrame` 中，当骰子正在滚动时（`rollingRef.current && isRolling`），添加：
```typescript
// 更新滚动摩擦声
RollingSfx.instance.update({ angularSpeed });
```

**Step 4: 在骰子稳定时停止滚动声**

在判定骰子稳定的地方，调用 `playSettleSfx()` 之前添加：
```typescript
RollingSfx.instance.stop();
```

同样在 `onSleep` 回调中添加停止逻辑。

**Step 5: 验证**

Run: `pnpm run dev`
Expected: 骰子滚动时听到持续的低沉「咕噜」声（作为背景），停止时声音淡出

---

#### Task 9: 集成弹跳音效（与碰撞音效互斥）

**Files:**
- Modify: `src/components/dice/D20Dice.tsx`

**Step 1: 导入新函数**

更新导入：
```typescript
import { 
  playDiceCollisionSfx, 
  playThrowSfx, 
  playSettleSfx, 
  playBounceSfx, 
  RollingSfx 
} from '../../features/dice/diceSfx';
```

**Step 2: 修改碰撞回调，添加互斥逻辑**

在 `onCollisionEnter` 回调中，修改音效播放逻辑：

```typescript
onCollisionEnter={({ target, other }) => {
  if (!isRolling && !rollingRef.current) return;
  if (isDraggingRef.current) return;

  const nowMs = performance.now();
  if (nowMs - lastCollisionSoundAtRef.current < 55) return;

  const selfVelocity = target.rigidBody?.linvel?.() as { x: number; y: number; z: number } | undefined;
  const otherVelocity = other.rigidBody?.linvel?.() as { x: number; y: number; z: number } | undefined;

  const relVelX = (selfVelocity?.x ?? 0) - (otherVelocity?.x ?? 0);
  const relVelY = (selfVelocity?.y ?? 0) - (otherVelocity?.y ?? 0);
  const relVelZ = (selfVelocity?.z ?? 0) - (otherVelocity?.z ?? 0);

  const relativeSpeed = Math.hypot(relVelX, relVelY, relVelZ);
  if (relativeSpeed < 0.35) return;

  lastCollisionSoundAtRef.current = nowMs;

  // 计算垂直和水平速度分量
  const verticalSpeed = Math.abs(relVelY);
  const horizontalSpeed = Math.hypot(relVelX, relVelZ);

  // 优先级：弹跳 > 刮擦 > 普通碰撞（互斥）
  if (verticalSpeed > 2.0 && playBounceSfx({ impactSpeed: verticalSpeed })) {
    return; // 播放了弹跳音效，跳过其他
  }

  if (playScrapeSfx({ horizontalSpeed, verticalSpeed })) {
    return; // 播放了刮擦音效，跳过普通碰撞
  }

  // 默认播放普通碰撞音效
  playDiceCollisionSfx({ relativeSpeed });
}}
```

**Step 3: 验证**

Run: `pnpm run dev`
Expected: 
- 骰子从高处落下时听到「砰」声（弹跳音效）
- 骰子贴边滑动时听到「刺啦」声（刮擦音效）
- 普通碰撞时听到原有碰撞音效
- 三种音效不会同时播放

---

#### Task 10: 导入 playScrapeSfx

**Files:**
- Modify: `src/components/dice/D20Dice.tsx`

**Step 1: 更新导入**

确保导入包含 `playScrapeSfx`：
```typescript
import { 
  playDiceCollisionSfx, 
  playThrowSfx, 
  playSettleSfx, 
  playBounceSfx, 
  playScrapeSfx,
  RollingSfx 
} from '../../features/dice/diceSfx';
```

**Step 2: 验证**

Run: `pnpm run build`
Expected: 无 TypeScript 编译错误

---

### P3（回归验证）

#### Task 11: 完整功能验证

**验证清单：**

1. **编译检查**
   - `pnpm run build` — 无编译错误

2. **桌面端测试**（`pnpm run dev`）
   - [ ] 点击骰子 → 听到起手「咔」声
   - [ ] 骰子滚动中 → 听到持续低沉「咕噜」声（背景音量）
   - [ ] 骰子普通碰撞 → 听到原有碰撞音
   - [ ] 骰子从高处落下 → 听到弹跳「砰」声（与碰撞音互斥）
   - [ ] 骰子贴边滑动 → 听到刮擦「刺啦」声
   - [ ] 骰子完全静止 → 听到落定「笃」声

3. **音量平衡检查**
   - [ ] 碰撞音效最响（主角）
   - [ ] 弹跳音效次之
   - [ ] 起手/落定音效适中
   - [ ] 滚动声最轻（背景）
   - [ ] 刮擦声适中

4. **移动端测试**（iOS Safari）
   - [ ] 首次点击后音频正常解锁
   - [ ] 各音效正常播放
   - [ ] 无明显延迟或爆音

5. **性能检查**
   - [ ] 无明显卡顿
   - [ ] 快速连续投掷不会导致音频堆积

---

## 音量参考表

| 音效 | 基础音量 | 最大音量 | 说明 |
|------|----------|----------|------|
| 碰撞 | 0.15 | 0.70 | 主角，最响 |
| 弹跳 | 0.18 | 0.53 | 强调垂直冲击 |
| 起手 | 0.28 | 0.28 | 固定，短促 |
| 落定 | 0.22 | 0.22 | 固定，收尾 |
| 刮擦 | 0.08 | 0.26 | 中等 |
| 滚动 | 0 | 0.12 | 背景，最轻 |

---

## 不确定项

1. **滚动声的角速度阈值**：需要实际测试调整 `angularSpeed / 12` 的分母值
2. **弹跳触发阈值**：`verticalSpeed > 2.0` 可能需要根据实际效果调整
3. **刮擦判断条件**：`horizontalSpeed > verticalSpeed * 2` 可能需要微调

---

## 下一步

计划已更新（v2），请选择：
- **直接进入执行**：使用 `executing-plans` 分批实现
- **继续 review**：对更新后的计划提出进一步意见
