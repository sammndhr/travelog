<template>
	<div class="log" :class="$vuetify.breakpoint.xs ? 'mobile' : ''">
		<v-row align="center" justify="center">
			<Alert />
		</v-row>
		<Loader v-show="status.uploading" />
		<v-row align="center" justify="center">
			<Map />
			<Gallery />
		</v-row>
	</div>
</template>

<script>
	import { mapActions, mapState } from 'vuex'
	import Gallery from './Gallery'

	import Map from './Map'
	import Loader from './Loader'
	import Alert from './Alert'

	export default {
		name: 'Log',
		components: { Loader, Alert, Map, Gallery },
		computed: {
			...mapState('data', ['status'])
		},
		methods: {
			...mapActions('data', ['upload', 'getGeojson'])
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.getGeojson()
			})
		}
	}
</script>

<style scoped lang="scss">
	.log {
		overflow: hidden;
		margin: 2rem;
		&.mobile {
			margin: 0.5rem;
		}
	}
</style>
