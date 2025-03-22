return {
	{
		"hrsh7th/nvim-cmp",
		dependencies = {
			"L3MON4D3/LuaSnip",
			"saadparwaiz1/cmp_luasnip",
			"hrsh7th/cmp-nvim-lsp",
			"hrsh7th/cmp-path",
			"hrsh7th/cmp-buffer",
            "onsails/lspkind.nvim",
            {
                "windwp/nvim-autopairs",
                opts = {
                    fast_wrap = {},
                    disable_filetype = { "TelescopePrompt", "vim" },
                },
                config = function (_, opts)
                    require("nvim-autopairs").setup(opts)
                    local cmp_autopairs = require("nvim-autopairs.completion.cmp")
                    require("cmp").event:on("confirm_done", cmp_autopairs.on_confirm_done())
                end
            }
		},
		config = function()
			local cmp = require("cmp")
			local luasnip = require("luasnip")
            local lspkind = require("lspkind")
			luasnip.config.setup({})

            -- Set up custom highlights for cmp
            vim.api.nvim_create_autocmd("ColorScheme", {
                pattern = "*",
                callback = function()
                    -- Normal items in completion menu
                    vim.api.nvim_set_hl(0, "CmpNormal", { link = "Normal" })
                    -- Documentation window
                    vim.api.nvim_set_hl(0, "CmpDocNormal", { link = "NormalFloat" })
                    -- Selected item
                    vim.api.nvim_set_hl(0, "PmenuSel", { bg = "#363e59", bold = true })
                    -- Matched text in completion items
                    vim.api.nvim_set_hl(0, "CmpItemAbbrMatch", { fg = "#82aaff", bold = true })
                    vim.api.nvim_set_hl(0, "CmpItemAbbrMatchFuzzy", { fg = "#82aaff", bold = true })
                    -- Kind icons colors
                    vim.api.nvim_set_hl(0, "CmpItemKindVariable", { fg = "#9a86fd" })
                    vim.api.nvim_set_hl(0, "CmpItemKindInterface", { fg = "#89ddff" })
                    vim.api.nvim_set_hl(0, "CmpItemKindText", { fg = "#c3e88d" })
                    vim.api.nvim_set_hl(0, "CmpItemKindFunction", { fg = "#ff966c" })
                    vim.api.nvim_set_hl(0, "CmpItemKindMethod", { fg = "#ff966c" })
                    vim.api.nvim_set_hl(0, "CmpItemKindKeyword", { fg = "#f087bd" })
                    vim.api.nvim_set_hl(0, "CmpItemKindProperty", { fg = "#86e1fc" })
                    vim.api.nvim_set_hl(0, "CmpItemKindUnit", { fg = "#ffe082" })
                end,
            })

			cmp.setup({
				snippet = {
					expand = function(args)
						luasnip.lsp_expand(args.body)
					end,
				},
				completion = { completeopt = "menu,menuone,noinsert" },
                window = {
                    completion = {
                        border = "rounded",
                        winhighlight = "Normal:CmpNormal",
                        scrollbar = true,
                    },
                    documentation = {
                        border = "rounded",
                        winhighlight = "Normal:CmpDocNormal",
                    },
                },
                formatting = {
                    format = lspkind.cmp_format({
                        mode = "symbol_text",
                        maxwidth = 50,
                        ellipsis_char = "...",
                        menu = {
                            buffer = "[Buffer]",
                            nvim_lsp = "[LSP]",
                            luasnip = "[Snippet]",
                            path = "[Path]",
                            lazydev = "[LazyDev]",
                        },
                    }),
                },
                experimental = {
                    ghost_text = true, -- Show ghost text preview
                },
                sorting = {
                    comparators = {
                        cmp.config.compare.offset,
                        cmp.config.compare.exact,
                        cmp.config.compare.score,
                        cmp.config.compare.recently_used,
                        cmp.config.compare.locality,
                        cmp.config.compare.kind,
                        cmp.config.compare.sort_text,
                        cmp.config.compare.length,
                        cmp.config.compare.order,
                    },
                },

				mapping = cmp.mapping.preset.insert({
					["<C-n>"] = cmp.mapping.select_next_item(),
					["<C-p>"] = cmp.mapping.select_prev_item(),
					["<C-b>"] = cmp.mapping.scroll_docs(-4),
					["<C-f>"] = cmp.mapping.scroll_docs(4),
					["<C-y>"] = cmp.mapping.confirm({ select = true }),
					["<C-Space>"] = cmp.mapping.complete({}),
					["<C-l>"] = cmp.mapping(function()
						if luasnip.expand_or_locally_jumpable() then
							luasnip.expand_or_jump()
						end
					end, { "i", "s" }),
					["<C-h>"] = cmp.mapping(function()
						if luasnip.locally_jumpable(-1) then
							luasnip.jump(-1)
						end
					end, { "i", "s" }),
				}),
				sources = {
					{
						name = "lazydev",
						group_index = 0,
					},
					{ name = "nvim_lsp" },
					{ name = "luasnip" },
                    { name = "buffer" },
					{ name = "path" },
				},
			})
		end,
	},
}
