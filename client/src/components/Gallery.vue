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
						<img
							v-for="(image, i) in filteredImages"
							:style="{ paddingBottom: gutter.default }"
							:key="image"
							class="gallery-image"
							:src="image"
							alt="gallery-img.jpeg"
							@click="onClick(i)"
						/>
					</masonry>
				</v-col>
			</v-row>
			<gallery :images="filteredImages" :index="index" @close="index = null" />
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
			filteredImages: {
				type: Array,
				required: false,
				default: () => []
			},
			fadeUp: {
				type: Boolean,
				required: false,
				default: true
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

		computed: {
			...mapState('data', ['status'])
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
