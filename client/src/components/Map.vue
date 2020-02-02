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
				<MglGeojsonLayer
					:sourceId="sourceId"
					layerId="images"
					:layer="geoJsonlayer"
				/>
			</MglMap>
			<Gallery :filteredImages="images" />
		</div>
	</div>
</template>

<script>
	/* eslint-disable */
	import config from '../../DO_NOT_COMMIT.env.vars.js'
	import Mapbox from 'mapbox-gl/dist/mapbox-gl.js'
	import { MglMap, MglPopup, MglGeojsonLayer, MglMarker } from 'vue-mapbox'
	import { mapActions, mapState } from 'vuex'
	import Gallery from './Gallery'

	export default {
		components: {
			MglMap,
			MglMarker,
			MglGeojsonLayer,
			MglPopup,
			Gallery
		},
		data() {
			return {
				accessToken: null,
				mapStyle: 'mapbox://styles/mapbox/streets-v11',
				sourceId: 'image',
				anchor: 'bottom',
				geoJsonlayer: {
					id: 'images',
					type: 'symbol',
					source: 'image',
					layout: {
						'icon-image': 'transparentPixel',
						'icon-size': 0.25
					}
				}
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
			},
			filteredImages() {
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

				const map = event.map
				var width = 1
				var bytesPerPixel = 4
				var data = new Uint8Array(width * width * bytesPerPixel)

				for (var x = 0; x < width; x++) {
					for (var y = 0; y < width; y++) {
						var offset = (y * width + x) * bytesPerPixel
						data[offset + 0] = 255
						data[offset + 1] = 255
						data[offset + 2] = 255
						data[offset + 3] = 0
					}
				}

				map.addImage('transparentPixel', {
					width: width,
					height: width,
					data: data
				})

				map.addSource('image', {
					type: 'geojson',
					data: this.geoJson
				})
				map.on('moveend', function() {
					var features = map.queryRenderedFeatures({ layers: ['images'] })

					if (features) {
						console.log(features)
					}
				})
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
