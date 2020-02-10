<template>
	<v-col align-self="start" cols="12" xl="6" md="5">
		<v-card outlined>
			<v-row>
				<v-col align="center">
					<Alert />

					<Button v-if="!edit" text="Edit" @clicked="handleClickEdit" />
					<Button v-if="edit" text="Cancel" @clicked="handleClickCancel" />
					<Button v-if="edit" text="Delete" @clicked="handleClickDelete" />
					<!-- 
					<v-icon color="primary">mdi-close-circle-outline</v-icon>
				-->
					<Button
						v-if="!edit"
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
							v-for="(image, i) in images"
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
						<figure
							v-for="(image, i) in images"
							:key="image.name"
							:class="{ selected: image.selected }"
						>
							<v-icon v-show="edit" :color="image.selected ? 'primary' : 'grey'"
								>mdi-check-circle-outline</v-icon
							>
							<img
								:style="{ paddingBottom: gutter.default }"
								class="gallery-image"
								:src="image.url"
								alt="gallery-img.jpeg"
								@click="onClick({ i, name: image.name })"
							/>
							<figcaption>
								{{ `${image.location.region}, ${image.location.country}` }}
							</figcaption>
						</figure>
					</masonry>
				</v-col>
			</v-row>
			<gallery
				v-if="!edit"
				:images="imagesArr"
				:index="index"
				@close="index = null"
			/>
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
		name: 'Travelog-Gallery',
		props: {
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
				showAlert: false,
				edit: false,
				images: [],
				selectionCount: 0
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
				this.filteredGeoJson.forEach(feature => {
					const obj = {}
					obj.url = feature.properties.url
					obj.name = feature.properties.name
					obj.location = feature.properties.location
					obj.selected = false
					images.push(obj)
				})
				return images
			}
		},

		watch: {
			filteredImages(newImages) {
				this.images = newImages
			}
		},

		components: {
			gallery: VueGallery,
			Alert,
			Button
		},

		methods: {
			...mapActions('data', ['upload', 'delete']),

			onClick({ i, name }) {
				if (!this.edit) this.index = i
				else {
					const copied = JSON.parse(JSON.stringify(this.images)),
						selectedImage = copied[i]
					if (selectedImage.name === name) {
						selectedImage.selected = !selectedImage.selected
						if (selectedImage.selected) {
							this.selectionCount++
						} else {
							{
								this.selectionCount--
							}
						}
						this.images = copied
					}
				}
			},

			handleClickEdit() {
				this.edit = true
			},

			handleClickCancel() {
				for (const image of this.images) {
					image.selected = false
				}
				this.edit = false
			},

			handleClickDelete() {
				const imagesToDelete = this.images.filter(image => {
					return image.selected
				})
				console.log('click delete', imagesToDelete)
				this.delete(imagesToDelete)
			},

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
		.selected {
			border: 5px solid #1976d2; /*primary*/
		}
	}
</style>
