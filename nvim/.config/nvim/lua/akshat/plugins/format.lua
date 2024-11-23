return {
    {
        "sbdchd/neoformat",
        config = function()
            vim.g.neoformat_basic_format_align = 1
            vim.g.neoformat_basic_format_retab = 1
            vim.g.neoformat_basic_format_trim = 1

            vim.g.neoformat_try_node_exe = 1

            vim.g.neoformat_enabled_javascript = { 'prettier' }
            vim.g.neoformat_enabled_typescript = { 'prettier' }
            vim.g.neoformat_enabled_javascriptreact = { 'prettier' }
            vim.g.neoformat_enabled_typescriptreact = { 'prettier' }
            vim.g.neoformat_enabled_python = { 'black', 'isort' }
            vim.g.neoformat_enabled_lua = { 'stylua' }
            vim.g.neoformat_enabled_go = { 'gofmt' }
            vim.g.neoformat_enabled_css = { 'prettier' }
            vim.g.neoformat_enabled_scss = { 'prettier' }
            vim.g.neoformat_enabled_html = { 'prettier' }
            vim.g.neoformat_enabled_json = { 'prettier' }
            vim.g.neoformat_enabled_yaml = { 'prettier' }
            vim.g.neoformat_enabled_markdown = { 'prettier' }

            -- Prettier configuration
            vim.g.neoformat_javascript_prettier = {
                exe = 'prettier',
                args = {
                    '--stdin-filepath',
                    '"%:p"',
                    '--tab-width',
                    '4',
                    '--print-width',
                    '120',
                    '--use-tabs',
                    'false'
                },
                stdin = 1,
            }

            -- Use the same prettier config for other filetypes
            vim.g.neoformat_typescript_prettier = vim.g.neoformat_javascript_prettier
            vim.g.neoformat_javascriptreact_prettier = vim.g.neoformat_javascript_prettier
            vim.g.neoformat_typescriptreact_prettier = vim.g.neoformat_javascript_prettier
            vim.g.neoformat_css_prettier = vim.g.neoformat_javascript_prettier
            vim.g.neoformat_html_prettier = vim.g.neoformat_javascript_prettier
            vim.g.neoformat_json_prettier = vim.g.neoformat_javascript_prettier
            vim.g.neoformat_yaml_prettier = vim.g.neoformat_javascript_prettier
            vim.g.neoformat_markdown_prettier = vim.g.neoformat_javascript_prettier

            -- Python configuration
            vim.g.neoformat_python_black = {
                exe = 'black',
                args = { '--quiet', '-' },
                stdin = 1,
            }

            -- Format on save (optional)
            -- vim.api.nvim_create_autocmd("BufWritePre", {
            --     pattern = "*",
            --     callback = function()
            --         vim.cmd("Neoformat")
            --     end,
            -- })

            -- Keymapping for manual formatting
            vim.keymap.set("n", "<leader>f", ":Neoformat<CR>", { desc = "[F]ormat buffer", silent = true })
        end,
    },
}
