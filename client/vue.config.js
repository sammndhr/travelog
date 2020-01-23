module.exports = {
	devServer: {
		proxy: 'http://localhost:3000'
	},
	css: {
		loaderOptions: {
			sass: {
				prependData: `@import "@/assets/styles/_variables.scss";`
			}
		}
	}
}
