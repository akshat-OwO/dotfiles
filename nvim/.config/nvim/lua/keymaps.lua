local keymap = vim.keymap

-- Clear highlights on search when pressing <Esc> in normal mode
vim.keymap.set("n", "<Esc>", "<cmd>nohlsearch<CR>")

-- Diagnostic keymaps
vim.keymap.set("n", "<leader>q", vim.diagnostic.setloclist, { desc = "Open diagnostic [Q]uickfix list" })

vim.keymap.set("v", "J", ":m '>+1<CR>gv=gv", { desc = "Shift Up one level" })
vim.keymap.set("v", "K", ":m '<-2<CR>gv=gv", { desc = "Shift Down one level" })

vim.keymap.set("n", "<C-d>", "<C-d>zz", { desc = "Down half page while centering" })
vim.keymap.set("n", "<C-u>", "<C-u>zz", { desc = "Up half page while centering" })
vim.keymap.set("n", "n", "nzzzv", { desc = "Next search item centered" })
vim.keymap.set("n", "N", "Nzzzv", { desc = "Prev search item centered" })

vim.keymap.set("x", "<leader>p", [["_dP]])

vim.keymap.set({"n", "v"}, "<leader>y", [["+y]])
vim.keymap.set("n", "<leader>Y", [["+Y]])

vim.keymap.set({"n", "v"}, "<leader>d", "\"_d")

-- Window navigation
keymap.set("n", "<C-h>", "<C-w><C-h>", { desc = "Move focus to the left window" })
keymap.set("n", "<C-l>", "<C-w><C-l>", { desc = "Move focus to the right window" })
keymap.set("n", "<C-j>", "<C-w><C-j>", { desc = "Move focus to the lower window" })
keymap.set("n", "<C-k>", "<C-w><C-k>", { desc = "Move focus to the upper window" })

-- Window splits
keymap.set("n", "<leader>wv", "<CMD>vsplit<CR>", { desc = "[W]indow [V]ertical Split" })
keymap.set("n", "<leader>wh", "<CMD>split<CR>", { desc = "[W]indow [H]orizontal Split" })

-- Quit
keymap.set("n", "<leader>qq", "<CMD>qa<CR>", { desc = "[Q]uit" })
