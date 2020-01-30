<template>
	<div>
		<h1>Map</h1>
		<MglMap
			id="map"
			:accessToken="accessToken"
			:mapStyle="mapStyle"
			@load="onMapLoaded"
		>
			<MglMarker
				v-for="feature in geoJson.features"
				:anchor="'top'"
				:key="feature.properties.name"
				:coordinates="feature.geometry.coordinates"
			>
				<div slot="marker" class="marker">
					<img class="marker" :src="feature.properties.url" alt="marker" />
				</div>
				<MglPopup :anchor="anchor">
					<div>
						<p>{{ feature.properties.dateCreated }}</p>
						<p>{{ feature.properties.location }}</p>
					</div>
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
	import { mapActions, mapState } from 'vuex'

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

				// coordinates: [-111.549668, 39.014],
				images: [],
				// image: './images/0jkpk5xa4o70.jpeg',
				anchor: 'bottom'
			}
		},
		computed: {
			...mapState('data', ['geoJson'])
		},
		methods: {
			onMapLoaded(event) {
				this.map = event.map
				// 				map.addLayer({
				// 'id': 'points',
				// or just to store if you want have access from other components
				// this.$store.map = event.map
			}
		},

		mounted() {
			console.log(this.geoJson)
		},
		updated() {
			console.log(this.geoJson)
		},

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
