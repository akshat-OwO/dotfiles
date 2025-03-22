return {
	"folke/snacks.nvim",
	priority = 1000,
	lazy = false,
	opts = {
		notifier = {
			enabled = true,
			timeout = 3000,
			filter = function(notif)
				if notif.msg and notif.msg:find("No information available") then
					return false
				end
				return true
			end,
		},
		lazygit = {
			enabled = true,
		},
	},
}
