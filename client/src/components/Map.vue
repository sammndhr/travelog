<template>
	<v-col align-self="start" cols="12" md="6" id="travelog" class="travelog">
		<v-card outlined>
			<v-row>
				<v-col align="center">
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
									<img
										class="marker"
										:src="feature.properties.url"
										alt="marker"
									/>
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
					</div>
				</v-col>
			</v-row>
		</v-card>
	</v-col>
</template>

<script>
	/* eslint-disable */
	import config from '../../DO_NOT_COMMIT.env.vars.js'
	import Mapbox from 'mapbox-gl/dist/mapbox-gl.js'
	import { MglMap, MglPopup, MglGeojsonLayer, MglMarker } from 'vue-mapbox'
	import { mapActions, mapState } from 'vuex'

	export default {
		components: {
			MglMap,
			MglMarker,
			MglGeojsonLayer,
			MglPopup
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
				return Object.values(images)
			}
		},
		methods: {
			...mapActions('data', ['getFilteredImages']),
			createImage(width) {
				const bytesPerPixel = 4,
					data = new Uint8Array(width * width * bytesPerPixel)

				for (let x = 0; x < width; x++) {
					for (let y = 0; y < width; y++) {
						const offset = (y * width + x) * bytesPerPixel
						data[offset + 0] = 255
						data[offset + 1] = 255
						data[offset + 2] = 255
						data[offset + 3] = 0
					}
				}
				return data
			},

			filterImages(map) {
				const features = map.queryRenderedFeatures({ layers: ['images'] }),
					filteredImages = {}
				if (features) {
					for (const feature of features) {
						filteredImages[feature.properties.name] = feature.properties.url
					}
					return Object.values(filteredImages)
				}
			},

			onMapLoaded(event) {
				const map = event.map,
					width = 1,
					data = this.createImage(width),
					vm = this

				map.addImage('transparentPixel', {
					width: width,
					height: width,
					data: data
				})

				map.addSource('image', {
					type: 'geojson',
					data: this.geoJson
				})

				map.on('render', function() {
					const filteredImages = vm.filterImages(map)
					vm.getFilteredImages(filteredImages)
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

	.travel-wrapper {
		.maps {
			min-width: 20rem;
			min-height: 20rem;
		}
	}
</style>
