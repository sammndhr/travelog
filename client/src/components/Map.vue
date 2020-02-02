<template>
	<div id="travelog" class="travelog" ref="travelog">
		<h1>Travelog</h1>
		<div class="travel-wrapper">
			<MglMap
				id="map"
				class="maps"
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
			<Gallery :filteredImages="images" />
		</div>
	</div>
</template>

<script>
	/* eslint-disable */
	import config from '../../DO_NOT_COMMIT.env.vars.js'
	import Mapbox from 'mapbox-gl/dist/mapbox-gl.js'
	import { MglMap, MglPopup, MglMarker } from 'vue-mapbox'
	import { mapActions, mapState } from 'vuex'
	import Gallery from './Gallery'

	export default {
		components: {
			MglMap,
			MglMarker,
			MglPopup,
			Gallery
		},
		data() {
			return {
				accessToken: null,
				mapStyle: 'mapbox://styles/mapbox/streets-v11',

				anchor: 'bottom'
			}
		},
		computed: {
			...mapState('data', ['geoJson']),
			images() {
				const images = {}
				for (const feature of this.geoJson.features) {
					images[feature.properties.name] = feature.properties.url
				}
				return images
			}
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

		created() {
			this.accessToken = config.mapbox.token
			this.mapbox = Mapbox
		}
	}
</script>

<style lang="scss" scoped>
	.mapboxgl-popup {
		max-width: 200px;
	}
	.marker {
		width: 50px;
		height: 50px;
		border-radius: 5px;
		cursor: pointer;
	}
	.travelog {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 5rem 0;
		h2 {
			margin-top: 0;
			margin-bottom: 7rem;
		}
	}
	.travel-wrapper {
		overflow: hidden;
		padding-bottom: 2rem;
		justify-content: space-between;
		display: flex;
		width: calc(100vw - 1rem);
		max-width: 1500px;
		flex-direction: column;
		min-height: 570px;
		height: 85vh;
		position: relative;
		.maps {
			flex-basis: 85%;
			min-height: 20rem;
			height: 100%;
			margin-bottom: 1rem;
		}
	}

	@include small-breakpoint {
		.travel-wrapper {
			justify-content: space-around;
			flex-direction: row;
			width: calc(100vw - #{$padding-small});
			.maps {
				flex-basis: 65%;
			}
		}
	}
	@include medium-breakpoint {
		.travel-wrapper {
			width: calc(100vw - #{$padding-medium});
		}
	}
	@include large-breakpoint {
		.travel-wrapper {
			width: calc(100vw - #{$padding-large});
			.maps {
				flex-basis: 55%;
			}
		}
	}
</style>
