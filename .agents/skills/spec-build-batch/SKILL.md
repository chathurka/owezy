---
name: spec-build-batch
description: >-
  Batch Owezy feature pipeline: run full /spec-build for multiple GitHub issues on
  one shared feature branch, commit after each story, then run /create-pr.
  Use when the user runs /spec-build-batch with two or more issue IDs (space- or
  newline-separated), or asks to spec-build multiple stories on the same branch and PR.
allowed-tools: Read, Write, Glob, Shell(git *), Shell(gh *), Shell(date *), Shell(pnpm *), Shell(flutter *)
---

# spec-build-batch

Run `/spec-build` for **multiple GitHub issues on one branch**, then `/create-pr`.

Do **not** invent a parallel pipeline. Per-story expand → architecture → implement rules live in the `spec-build` skill; PR rules live in `create-pr`. This skill only orchestrates batching, branching, commits, and the final PR.

## When to use

- User runs `/spec-build-batch` with 2+ issue IDs
- User asks to spec-build multiple stories on the same branch and create a PR

For a **single** issue or plain-text description, use `/spec-build` instead.

## Invocation

```
/spec-build-batch <id> <id> ...
```

IDs may be space- or newline-separated, with or without `#`:

```
/spec-build-batch 123 124 125 126 127
```

```
/spec-build-batch
123
124
125
126
127
```

Optional trailing flag: `--no-pr` — finish after the last commit; skip `/create-pr`.

---

## Process

### Step 0 — Load dependent skills

**Immediately** read and follow:

1. `.cursor/skills/spec-build/SKILL.md` (canonical per-story pipeline)
2. `.cursor/skills/create-pr/SKILL.md` (unless `--no-pr`)

If `.cursor/skills/` is missing a file, use the twin under `.agents/skills/`.

### Step 1 — Dirty-tree check

```
git status --porcelain
```

If any uncommitted changes exist, **stop** and tell the user to commit or stash first.

### Step 2 — Parse issue IDs

Extract every integer ID from the user message (strip leading `#`). Deduplicate while preserving order.

| Count | Action |
|-------|--------|
| 0 | Stop; show invocation help |
| 1 | Stop; tell user to run `/spec-build <id>` instead |
| 2+ | Continue |

Plain-text story descriptions are **not** supported in batch mode.

### Step 3 — Fetch all issues up front

For each ID:

```
gh issue view <id> --json title,body,labels,number,url
```

If any fetch fails, **stop** and report which IDs failed. Do not create a branch until every issue loads.

Build a working list of `{ issue_id, title, body, url }`.

### Step 4 — Create one shared branch

Derive `batch_slug`:

1. Prefer a shared epic/theme from titles (e.g. all `E01-S0x` → `e01-auth-s04-s08` using first/last story codes when present).
2. Else: `issues-<first>-<last>` (e.g. `issues-123-127`).
3. Lowercase kebab-case, max 40 chars.

```
git fetch origin develop
git checkout --no-track -b feature/<batch_slug> origin/develop
```

**Never** create a new branch per issue. All stories stay on `feature/<batch_slug>`.

### Step 5 — Run full pipeline per issue (sequential)

Process issues **in the order given**. Finish one completely before starting the next.

For each issue:

1. Follow **all** `spec-build` stages (Expand → Architecture + OpenAPI → Implement), with these batch overrides:
   - **Skip** `spec-build` Step 1.1 (dirty-tree) after the first issue if the tree is only dirty from the prior story’s uncommitted work you are about to commit — or commit first (Step 6), then continue.
   - **Skip** `spec-build` Step 1.3 (create branch) — already on `feature/<batch_slug>`.
   - Still run a fresh `date -u +"%y%m%d%H%M"` per story so stems stay unique; if the timestamp collides, bump by one minute.
   - Update `docs/kb-state.md` with **one row per story** (do not overwrite earlier batch rows).
2. If a story’s spec or architecture is left `draft`, **stop the batch** and report progress (completed IDs vs remaining). Do not start later issues.
3. After the story is `implemented`, proceed to Step 6 for that story.

### Step 6 — Commit after each story

Commit only that story’s changes (do not leave multiple finished stories uncommitted).

```
git add -A
git status
git diff --cached --stat
```

Commit message via HEREDOC (follow repo style; reference the issue):

```
git commit -m "$(cat <<'EOF'
feat(<area>): <short title from issue>

Closes #<issue_id>.

EOF
)"
```

Do **not** push until the final PR step (unless the user asked to push earlier).

If the commit fails due to a hook, fix and create a **new** commit (do not amend unless create-pr / git rules allow).

### Step 7 — Next issue or finish

- More issues remaining → return to Step 5.
- All issues done → Step 8.

### Step 8 — Create PR

Unless `--no-pr`:

Follow the **entire** `create-pr` skill (tests → review → push → `gh pr create`).

Batch PR adaptations:

- **Title:** short theme covering the batch, e.g. `E01 auth: Apple, verify email, reset, sessions, admin (#123–#127)`
- **Body:** one Summary bullet per issue; list every Spec / Arch / OpenAPI / Design path; Surfaces as a rollup table or per-issue list; Test plan from `create-pr` plus “each story verification checklist reviewed”
- **Closing keywords:** include `Closes #id` for each issue in the PR body when the batch is meant to close them

Return the PR URL plus the batch summary below.

If `--no-pr`, print the summary and tell the user to run `/create-pr`.

---

## Final output

```
Branch:    feature/<batch_slug>
Issues:    #<id> <title> → <stem>
           …

Surfaces (rollup):  API | Admin | User web | Mobile

Commits:   <n> (one per story)
PR:        <url | skipped (--no-pr)>

AI Resolutions: summarized per issue (brief)

Design fidelity: per issue (pass | fixed | adapted) — Figma node URLs for user-web/mobile

Next step: review PR | run /create-pr
```

---

## Rules

- Same hard rules as `spec-build` (OpenAPI contract, design fidelity, soft deletes, no financial data in fixtures, GetX only on mobile, no stale `resources/web-user/` or `resources/mobile/` paths).
- **Design sources for batch stories:** user-web → Figma `https://www.figma.com/design/Y7uE63pfuGfkuOHxfeUf3J/Owezy-Web`; mobile → Figma `https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile`; admin-web → local `resources/owezy-admin-console/`. Record Figma URLs with `node-id` in each story’s Design column — do not use `resources/owezy-web/` or `resources/owezy-mobile/` for new UI.
- **One vertical slice at a time inside the batch** — never interleave Stage 3 of story B while story A is unfinished.
- Shared code touched by multiple stories: extend carefully; later stories must not break earlier story tests.
- If stories conflict (same endpoint incompatible shapes), stop and ask the user; do not silently pick one.
- Minimum 2 issue IDs; maximum recommended **8** per batch. If more than 8, warn and ask to confirm before continuing.
- Never force-push; never target `main`/`master` as PR base (base is always `develop`).
