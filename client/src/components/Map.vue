<template>
	<div>
		<h1>Map</h1>
		<MglMap
			id="map"
			:accessToken="accessToken"
			:mapStyle="mapStyle"
			@load="onMapLoaded"
		>
			<MglMarker :anchor="'top'" :coordinates="coordinates">
				<div slot="marker" class="marker">
					<img class="marker" :src="image" alt="marker" />
				</div>
				<MglPopup :anchor="anchor">
					<div>Hello, I'm popup!</div>
				</MglPopup>
			</MglMarker>
		</MglMap>
	</div>
</template>

<script>
	/* eslint-disable */
	import config from '../../DO_NOT_COMMIT.env.vars.js'
	import Mapbox from 'mapbox-gl/dist/mapbox-gl.js'

	import { MglMap, MglPopup, MglMarker } from 'vue-mapbox'

	export default {
		components: {
			MglMap,
			MglMarker,
			MglPopup
		},
		data() {
			return {
				accessToken: null,
				mapStyle: 'mapbox://styles/mapbox/streets-v11',
				coordinates: [-111.549668, 39.014],
				image: './images/0jkpk5xa4o70.jpeg',
				anchor: 'bottom'
			}
		},
		methods: {
			onMapLoaded(event) {
				this.map = event.map

				// or just to store if you want have access from other components
				// this.$store.map = event.map
			}
		},
		mounted() {},

		created() {
			this.accessToken = config.mapbox.token
			this.mapbox = Mapbox
		}
	}
</script>

<style>
	#map {
		height: 400px;
	}

	.mapboxgl-popup {
		max-width: 200px;
	}
	.marker {
		width: 50px;
		height: 50px;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
