return {
    {
        "folke/noice.nvim",
        opts = function(_, opts)
            table.insert(opts.routes, {
                filter = {
                    event = "notify",
                    find = "No information available",
                },
                opts = { skip = true },
            })

            opts.presets.lsp_doc_border = true
        end,
    },
    {
        "rcarriga/nvim-notify",
        opts = {
            timeout = 10000,
        },
    },
    -- filename
    {
        "b0o/incline.nvim",
        dependencies = { "datsfilipe/vesper.nvim" },
        event = "BufReadPre",
        priority = 1200,
        config = function()
            local colors = require("vesper.colors")
            require("incline").setup({
                highlight = {
                    groups = {
                        InclineNormal = { guibg = colors.bg, guifg = colors.orange },
                        InclineNormalNC = { guifg = colors.fgInactive, guibg = colors.bgDarker },
                    },
                },
                window = { margin = { vertical = 0, horizontal = 1 } },
                hide = {
                    cursorline = true,
                },
                render = function(props)
                    local filename = vim.fn.fnamemodify(vim.api.nvim_buf_get_name(props.buf), ":t")
                    if vim.bo[props.buf].modified then
                        filename = "[+] " .. filename
                    end

                    local icon, color = require("nvim-web-devicons").get_icon_color(filename)
                    return { { icon, guifg = color }, { " " }, { filename } }
                end,
            })
        end,
    },

    -- logo
    {
        "folke/snacks.nvim",
        opts = {
            dashboard = {
                preset = {
                    pick = function(cmd, opts)
                        return LazyVim.pick(cmd, opts)()
                    end,
                    header = [[
███╗   ██╗███████╗ ██████╗ ██╗   ██╗██╗███╗   ███╗
████╗  ██║██╔════╝██╔═══██╗██║   ██║██║████╗ ████║
██╔██╗ ██║█████╗  ██║   ██║██║   ██║██║██╔████╔██║
██║╚██╗██║██╔══╝  ██║   ██║╚██╗ ██╔╝██║██║╚██╔╝██║
██║ ╚████║███████╗╚██████╔╝ ╚████╔╝ ██║██║ ╚═╝ ██║
╚═╝  ╚═══╝╚══════╝ ╚═════╝   ╚═══╝  ╚═╝╚═╝     ╚═╝
            ]],
                },
            },
        },
    },
}
