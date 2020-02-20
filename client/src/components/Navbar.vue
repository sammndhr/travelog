<template>
	<v-card class="overflow-hidden">
		<v-app-bar
			absolute
			color="white"
			elevate-on-scroll
			scroll-target="#scrolling-techniques-7"
		>
			<v-btn to="/" text color="primary">
				<v-toolbar-title>Travelog</v-toolbar-title>
			</v-btn>

			<v-spacer></v-spacer>

			<v-btn v-if="!status.loggedIn" to="/register" text color="primary">
				Register
			</v-btn>
			<v-btn v-if="!status.loggedIn" to="/login" text color="primary">
				Login
			</v-btn>
			<v-btn to="/log" text color="primary">
				Log
			</v-btn>
			<v-btn v-if="status.loggedIn" to="/" text color="primary">
				Logout
			</v-btn>
		</v-app-bar>
		<v-sheet
			id="scrolling-techniques-7"
			class="overflow-y-auto"
			min-height="100vh"
			max-height="100vh"
		>
			<v-container style="min-height: 100vh;" class="fill-height" fluid>
				<slot />
			</v-container>
		</v-sheet>
	</v-card>
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

<style scoped>
	.fill-height {
		padding: 0;
	}
</style>
