return {
  {
    "EdenEast/nightfox.nvim",
    config = function()
      require("nightfox").setup({})
      vim.cmd("colorscheme carbonfox")
    end,
  },
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "carbonfox",
    },
  },
}
