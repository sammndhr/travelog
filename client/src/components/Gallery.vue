<template>
	<v-col align-self="start" cols="12" md="6">
		<v-card outlined>
			<v-row>
				<v-col align="center">
					<Alert />
					<Button
						type="upload"
						text="Upload"
						@clicked="$refs.fileInput.click()"
					/>
					<input
						hidden
						ref="fileInput"
						id="upload-images"
						type="file"
						accept="image/*, image/heic"
						multiple="{true}"
						@change="handleChange"
					/>
				</v-col>
			</v-row>
			<v-row id="gallery" class="gallery">
				<v-col>
					<div class="gallery-mobile" v-if="isMobile">
						<img
							v-for="(image, i) in filteredImages"
							:key="image"
							class="gallery-image-mobile"
							:src="image"
							alt="gallery-img.jpeg"
							@click="onClick(i)"
						/>
					</div>
					<masonry
						v-else
						class="masonary"
						:cols="cols"
						:gutter="{ default: '5px' }"
					>
						<figure v-for="(image, i) in filteredImages" :key="image.name">
							<img
								:style="{ paddingBottom: gutter.default }"
								class="gallery-image"
								:src="image.url"
								alt="gallery-img.jpeg"
								@click="onClick(i)"
							/>
							<figcaption>
								{{ `${image.location.region}, ${image.location.country}` }}
							</figcaption>
						</figure>
					</masonry>
				</v-col>
			</v-row>
			<gallery :images="imagesArr" :index="index" @close="index = null" />
		</v-card>
	</v-col>
</template>

<script>
	import { mapActions, mapState } from 'vuex'
	import VueGallery from 'vue-gallery'
	import { supportsFileReader, handleImages } from '../utils/'
	import Alert from './Alert'
	import Button from './ui/Button'

	export default {
		props: {
			fadeUp: {
				type: Boolean,
				required: false,
				default: true
			}
		},

		computed: {
			...mapState('data', ['status', 'geoJson', 'filteredGeoJson']),
			imagesArr() {
				return this.filteredImages.map(feature => {
					return feature.url
				})
			},

			filteredImages() {
				const images = []
				console.log(this.filteredGeoJson)
				this.filteredGeoJson.forEach(feature => {
					const obj = {}
					obj.url = feature.properties.url
					obj.name = feature.properties.name
					obj.location = JSON.parse(feature.properties.location)
					images.push(obj)
				})
				return images
			}
		},

		data() {
			return {
				index: null,
				cols: { default: 4, 1600: 3, 700: 2 },
				items: [1, 2, 3, 4, 5],
				isMobile: false,
				gutter: { default: '5px' },
				showAlert: false
			}
		},

		components: {
			gallery: VueGallery,
			Alert,
			Button
		},

		updated() {
			console.log('updated', this.geoJson.features)
		},
		methods: {
			onClick(i) {
				this.index = i
			},
			...mapActions('data', ['upload', 'getGeojson']),
			async handleChange(e) {
				if (!supportsFileReader()) {
					console.log(
						'Sorry, your web browser does not support the FileReader API.'
					)
					return
				}
				const formData = new FormData(),
					files = e.target.files,
					images = await handleImages(files),
					allImageData = []

				for (const image of images) {
					const { key, exif, file } = image,
						extension = file.type.split('/').pop(),
						newName = `${key}.${extension}`

					allImageData.push({ key, exif, extension })
					formData.append('photos', file, newName)
				}

				formData.append('allImageData', JSON.stringify(allImageData))
				this.upload(formData)
			}
		},

		mounted() {
			console.log('mounted', this.geoJson.features)
			if (window.innerWidth <= 500) this.isMobile = true
			this.$root.$on('resized', ({ width, height }) => {
				this.isMobile = width <= 500 ? true : false
				this.isMobile = height > 750 || width > 500 ? false : true
				this.cols =
					width < 450 && height > 750
						? { default: 2 }
						: { default: 3, 1000: 2, 900: 1 }
			})
		}
	}
</script>

<style lang="scss" scoped>
	.gallery {
		overflow: scroll;
		margin: 8px;
		.gallery-mobile {
			display: flex;
			align-items: center;
		}

		.gallery-image-mobile,
		.gallery-image {
			background-size: cover;
			cursor: pointer;
		}

		.gallery-image-mobile {
			height: 185px;
			display: block;
		}
		.gallery-image {
			max-width: 400px;
			width: 100%;
			display: block;
		}
	}
</style>
