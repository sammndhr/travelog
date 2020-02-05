module.exports = {
	devServer: {
		proxy: 'http://localhost:3000'
	},
	css: {
		loaderOptions: {
			scss: {
				prependData: '@import "@/assets/styles/_variables.scss";'
			}
		}
	},
	transpileDependencies: ['vuetify']
}
