<template>
	<v-col align-self="start" cols="12" xl="6" md="5">
		<v-card
			class="gallery-wrapper"
			:class="$vuetify.breakpoint.xs ? 'mobile' : 'not-mobile'"
			outlined
		>
			<v-tabs background-color="primary accent-4" centered dark>
				<v-tab @click="handleClickGallery">
					Gallery
				</v-tab>
				<v-tab @click="handleClickEdit">
					Edit
				</v-tab>
			</v-tabs>

			<v-row>
				<v-col align="center">
					<template v-if="edit">
						<Button
							:disabled="images.length > 0 ? false : true"
							text="Select All"
							@clicked="handleClickSelectAll"
						/>
						<Button
							:disabled="selectionCount > 0 ? false : true"
							text="Delete"
							@clicked="handleClickDelete"
						/>

						<Button
							:disabled="selectionCount > 0 ? false : true"
							text="Cancel"
							@clicked="handleClickCancel"
						/>
					</template>

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
							:key="image.key"
							class="gallery-image-mobile"
							:src="image.url"
							alt="gallery-img.jpeg"
							@click="handleClickImage({ i, key: image.key })"
						/>
					</div>
					<masonry v-else class="masonary" :cols="cols" :gutter="gutter">
						<figure
							:style="{ marginBottom: gutter.default }"
							v-for="(image, i) in images"
							:key="image.key"
							:class="[{ selected: image.selected }, 'figure']"
						>
							<v-icon
								class="select-btn"
								v-show="edit"
								:color="image.selected ? 'primary' : 'grey'"
								>{{
									image.selected
										? 'mdi-check-circle'
										: 'mdi-checkbox-blank-circle-outline'
								}}</v-icon
							>
							<img
								class="gallery-image"
								:src="image.url"
								alt="gallery-img.jpeg"
								@click="handleClickImage({ i, key: image.key })"
							/>
						</figure>
					</masonry>
				</v-col>
			</v-row>
			<VueGallery
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
					obj.key = feature.properties.key
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
			VueGallery,
			Button
		},

		methods: {
			...mapActions('data', ['upload', 'delete']),

			toggleSelect({ i, key }) {
				const copied = JSON.parse(JSON.stringify(this.images)),
					selectedImage = copied[i]
				if (selectedImage.key === key) {
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
			},

			unselectAllItems() {
				for (const image of this.images) {
					image.selected = false
				}
				this.selectionCount = 0
			},

			selectAllItems() {
				for (const image of this.images) {
					image.selected = true
				}
				this.selectionCount = this.images.length
			},

			handleClickImage({ i, key }) {
				if (!this.edit) this.index = i
				else {
					this.toggleSelect({ i, key })
				}
			},
			handleClickSelectAll() {
				this.selectAllItems()
			},

			handleClickEdit() {
				this.edit = true
			},

			handleClickCancel() {
				this.unselectAllItems()
			},

			handleClickGallery() {
				this.unselectAllItems()
				this.edit = false
			},

			handleClickDelete() {
				const imagesToDelete = this.images.reduce((filtered, image) => {
					if (image.selected) filtered.push(image.key)
					return filtered
				}, [])
				this.selectionCount = 0
				this.delete({ imagesToDelete })
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
	.gallery-wrapper {
		overflow: hidden;
		&.not-mobile {
			height: 85vh;
		}

		.gallery {
			height: 100%;
			margin: 8px;
			overflow-y: scroll;

			.gallery-mobile {
				display: flex;
				overflow-y: scroll;
				align-items: center;
				img {
					padding-right: 8px;
					&:last-child {
						padding-right: 0;
					}
				}
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
			.figure {
				position: relative;
				.select-btn {
					top: 5px;
					right: 5px;
					position: absolute;
					border-radius: 50%;
				}
			}
			.selected {
				border: 5px solid #1976d2; /*primary*/
			}
		}
	}
</style>
