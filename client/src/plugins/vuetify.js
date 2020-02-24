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
				secondary: '#3682ed', // blue --> rgb(54, 130, 237)
				accent: '#f6d55c', // yellow --> rgb(246, 213, 92)
				error: '#ff6666' // red --> rgb(255, 102, 102)
			}
		}
	}
})
