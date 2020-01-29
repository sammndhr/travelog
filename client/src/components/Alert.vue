<template>
	<div class="container">
		<div class="col-sm-6 offset-sm-3">
			<div v-if="alert.message" :class="`alert ${alert.type}`">
				{{ alert.message }}
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'app',
		computed: {
			...mapState({
				alert: state => state.alert
			})
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
