/**
 * Compact Tool Display — global pi extension
 *
 * Renders common tools as single-line calls (OpenCode-style) without boxed tool shells:
 *   → Read README.md [limit=80]
 *   ✱ Grep "pattern" in src [glob=*.ts, limit=50]
 *   ✱ Find "*.test.ts" in src [limit=200]
 *   $ npm test
 *   ← Edit src/index.ts
 *   ← Write README.md
 *   → List src
 *
 * Tool output stays hidden until expanded (Ctrl+O or click).
 *
 * Location: ~/.pi/agent/extensions/compact-tool-display/
 *
 * Quick test:
 *   pi -e ~/.pi/agent/extensions/compact-tool-display/index.ts
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import {
	createBashTool,
	createBashToolDefinition,
	createEditTool,
	createEditToolDefinition,
	createFindTool,
	createFindToolDefinition,
	createGrepTool,
	createGrepToolDefinition,
	createLsTool,
	createLsToolDefinition,
	createReadTool,
	createReadToolDefinition,
	createWriteTool,
	createWriteToolDefinition,
} from "@earendil-works/pi-coding-agent";
import { renderCompactToolCall, renderCompactToolResult, type CompactToolName } from "./compact-render.js";

type ToolBundle = {
	read: ReturnType<typeof createReadTool>;
	grep: ReturnType<typeof createGrepTool>;
	find: ReturnType<typeof createFindTool>;
	bash: ReturnType<typeof createBashTool>;
	edit: ReturnType<typeof createEditTool>;
	write: ReturnType<typeof createWriteTool>;
	ls: ReturnType<typeof createLsTool>;
};

type DefinitionBundle = {
	read: ReturnType<typeof createReadToolDefinition>;
	grep: ReturnType<typeof createGrepToolDefinition>;
	find: ReturnType<typeof createFindToolDefinition>;
	bash: ReturnType<typeof createBashToolDefinition>;
	edit: ReturnType<typeof createEditToolDefinition>;
	write: ReturnType<typeof createWriteToolDefinition>;
	ls: ReturnType<typeof createLsToolDefinition>;
};

const COMPACT_TOOLS: CompactToolName[] = ["read", "grep", "find", "bash", "edit", "write", "ls"];

const toolCache = new Map<string, ToolBundle>();
const definitionCache = new Map<string, DefinitionBundle>();

function getTools(cwd: string): ToolBundle {
	let tools = toolCache.get(cwd);
	if (!tools) {
		tools = {
			read: createReadTool(cwd),
			grep: createGrepTool(cwd),
			find: createFindTool(cwd),
			bash: createBashTool(cwd),
			edit: createEditTool(cwd),
			write: createWriteTool(cwd),
			ls: createLsTool(cwd),
		};
		toolCache.set(cwd, tools);
	}
	return tools;
}

function getDefinitions(cwd: string): DefinitionBundle {
	let definitions = definitionCache.get(cwd);
	if (!definitions) {
		definitions = {
			read: createReadToolDefinition(cwd),
			grep: createGrepToolDefinition(cwd),
			find: createFindToolDefinition(cwd),
			bash: createBashToolDefinition(cwd),
			edit: createEditToolDefinition(cwd),
			write: createWriteToolDefinition(cwd),
			ls: createLsToolDefinition(cwd),
		};
		definitionCache.set(cwd, definitions);
	}
	return definitions;
}

export default function (pi: ExtensionAPI) {
	for (const toolName of COMPACT_TOOLS) {
		pi.registerTool({
			name: toolName,
			label: toolName,
			description: getTools(process.cwd())[toolName].description,
			parameters: getTools(process.cwd())[toolName].parameters,
			renderShell: "self",

			async execute(toolCallId, params, signal, onUpdate, ctx) {
				return getTools(ctx.cwd)[toolName].execute(toolCallId, params, signal, onUpdate);
			},

			renderCall(args, theme, context) {
				return renderCompactToolCall(toolName, args as Record<string, unknown>, theme, context);
			},

			renderResult(result, options, theme, context) {
				const definitions = getDefinitions(context.cwd);
				return renderCompactToolResult(
					toolName,
					result,
					options,
					theme,
					context,
					context.isError,
					() => definitions[toolName].renderResult,
				);
			},
		});
	}
}
