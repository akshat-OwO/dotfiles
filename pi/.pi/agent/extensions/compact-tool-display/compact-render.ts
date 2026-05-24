// Keep compact formatting in sync with pi-cursor-sdk src/cursor-compact-tool-display.ts.
import { isAbsolute, relative } from "node:path";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { getLanguageFromPath, highlightCode } from "@earendil-works/pi-coding-agent";
import { Container, Text, type Component } from "@earendil-works/pi-tui";

type CompactToolTheme = Parameters<NonNullable<ToolDefinition["renderCall"]>>[1];
type CompactToolRenderContext = Parameters<NonNullable<ToolDefinition["renderCall"]>>[2];
type CompactToolResult = Parameters<NonNullable<ToolDefinition["renderResult"]>>[0];

export const COMPACT_ROW_PADDING = "  ";
const COMPACT_ICON_READ = "→";
const COMPACT_ICON_WRITE = "←";
const COMPACT_ICON_SHELL = "$";
const COMPACT_ICON_SEARCH = "✱";

function withCompactPadding(text: string): string {
	return `${COMPACT_ROW_PADDING}${text}`;
}

function asTextComponent(component: Component | undefined): Text {
	return component instanceof Text ? component : new Text("", 0, 0);
}

function getArgPath(args: Record<string, unknown>): string | undefined {
	const rawPath = typeof args.path === "string" ? args.path : typeof args.file_path === "string" ? args.file_path : undefined;
	return rawPath?.trim() ? rawPath : undefined;
}

export function formatDisplayPath(path: string, cwd: string): string {
	const trimmed = path.trim();
	if (!trimmed) return trimmed;
	if (!isAbsolute(trimmed)) return trimmed;
	const relativePath = relative(cwd, trimmed);
	if (!relativePath || relativePath === "") return ".";
	if (relativePath.startsWith("..") || isAbsolute(relativePath)) return trimmed;
	return relativePath;
}

