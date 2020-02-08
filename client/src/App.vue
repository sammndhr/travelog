<template>
	<v-app>
		<Navbar>
			<v-content class="main-content">
				<router-view></router-view>
			</v-content>
		</Navbar>
	</v-app>
</template>

<script>
	/* eslint-disable */
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
	.main-content {
		margin-top: 64px;
	}
</style>
