return {
	"stevearc/conform.nvim",
	event = { "BufReadPre", "BufNewFile" },
	config = function()
		local conform = require("conform")
		local util = require("conform.util")

		-- Function to determine formatters dynamically
		local function get_formatters(bufnr)
			local filename = vim.api.nvim_buf_get_name(bufnr)

			-- Check for biome configuration
			local has_biome = util.root_file({
				"biome.json",
				"biome.jsonc",
			}, filename) ~= nil

			-- Check for prettier configuration
			local has_prettier = util.root_file({
				".prettierrc",
				".prettierrc.js",
				".prettierrc.json",
				".prettierrc.yml",
				".prettierrc.yaml",
				".prettierrc.json5",
				".prettierrc.mjs",
				".prettierrc.cjs",
				".prettierrc.toml",
				"prettier.config.js",
				"prettier.config.mjs",
				"prettier.config.cjs",
				"package.json",
			}, filename) ~= nil

			if has_biome then
				return { "biome" }
			elseif has_prettier then
				return { "prettier" }
			end

			-- Return empty if no config is found
			return {}
		end

		conform.setup({
			formatters_by_ft = {
				javascript = get_formatters,
				typescript = get_formatters,
				javascriptreact = get_formatters,
				typescriptreact = get_formatters,
				css = get_formatters,
				html = get_formatters,
				json = get_formatters,
				python = { "isort", "black" },
				lua = { "stylua" },
			},
			formatters = {
				biome = {
					-- Keep biome configuration
					require_cwd = true,
				},
			},
		})

		vim.keymap.set({ "n", "v" }, "<leader>f", function()
			conform.format({
                lsp_format = "fallback",
				async = true,
				timeout_ms = 2000,
			})
		end, { desc = "[F]ormat file or range", silent = true })
	end,
}
