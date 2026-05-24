# Compact Tool Display

Global [pi](https://github.com/badlogic/pi-mono) extension that renders common tools as compact one-line calls (OpenCode-style) instead of boxed tool cards.

Installed at `~/.pi/agent/extensions/compact-tool-display/` and auto-loaded by pi.

## Example

```
  → Read README.md [limit=80]
  ✱ Grep "registerTool" in src (2 matches) [glob=*.ts, limit=50]
  ✱ Find "*.test.ts" in src (12 matches) [limit=200]
  $ npm test (exit 0 · 1.2s)
  ← Edit src/index.ts
  ← Write README.md
  → List src (12 entries)
  → Cursor plan 2 items
```

Collapsed output is hidden for most tools. Press **Ctrl+O** (or click the tool row) to expand full results.

`edit` and `write` show a bounded OpenCode-style diff preview under the call line even when collapsed:

- Spacer row + call line share a dark block background (`#141414`)
- Added lines: green tint (`#182418`); removed lines: red tint (`#241818`)
- Syntax-highlighted content with line-number gutters
- Expanded edit/write reuse the same block styling with a higher line budget

## Quick test

```bash
pi -e ~/.pi/agent/extensions/compact-tool-display/index.ts
```

## Scope

Currently overrides:

- `read`
- `grep`
- `find`
- `bash`
- `edit`
- `write`
- `ls`

## Notes for pi-cursor-sdk users

When `PI_CURSOR_NATIVE_TOOL_DISPLAY=1`, pi-cursor-sdk registers its own compact replay wrappers for the same tool names plus Cursor replay tools. **Do not enable this global extension alongside pi-cursor-sdk for Cursor models** — duplicate registrations can silently override replay-specific diff rendering. Remove or disable this extension and use pi-cursor-sdk's built-in compact display instead. For all other pi models/providers, use this global extension.

## Maintainer note

Keep `compact-render.ts` formatting aligned with pi-cursor-sdk `src/cursor-compact-tool-display.ts` and `src/cursor-compact-diff-display.ts`. Avoid glob examples containing `*` + `/` inside block comments in `index.ts` — sequences like `**/` prematurely terminate JSDoc comments.
