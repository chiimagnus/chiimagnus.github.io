# Cursor `.mdc` 规则迁移到 `AGENTS.md` 实施计划

> 执行方式：建议使用 `executing-plans` 按批次实现与验收。

**Goal（目标）:** 将 `.cursor/rules/chiiBlog.mdc` 与 `.cursor/rules/liquid-glass-rule.mdc` 转换为仓库可用的 `AGENTS.md`（按目录作用域生效），并把旧的 Cursor rules 文件移除。

**Non-goals（非目标）:**
- 不改任何业务代码实现（仅迁移规则文档）。
- 不引入新的工具链或 CI 规则。

**Approach（方案）:**
- `chiiBlog.mdc` 属于全仓库通用开发约定，迁移为仓库根目录 `AGENTS.md`。
- `liquid-glass-rule.mdc` 仅适用于 `src/components/blog/` 下的 `LiquidGlass.tsx` / `*Card.tsx` / `Sidebar.tsx`，迁移为 `src/components/blog/AGENTS.md`，并在文档内写明作用范围。
- 删除 `.cursor/rules/` 下的两份 `.mdc`，若目录为空则一并删除。

**Acceptance（验收）:**
- 存在 `AGENTS.md`（仓库根）与 `src/components/blog/AGENTS.md`，内容覆盖原 `.mdc` 的核心规则与说明。
- `.cursor/rules/chiiBlog.mdc` 与 `.cursor/rules/liquid-glass-rule.mdc` 不再存在（目录为空时删除目录）。
- `git diff` 显示仅新增/删除文档文件，无代码改动。

---

## Plan A（主方案）

### Task 1: 迁移全局开发规则到仓库根 `AGENTS.md`

**Files:**
- Create: `AGENTS.md`
- Delete: `.cursor/rules/chiiBlog.mdc`

**Steps:**
1. 将 `chiiBlog.mdc` 的正文（去掉 YAML frontmatter）写入 `AGENTS.md`。
2. 运行：`test -f AGENTS.md`
3. 快速检查：`sed -n '1,40p' AGENTS.md`

### Task 2: 迁移 LiquidGlass 组件规则到 `src/components/blog/AGENTS.md`

**Files:**
- Create: `src/components/blog/AGENTS.md`
- Delete: `.cursor/rules/liquid-glass-rule.mdc`

**Steps:**
1. 将 `liquid-glass-rule.mdc` 的正文（去掉 YAML frontmatter）写入 `src/components/blog/AGENTS.md`。
2. 在文档顶部增加 “Scope/Applies to” 小节，明确对应文件范围。
3. 运行：`test -f src/components/blog/AGENTS.md`
4. 快速检查：`sed -n '1,60p' src/components/blog/AGENTS.md`

### Task 3: 清理 `.cursor/rules` 目录（若为空）

**Files:**
- Delete (optional): `.cursor/rules/`

**Steps:**
1. 运行：`ls -la .cursor/rules || true`
2. 若目录为空，删除：`rmdir .cursor/rules && rmdir .cursor || true`

### Task 4: 验收与回归检查

**Steps:**
1. 运行：`git diff --stat`
2. 运行：`git diff`

