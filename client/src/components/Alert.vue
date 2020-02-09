<template>
	<div>
		<v-alert
			v-if="alert.type === 'success' && showSuccess"
			outlined
			type="success"
			text
		>
			{{ alert.message }}
		</v-alert>
		<v-alert v-else-if="alert.type === 'error'" outlined type="error" text>
			{{ alert.message }}
		</v-alert>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'Alert',
		props: {
			showSuccess: {
				type: Boolean,
				required: false,
				default: false
			}
		},
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
