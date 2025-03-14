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
                        args = {
                            "--stdin-filepath",
                            "$FILENAME",
                            "--tab-width",
                            "4",
                            "--print-width",
                            "120",
                            "--use-tabs",
                            "false",
                            "--trailing-comma",
                            "all",
                            "--semi",
                            "true",
                        },
                        stdin = true,
                        cwd = function()
                            return vim.fs.dirname(vim.fs.find({ ".prettierrc", ".prettierrc.json", ".prettierrc.js" }, { upward = true })[1])
                        end,
                    },
                },
                format_on_save = {
                    lsp_fallback = true,
                    async = false,
                    timeout_ms = 500,
                },
            })

            -- Keymapping for manual formatting
            vim.keymap.set({ "n", "v" }, "<leader>f", function()
                conform.format({
                    lsp_fallback = true,
                    async = false,
                    timeout_ms = 500,
                })
            end, { desc = "[F]ormat file or range (in visual mode)", silent = true })
        end,
    },
}
