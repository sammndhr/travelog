<template>
	<div id="app">
		<router-view></router-view>
		<router-link v-if="!status.loggedIn" to="/register">Register!</router-link>
		<router-link v-if="!status.loggedIn" to="/login">Login!</router-link>
		<router-link to="/upload">Upload</router-link>
		<router-link v-if="status.loggedIn" to="/login">Logout</router-link>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		name: 'app',
		components: {},

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
