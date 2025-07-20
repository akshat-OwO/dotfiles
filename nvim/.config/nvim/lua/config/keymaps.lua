-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here

-- Quick navigation
vim.keymap.set("n", "<leader>cn", ":cnext<cr>zz", { desc = "Go to next quickfix item and center" })
vim.keymap.set("n", "<leader>cp", ":cprevious<cr>zz", { desc = "Go to previous quickfix item and center" })
vim.keymap.set("n", "<leader>co", ":copen<cr>zz", { desc = "Open quickfix list and center" })
vim.keymap.set("n", "<leader>cc", ":cclose<cr>zz", { desc = "Close quickfix list" })

vim.keymap.set("n", "<C-d>", "<C-d>zz", { desc = "Down half page while centering" })
vim.keymap.set("n", "<C-u>", "<C-u>zz", { desc = "Up half page while centering" })
vim.keymap.set("n", "n", "nzzzv", { desc = "Next search item centered" })
vim.keymap.set("n", "N", "Nzzzv", { desc = "Prev search item centered" })

-- Escape registers
vim.keymap.set("x", "<leader>p", [["_dP]])

vim.keymap.set({ "n", "v" }, "<leader>y", [["+y]])
vim.keymap.set("n", "<leader>Y", [["+Y]])

vim.keymap.set({ "n", "v" }, "<leader>d", '"_d')