function quoteCompactPattern(pattern: string): string {
	return `"${pattern.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function formatCompactIcon(theme: CompactToolTheme, icon: string): string {
	return theme.fg("dim", `${icon} `);
}

function formatCompactParamBracket(theme: CompactToolTheme, params: Array<[string, string | number | boolean | undefined]>): string {
	const parts = params
		.filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined)
		.map(([key, value]) => `${key}=${value}`);
	return parts.length > 0 ? theme.fg("dim", ` [${parts.join(", ")}]`) : "";
}

function formatCompactCountSuffix(theme: CompactToolTheme, count: number, singular: string, plural = `${singular}s`): string {
	return theme.fg("dim", ` (${count} ${count === 1 ? singular : plural})`);
}

function formatCompactMatchSuffix(theme: CompactToolTheme, count: number): string {
	return formatCompactCountSuffix(theme, count, "match", "matches");
}

function formatCompactDurationMs(ms: number): string {
	return `${(ms / 1000).toFixed(1)}s`;
}

export function formatCompactReadCall(args: Record<string, unknown>, theme: CompactToolTheme, cwd: string): string {
	const rawPath = getArgPath(args);
	const path = rawPath ? formatDisplayPath(rawPath, cwd) : theme.fg("toolOutput", "...");
	let text = formatCompactIcon(theme, COMPACT_ICON_READ);
	text += theme.fg("toolTitle", theme.bold("Read"));
	text += ` ${theme.fg("accent", path)}`;
	text += formatCompactParamBracket(theme, [
		["offset", typeof args.offset === "number" ? args.offset : undefined],
		["limit", typeof args.limit === "number" ? args.limit : undefined],
	]);
	return text;
}

export function formatCompactGrepCall(
	args: Record<string, unknown>,
	theme: CompactToolTheme,
	cwd: string,
	matchCount?: number,
): string {
	const rawPattern = typeof args.pattern === "string" ? args.pattern : undefined;
	const rawPath = getArgPath(args);
	const path = rawPath ? formatDisplayPath(rawPath, cwd) : ".";
	let text = formatCompactIcon(theme, COMPACT_ICON_SEARCH);
	text += theme.fg("toolTitle", theme.bold("Grep"));
	text += " ";
	text += rawPattern ? theme.fg("accent", quoteCompactPattern(rawPattern)) : theme.fg("toolOutput", "...");
	text += theme.fg("dim", " in ");
	text += theme.fg("accent", path);
	text += formatCompactParamBracket(theme, [
		["glob", typeof args.glob === "string" && args.glob.trim() ? args.glob : undefined],
		["limit", typeof args.limit === "number" ? args.limit : undefined],
		["context", typeof args.context === "number" ? args.context : undefined],
		["ignoreCase", args.ignoreCase === true ? true : undefined],
		["literal", args.literal === true ? true : undefined],
	]);
	if (matchCount !== undefined) text += formatCompactMatchSuffix(theme, matchCount);
	return text;
}

export function formatCompactFindCall(
	args: Record<string, unknown>,
	theme: CompactToolTheme,
	cwd: string,
	matchCount?: number,
): string {
	const rawPattern = typeof args.pattern === "string" ? args.pattern : undefined;
	const rawPath = getArgPath(args);
	const path = rawPath ? formatDisplayPath(rawPath, cwd) : ".";
	let text = formatCompactIcon(theme, COMPACT_ICON_SEARCH);
	text += theme.fg("toolTitle", theme.bold("Find"));
	text += " ";
	text += rawPattern ? theme.fg("accent", quoteCompactPattern(rawPattern)) : theme.fg("toolOutput", "...");
	text += theme.fg("dim", " in ");
	text += theme.fg("accent", path);
	text += formatCompactParamBracket(theme, [["limit", typeof args.limit === "number" ? args.limit : undefined]]);
	if (matchCount !== undefined) text += formatCompactMatchSuffix(theme, matchCount);
	return text;
}

export function formatCompactBashCall(
	args: Record<string, unknown>,
	theme: CompactToolTheme,
	_cwd: string,
	resultMeta?: { exitCode?: number; durationMs?: number },
): string {
	const command = typeof args.command === "string" ? args.command.trim() : undefined;
	let text = formatCompactIcon(theme, COMPACT_ICON_SHELL);
	text += command ? theme.fg("accent", command) : theme.fg("toolOutput", "...");
	text += formatCompactParamBracket(theme, [["timeout", typeof args.timeout === "number" ? args.timeout : undefined]]);
	if (resultMeta?.exitCode !== undefined || resultMeta?.durationMs !== undefined) {
		const parts: string[] = [];
		if (resultMeta.exitCode !== undefined) parts.push(`exit ${resultMeta.exitCode}`);
		if (resultMeta.durationMs !== undefined && resultMeta.durationMs >= 0) parts.push(formatCompactDurationMs(resultMeta.durationMs));
		if (parts.length > 0) text += theme.fg("dim", ` (${parts.join(" · ")})`);
	}
	return text;
}

export function formatCompactEditCall(args: Record<string, unknown>, theme: CompactToolTheme, cwd: string): string {
	const rawPath = getArgPath(args);
	const path = rawPath ? formatDisplayPath(rawPath, cwd) : theme.fg("toolOutput", "...");
	let text = formatCompactIcon(theme, COMPACT_ICON_WRITE);
	text += theme.fg("toolTitle", theme.bold("Edit"));
	text += ` ${theme.fg("accent", path)}`;
	return text;
}

export function formatCompactWriteCall(args: Record<string, unknown>, theme: CompactToolTheme, cwd: string): string {
	const rawPath = getArgPath(args);
	const path = rawPath ? formatDisplayPath(rawPath, cwd) : theme.fg("toolOutput", "...");
	let text = formatCompactIcon(theme, COMPACT_ICON_WRITE);
	text += theme.fg("toolTitle", theme.bold("Write"));
	text += ` ${theme.fg("accent", path)}`;
	return text;
}

export function formatCompactLsCall(
	args: Record<string, unknown>,
	theme: CompactToolTheme,
	cwd: string,
	entryCount?: number,
): string {
	const rawPath = getArgPath(args);
	const path = rawPath ? formatDisplayPath(rawPath, cwd) : ".";
	let text = formatCompactIcon(theme, COMPACT_ICON_READ);
	text += theme.fg("toolTitle", theme.bold("List"));
	text += ` ${theme.fg("accent", path)}`;
	text += formatCompactParamBracket(theme, [["limit", typeof args.limit === "number" ? args.limit : undefined]]);
	if (entryCount !== undefined) text += formatCompactCountSuffix(theme, entryCount, "entry", "entries");
	return text;
}

const COMPACT_CALL_FORMATTERS = {
	read: formatCompactReadCall,
	grep: formatCompactGrepCall,
	find: formatCompactFindCall,
	bash: formatCompactBashCall,
	edit: formatCompactEditCall,
	write: formatCompactWriteCall,
	ls: formatCompactLsCall,
} as const;

export type CompactToolName = keyof typeof COMPACT_CALL_FORMATTERS;

const COMPACT_PREVIEW_MAX_LINES = 8;
const COMPACT_DIFF_PREVIEW_LINE_MAX_CHARS = 240;
const COMPACT_DIFF_BLOCK_BG_RGB = { r: 0x14, g: 0x14, b: 0x14 } as const;
// Zero-width space survives pi-tui Text.render()'s trim() empty-line skip.
const COMPACT_DIFF_BLOCK_SPACER_TEXT = "\u200b";
const DIFF_BG = {
	added: { r: 0x18, g: 0x24, b: 0x18 },
	removed: { r: 0x24, g: 0x18, b: 0x18 },
} as const;

type DiffLineKind = "added" | "removed" | "context";

interface CompactDiffPreviewLine {
	text: string;
	bgFn: (text: string) => string;
}

interface ParsedUnifiedDiffLine {
	kind: DiffLineKind;
	lineNumber: number;
	content: string;
}

function rgbBgFn(rgb: { r: number; g: number; b: number }): (text: string) => string {
	return (text: string) => `\x1b[48;2;${rgb.r};${rgb.g};${rgb.b}m${text}\x1b[49m`;
}

function diffLineBgFn(kind: DiffLineKind): (text: string) => string {
	if (kind === "context") return rgbBgFn(COMPACT_DIFF_BLOCK_BG_RGB);
	return rgbBgFn(DIFF_BG[kind]);
}

function getCompactDiffBlockBgFn(): (text: string) => string {
	return rgbBgFn(COMPACT_DIFF_BLOCK_BG_RGB);
}

function renderCompactFileMutationBlock(
	callLine: string,
	previewLines: CompactDiffPreviewLine[] | undefined,
): Component {
	const container = new Container();
	if (previewLines && previewLines.length > 0) {
		const blockBgFn = getCompactDiffBlockBgFn();
		container.addChild(new Text(COMPACT_DIFF_BLOCK_SPACER_TEXT, COMPACT_ROW_PADDING.length, 0, blockBgFn));
		container.addChild(new Text(callLine, COMPACT_ROW_PADDING.length, 0, blockBgFn));
		for (const previewLine of previewLines) {
			container.addChild(new Text(previewLine.text, COMPACT_ROW_PADDING.length, 0, previewLine.bgFn));
		}
	} else {
		container.addChild(new Text(callLine, COMPACT_ROW_PADDING.length, 0));
	}
	return container;
}

function replaceCompactDiffTabs(text: string): string {
	return text.replace(/\t/g, "   ");
}

function truncateCompactDiffLine(text: string, maxChars = COMPACT_DIFF_PREVIEW_LINE_MAX_CHARS): string {
	return text.length > maxChars ? `${text.slice(0, Math.max(maxChars - 1, 0))}…` : text;
}

function parseCompactDiffHunkHeader(line: string): { oldLine: number; newLine: number } | undefined {
	const match = /^@@\s+-(\d+)(?:,\d+)?\s+\+(\d+)(?:,\d+)?\s+@@/.exec(line);
	if (!match) return undefined;
	return { oldLine: Number(match[1]), newLine: Number(match[2]) };
}

function parseUnifiedDiffLines(diff: string): ParsedUnifiedDiffLine[] {
	const lines = diff.split("\n");
	const oldFileIsNull = lines.some((line) => line === "--- /dev/null");
	const newFileIsNull = lines.some((line) => line === "+++ /dev/null");
	const parsed: ParsedUnifiedDiffLine[] = [];
	let oldLine = 1;
	let newLine = 1;

	for (const line of lines) {
		if (!line || line.startsWith("--- ") || line.startsWith("+++ ")) continue;
		const hunk = parseCompactDiffHunkHeader(line);
		if (hunk) {
			oldLine = hunk.oldLine;
			newLine = hunk.newLine;
			continue;
		}

		if (line.startsWith("+")) {
			if (newFileIsNull) continue;
			parsed.push({ kind: "added", lineNumber: newLine, content: line.slice(1) });
			newLine += 1;
		} else if (line.startsWith("-")) {
			if (oldFileIsNull && line === "-") continue;
			parsed.push({ kind: "removed", lineNumber: oldLine, content: line.slice(1) });
			oldLine += 1;
		} else if (line.startsWith(" ")) {
			parsed.push({ kind: "context", lineNumber: newLine, content: line.slice(1) });
			oldLine += 1;
			newLine += 1;
		} else {
			parsed.push({ kind: "context", lineNumber: newLine, content: line });
			oldLine += 1;
			newLine += 1;
		}
	}

	return parsed;
}

function highlightDiffContents(contents: string[], path: string | undefined, theme: CompactToolTheme): string[] {
	if (contents.length === 0) return [];
	const lang = path ? getLanguageFromPath(path) : undefined;
	const normalized = contents.map((content) => truncateCompactDiffLine(replaceCompactDiffTabs(content)));
	if (!lang) {
		return normalized.map((content) => theme.fg("toolOutput", content));
	}
	try {
		const highlighted = highlightCode(normalized.join("\n"), lang);
		return normalized.map((content, index) => highlighted[index] ?? theme.fg("toolOutput", content));
	} catch {
		return normalized.map((content) => theme.fg("toolOutput", content));
	}
}

function formatDiffSign(kind: DiffLineKind, theme: CompactToolTheme): string {
	if (kind === "added") return theme.fg("toolDiffAdded", "+");
	if (kind === "removed") return theme.fg("toolDiffRemoved", "-");
	return "  ";
}

function formatDiffGutterLine(
	line: ParsedUnifiedDiffLine,
	highlightedContent: string,
	lineNumberWidth: number,
	theme: CompactToolTheme,
): string {
	const lineNumber = theme.fg("dim", String(line.lineNumber).padStart(lineNumberWidth, " "));
	return `${lineNumber} ${formatDiffSign(line.kind, theme)} ${highlightedContent}`;
}

function buildCompactDiffPreviewLines(
	diff: string,
	theme: CompactToolTheme,
	maxLines: number,
	path?: string,
): CompactDiffPreviewLine[] {
	const parsed = parseUnifiedDiffLines(diff);
	if (parsed.length === 0) return [];

	const visible = parsed.slice(0, maxLines);
	const hiddenCount = parsed.length - visible.length;
	const lineNumberWidth = Math.max(
		1,
		...visible.map((line) => String(line.lineNumber).length),
		hiddenCount > 0 ? String(parsed[parsed.length - 1]?.lineNumber ?? 0).length : 0,
	);
	const highlightedContents = highlightDiffContents(
		visible.map((line) => line.content),
		path,
		theme,
	);

	const previewLines: CompactDiffPreviewLine[] = visible.map((line, index) => ({
		text: formatDiffGutterLine(line, highlightedContents[index] ?? "", lineNumberWidth, theme),
		bgFn: diffLineBgFn(line.kind),
	}));

	if (hiddenCount > 0) {
		previewLines.push({
			text: theme.fg("muted", `... (${hiddenCount} more diff lines hidden)`),
			bgFn: diffLineBgFn("context"),
		});
	}

	return previewLines;
}

function getNativeEditDiff(details: unknown): string | undefined {
	if (!details || typeof details !== "object") return undefined;
	const diff = (details as { diff?: unknown }).diff;
	return typeof diff === "string" && diff.length > 0 ? diff : undefined;
}

function trimTrailingEmptyLines(text: string): string {
	const lines = text.split("\n");
	while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
	return lines.join("\n");
}

function buildWriteUnifiedDiff(path: string, content: string): string {
	const body = trimTrailingEmptyLines(content);
	const lines = body.length > 0 ? body.split("\n") : [];
	const displayPath = path.trim() || "file";
	const hunk = lines.length === 0 ? "@@ -0,0 +0,0 @@" : `@@ -0,0 +1,${lines.length} @@`;
	return [`--- /dev/null`, `+++ b/${displayPath}`, hunk, ...lines.map((line) => `+${line}`)].join("\n");
}

function countDisplayLines(text: string): number {
	const withoutFinalNewline = text.endsWith("\n") ? text.slice(0, -1) : text;
	return withoutFinalNewline ? withoutFinalNewline.split("\n").length : 0;
}

function buildCompactFileMutationPreview(
	toolName: "edit" | "write",
	result: CompactToolResult,
	args: Record<string, unknown> | undefined,
	theme: CompactToolTheme,
	expanded: boolean,
): CompactDiffPreviewLine[] | undefined {
	const maxLines = expanded ? 40 : COMPACT_PREVIEW_MAX_LINES;
	const rawPath = getArgPath(args);
	const path = rawPath ? formatDisplayPath(rawPath, process.cwd()) : "file";
	const diff = getNativeEditDiff(result.details) ?? (toolName === "write" && typeof args?.content === "string" && args.content.length > 0
		? buildWriteUnifiedDiff(path, args.content)
		: undefined);
	if (!diff) return undefined;
	return buildCompactDiffPreviewLines(diff, theme, maxLines, path);
}

function formatCompactFileMutationCallLine(
	toolName: "edit" | "write",
	args: Record<string, unknown> | undefined,
	theme: CompactToolTheme,
	cwd: string,
): string {
	let callLine = COMPACT_CALL_FORMATTERS[toolName](args ?? {}, theme, cwd);
	if (toolName === "write" && typeof args?.content === "string" && args.content.length > 0) {
		const lineCount = countDisplayLines(args.content);
		callLine += theme.fg("dim", ` (${lineCount} ${lineCount === 1 ? "line" : "lines"})`);
	}
	return callLine;
}

function renderCompactFileMutationToolResult(
	toolName: "edit" | "write",
	result: CompactToolResult,
	options: Parameters<NonNullable<ToolDefinition["renderResult"]>>[1],
	theme: CompactToolTheme,
	context: Parameters<NonNullable<ToolDefinition["renderResult"]>>[3],
	isError: boolean,
	getFallbackRenderResult: () => Component,
): Component {
	if (options.isPartial) return new Text("", 0, 0);
	if (isError) return getFallbackRenderResult();

	const args = context.args && typeof context.args === "object" ? (context.args as Record<string, unknown>) : undefined;
	const previewLines = buildCompactFileMutationPreview(toolName, result, args, theme, options.expanded ?? false);
	if (previewLines) {
		return renderCompactFileMutationBlock(formatCompactFileMutationCallLine(toolName, args, theme, context.cwd), previewLines);
	}
	if (options.expanded) return getFallbackRenderResult();
	return new Text("", 0, 0);
}

function getCompactResultText(result: CompactToolResult): string {
	return result.content
		.filter((entry): entry is { type: "text"; text: string } => entry.type === "text" && typeof entry.text === "string")
		.map((entry) => entry.text)
		.join("\n");
}

function countCompactSearchMatches(toolName: "grep" | "find", result: CompactToolResult): number {
	const text = getCompactResultText(result).trim();
	if (!text) return 0;
	if (toolName === "find" && text === "No files found matching pattern") return 0;
	return text.split("\n").filter((line) => {
		const trimmed = line.trim();
		return trimmed.length > 0 && !trimmed.startsWith("[");
	}).length;
}

function countCompactLsEntries(result: CompactToolResult): number {
	const text = getCompactResultText(result).trim();
	if (!text || text === "(empty directory)") return 0;
	return text.split("\n").filter((line) => {
		const trimmed = line.trim();
		return trimmed.length > 0 && !trimmed.startsWith("[");
	}).length;
}

function getCompactBashDurationMs(context: CompactToolRenderContext): number | undefined {
	const state = context.state as { startedAt?: number; endedAt?: number } | undefined;
	if (state?.startedAt === undefined) return undefined;
	const end = state.endedAt ?? Date.now();
	return Math.max(end - state.startedAt, 0);
}

export function renderCompactToolCall(
	toolName: CompactToolName,
	args: Record<string, unknown>,
	theme: CompactToolTheme,
	context: CompactToolRenderContext,
): Text {
	if ((toolName === "edit" || toolName === "write") && !context.isPartial) {
		return new Text("", 0, 0);
	}
	const text = asTextComponent(context.lastComponent);
	text.setText(withCompactPadding(COMPACT_CALL_FORMATTERS[toolName](args, theme, context.cwd)));
	return text;
}

export function renderCompactToolResult(
	toolName: CompactToolName,
	result: CompactToolResult,
	options: Parameters<NonNullable<ToolDefinition["renderResult"]>>[1],
	theme: Parameters<NonNullable<ToolDefinition["renderResult"]>>[2],
	context: Parameters<NonNullable<ToolDefinition["renderResult"]>>[3],
	isError: boolean,
	getCurrentRenderResult: () => ToolDefinition["renderResult"] | undefined,
): Component {
	if (toolName === "edit" || toolName === "write") {
		return renderCompactFileMutationToolResult(toolName, result, options, theme, context, isError, () => {
			const currentRenderResult = getCurrentRenderResult();
			return currentRenderResult ? currentRenderResult(result, options, theme, context) : new Text("", 0, 0);
		});
	}

	const text = asTextComponent(context.lastComponent);
	if (!options.expanded && !isError) {
		const hasImage = result.content.some((entry) => entry.type === "image");
		if (hasImage) {
			text.setText(withCompactPadding(theme.fg("dim", "[image loaded — expand to view]")));
			return text;
		}
		if (context.args && typeof context.args === "object") {
			const args = context.args as Record<string, unknown>;
			if (toolName === "grep" || toolName === "find") {
				const matchCount = countCompactSearchMatches(toolName, result);
				text.setText(withCompactPadding(COMPACT_CALL_FORMATTERS[toolName](args, theme, context.cwd, matchCount)));
				return text;
			}
			if (toolName === "bash") {
				const durationMs = getCompactBashDurationMs(context);
				text.setText(
					withCompactPadding(
						formatCompactBashCall(args, theme, context.cwd, {
							exitCode: 0,
							durationMs,
						}),
					),
				);
				return text;
			}
			if (toolName === "ls") {
				const entryCount = countCompactLsEntries(result);
				text.setText(withCompactPadding(formatCompactLsCall(args, theme, context.cwd, entryCount)));
				return text;
			}
		}
		text.setText("");
		return text;
	}
	const currentRenderResult = getCurrentRenderResult();
	if (!currentRenderResult) {
		text.setText("");
		return text;
	}
	return currentRenderResult(result, options, theme, context);
}
