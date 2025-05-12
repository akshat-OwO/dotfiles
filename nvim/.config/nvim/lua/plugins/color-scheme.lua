return {
    {
        "rose-pine/neovim",
        name = "rose-pine",
        lazy = false,
        priority = 1000,
        config = function()
            require("rose-pine").setup({
                variant = "main",
                dim_inactive_windows = false,
                styles = {
                    italic = false,
                }
            })

            vim.cmd.colorscheme("rose-pine")

            -- Get the palette for the current variant
            local palette = require("rose-pine.palette")

            -- Set custom highlights using the palette
            vim.api.nvim_set_hl(0, "BlinkCmpMenu", { bg = palette.base })
            vim.api.nvim_set_hl(0, "BlinkCmpMenuBorder", { fg = palette.foam })
            vim.api.nvim_set_hl(0, "BlinkCmpDoc", { bg = palette.base })
            vim.api.nvim_set_hl(0, "BlinkCmpDocBorder", { fg = palette.foam })
            vim.api.nvim_set_hl(0, "BlinkCmpSignatureHelp", { bg = palette.base })
            vim.api.nvim_set_hl(0, "BlinkCmpSignatureHelpBorder", { fg = palette.foam })
            vim.api.nvim_set_hl(0, "BlinkCmpDocSeparator", { fg = palette.foam, bg = palette.base })
            vim.api.nvim_set_hl(0, "BlinkCmpGhostText", { fg = palette.overlay })

            -- Optionally, hide all semantic highlights
            for _, group in ipairs(vim.fn.getcompletion("@lsp", "highlight")) do
                vim.api.nvim_set_hl(0, group, {})
            end
        end,
    }


}
