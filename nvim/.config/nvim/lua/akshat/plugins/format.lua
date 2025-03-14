return {
	{
		"stevearc/conform.nvim",
		event = { "BufReadPre", "BufNewFile" },
		config = function()
			local conform = require("conform")

			conform.setup({
				formatters_by_ft = {
					javascript = { "prettier" },
					typescript = { "prettier" },
					javascriptreact = { "prettier" },
					typescriptreact = { "prettier" },
					css = { "prettier" },
					html = { "prettier" },
					json = { "prettier" },
					yaml = { "prettier" },
					markdown = { "prettier" },
					graphql = { "prettier" },
					lua = { "stylua" },
					python = { "isort", "black" },
					go = { "gofmt" },
				},
				formatters = {
					prettier = {
						command = "prettier",
						args = function()
							local config_file = vim.fs.find({ ".prettierrc", ".prettierrc.json", ".prettierrc.js" }, { upward = true })[1]
							if config_file then
								return { "--stdin-filepath", "$FILENAME" }
							end
							return {
								"--stdin-filepath",
								"$FILENAME",
								"--tab-width",
								"4",
								"--print-width",
								"120",
								"--use-tabs",
								"true",
								"--trailing-comma",
								"all",
								"--semi",
								"true",
							}
						end,
						stdin = true,
						cwd = function()
							local config_file = vim.fs.find({ ".prettierrc", ".prettierrc.json", ".prettierrc.js" }, { upward = true })[1]
							if config_file then
								return vim.fs.dirname(config_file)
							end
							return vim.fs.dirname(vim.api.nvim_buf_get_name(0))
						end,
					},
				},
			})

			-- Keymapping for manual formatting
			vim.keymap.set({ "n", "v" }, "<leader>f", function()
				conform.format({
					lsp_fallback = true,
					async = true,
					timeout_ms = 2000,
				})
			end, { desc = "[F]ormat file or range (in visual mode)", silent = true })
		end,
	},
}
