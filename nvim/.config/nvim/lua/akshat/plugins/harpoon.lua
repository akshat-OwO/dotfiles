return {
	{
		"ThePrimeagen/harpoon",
		branch = "harpoon2",
		dependencies = { "nvim-lua/plenary.nvim", "nvim-telescope/telescope-fzf-native.nvim" },
		config = function()
			local harpoon = require("harpoon")
			harpoon.setup({})

			local conf = require("telescope.config").values
			local function toggle_telescope(harpoon_files)
				local file_paths = {}
				for _, item in ipairs(harpoon_files.items) do
					table.insert(file_paths, item.value)
				end

				require("telescope.pickers")
					.new({}, {
						prompt_title = "Harpoon",
						finder = require("telescope.finders").new_table({
							results = file_paths,
						}),
						previewer = conf.file_previewer({}),
						sorter = conf.generic_sorter({}),
					})
					:find()
			end

			vim.keymap.set("n", "<leader>a", function()
				harpoon:list():add()
			end, { desc = "Add file to harpoon" })
			vim.keymap.set("n", "<leader>hc", function()
				harpoon:list():clear()
			end, { desc = "Clear files from harpoon" })
			vim.keymap.set("n", "<leader><S-h>", function()
				toggle_telescope(harpoon:list())
			end, { desc = "Open harpoon window" })
			vim.keymap.set("n", "<leader>hh", function()
				harpoon:list():select(1)
			end, { desc = "Switch to first harpoon file" })
			vim.keymap.set("n", "<leader>hj", function()
				harpoon:list():select(2)
			end, { desc = "Switch to second harpoon file" })
			vim.keymap.set("n", "<leader>hk", function()
				harpoon:list():select(3)
			end, { desc = "Switch to third harpoon file" })
			vim.keymap.set("n", "<leader>hl", function()
				harpoon:list():select(4)
			end, { desc = "Switch to fourth harpoon file" })
		end,
	},
}
