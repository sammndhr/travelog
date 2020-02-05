<template>
	<v-app>
		<Navbar>
			<v-content>
				<router-view></router-view>
			</v-content>
		</Navbar>
	</v-app>
</template>

<script>
	import { mapState } from 'vuex'
	import Navbar from './components/Navbar'
	export default {
		name: 'app',
		components: {
			Navbar
		},
		computed: {
			...mapState('account', ['status'])
		}
	}
</script>

<style lang="scss">
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		max-width: 100vw;
	}
	a {
		display: block;
	}
</style>
