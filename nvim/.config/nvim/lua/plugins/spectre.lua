return {
    {
        "nvim-pack/nvim-spectre",
        lazy = true,
        cmd = { "Spectre" },
        dependencies = {
            "nvim-lua/plenary.nvim",
            "rose-pine/neovim",
        },
        config = function()
            local theme = require("rose-pine.palette")

            vim.api.nvim_set_hl(0, "SpectreSearch", { bg = theme.love, fg = theme.base })
            vim.api.nvim_set_hl(0, "SpectreReplace", { bg = theme.foam, fg = theme.base })

            require("spectre").setup({
                highlight = {
                    search = "SpectreSearch",
                    replace = "SpectreReplace",
                },
                mapping = {
                    ["send_to_qf"] = {
                        map = "<C-q>",
                        cmd = "<cmd>lua require('spectre.actions').send_to_qf()<CR>",
                        desc = "send all items to quickfix",
                    },
                },
                -- replace_engine = {
                -- 	sed = {
                -- 		cmd = "sed",
                -- 		args = {
                -- 			"-i",
                -- 			"",
                -- 			"-E",
                -- 		},
                -- 	},
                -- },
            })
        end,
    },
}
