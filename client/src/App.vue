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
	import { mapActions } from 'vuex'
	import Navbar from '@/components/Navbar'

	export default {
		name: 'app',
		components: {
			Navbar
		},

		methods: {
			...mapActions({
				clearAlert: 'alert/clear'
			})
		},
		watch: {
			$route() {
				this.clearAlert()
			}
		}
	}
</script>

<style lang="scss">
	.gallery-wrapper {
		.v-window,
		.v-window__container {
			height: 100% !important;
		}
	}

	.main-content {
		margin-top: 64px;
	}
</style>
