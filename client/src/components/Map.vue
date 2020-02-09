<template>
	<v-col
		align-self="start"
		cols="12"
		md="7"
		xl="6"
		id="travelog"
		class="travelog"
	>
		<v-card outlined>
			<v-row>
				<v-col align="center">
					<div class="travel-wrapper">
						<MglMap
							id="map"
							:zoom="zoom"
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
										<p>
											{{
												`${feature.properties.location.region}, ${feature.properties.location.country}`
											}}
										</p>
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
	import { mapActions, mapState } from 'vuex'
	import { MglMap, MglPopup, MglGeojsonLayer, MglMarker } from 'vue-mapbox'
	import config from '../../DO_NOT_COMMIT.env.vars.js'
	import Mapbox from 'mapbox-gl/dist/mapbox-gl.js'
	import { filter } from '../utils'

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
				// map: null, //will break. Don't uncomment
				zoom: 1,
				geoJsonlayer: {
					id: 'images',
					type: 'symbol',
					source: 'image',
					replaceSource: true,
					layout: {
						'icon-image': 'transparentPixel',
						'icon-size': 0.01
					}
				}
			}
		},

		computed: {
			...mapState('data', ['geoJson'])
		},

		watch: {
			geoJson() {
				if (!this.map) return
				this.filter()
			}
		},

		methods: {
			...mapActions('data', ['getFilteredGeoJson']),

			filter() {
				const geoJson = this.geoJson,
					// works fine without map being set in data
					bounds = this.map.getBounds()
				const filteredGeoJson = filter({ bounds, geoJson })
				this.getFilteredGeoJson(filteredGeoJson)
			},

			createImage(width) {
				const bytesPerPixel = 4,
					data = new Uint8Array(width * width * bytesPerPixel)

				for (let x = 0; x < width; x++) {
					for (let y = 0; y < width; y++) {
						const offset = (y * width + x) * bytesPerPixel
						data[offset + 0] = 0
						data[offset + 1] = 0
						data[offset + 2] = 0
						data[offset + 3] = 255
					}
				}
				return data
			},

			onMapLoaded(event) {
				const map = event.map,
					width = 0.5,
					data = this.createImage(width),
					vm = this
				this.map = map
				map.addImage('transparentPixel', {
					width: width,
					height: width,
					data: data
				})
				map.addSource('image', {
					type: 'geojson',
					data: this.geoJson
				})

				this.filter()

				map.on('moveend', function() {
					vm.filter()
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
	/* .mapboxgl-popup {
		max-width: 200px;
	} */
	.marker {
		width: 50px;
		height: 50px;
		border-radius: 5px;
		cursor: pointer;
	}

	.travel-wrapper {
		.maps {
			min-width: 20rem;
			min-height: 60vh;
		}
	}
</style>
