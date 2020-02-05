<template>
	<v-app>
		<v-content>
			<router-link v-if="!status.loggedIn" to="/register"
				>Register!</router-link
			>
			<router-link v-if="!status.loggedIn" to="/login">Login!</router-link>
			<router-link to="/log">Get started</router-link>
			<router-link v-if="status.loggedIn" to="/login">Logout</router-link>
			<router-view></router-view>
		</v-content>
	</v-app>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		name: 'app',
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
		margin-top: 60px;
		max-width: 100vw;
	}
	a {
		display: block;
	}
</style>
