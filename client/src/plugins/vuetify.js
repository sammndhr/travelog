import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
	icons: {
		iconfont: 'mdi'
	},
	theme: {
		themes: {
			light: {
				// Same as ~/assets/styles/_variables.scss
				primary: '#3fbb83', // green --> rgb(63, 187, 131)
				// secondary: '#1E1E1E', // gray --> rgb(30,30,30)
				secondary: '#0E1813', // gray --> rgb(14,24,19)
				accent: '#f6d55c', // yellow --> rgb(246, 213, 92)
				error: '#ff6666', // red --> rgb(255, 102, 102),
				white: '#ffffff'
			}
		}
	}
})
