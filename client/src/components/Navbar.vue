<template>
	<v-card class="overflow-hidden">
		<v-app-bar
			:collapse="!collapseOnScroll"
			:collapse-on-scroll="collapseOnScroll"
			absolute
			color="deep-purple accent-4"
			dark
			scroll-target="#scrolling-techniques-6"
		>
			<v-app-bar-nav-icon></v-app-bar-nav-icon>
			<v-toolbar-title>Travelog</v-toolbar-title>
			<v-spacer></v-spacer>
			<router-link v-if="!status.loggedIn" to="/register"
				>Register!</router-link
			>
			<router-link v-if="!status.loggedIn" to="/login">Login!</router-link>
			<router-link to="/log">Get started</router-link>
			<router-link v-if="status.loggedIn" to="/login">Logout</router-link>
			<!-- <v-checkbox
				v-model="collapseOnScroll"
				color="white"
				hide-details
			></v-checkbox> -->
		</v-app-bar>
		<v-sheet
			id="scrolling-techniques-6"
			class="overflow-y-auto"
			max-height="100vh"
			min-height="100vh"
		>
			<slot />
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
		},
		data: () => ({
			collapseOnScroll: true
		})
	}
</script>
