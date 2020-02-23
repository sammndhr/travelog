<template>
	<v-col align-self="start" cols="12" xl="6" md="5">
		<v-sheet
			class="gallery-wrapper"
			:class="$vuetify.breakpoint.xs ? 'mobile' : 'not-mobile'"
			elevation="3"
		>
			<v-tabs
				:height="$vuetify.breakpoint.xs ? '30px' : ''"
				class="order-0"
				style="flex-grow: 0;"
				background-color="transparent"
				color="primary"
				centered
			>
				<v-tab @click="handleClickGallery">
					Gallery
				</v-tab>
				<v-tab @click="handleClickEdit">
					Edit
				</v-tab>
			</v-tabs>

			<v-row
				:class="{ 'order-3': $vuetify.breakpoint.xs }"
				style="flex-grow: 0;"
			>
				<v-col align="center">
					<template v-if="edit">
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
				</v-col>
			</v-row>

			<v-row
				id="gallery"
				:class="{ 'order-2': $vuetify.breakpoint.xs }"
				class="gallery"
			>
				<v-col
					class="overflow"
					:class="{ 'overflow-mobile': $vuetify.breakpoint.xs }"
				>
					<div class="gallery-mobile" v-if="$vuetify.breakpoint.xs">
						<div
							v-for="(image, i) in images"
							:key="image.key"
							class="figure-wrapper"
						>
							<figure :class="[{ selected: image.selected }, 'figure']">
								<v-icon
									class="select-btn-background"
									v-show="edit && image.selected"
									color="white"
								>
									mdi-checkbox-blank-circle
								</v-icon>
								<v-icon
									class="select-btn"
									v-show="edit"
									:color="image.selected ? 'primary' : 'grey lighten-3'"
								>
									mdi-checkbox-marked-circle
								</v-icon>
								<img
									class="gallery-image-mobile"
									:src="image.url"
									alt="gallery-img.jpeg"
									@click="handleClickImage({ i, key: image.key })"
								/>
							</figure>
						</div>
					</div>
					<template v-else>
						<v-card class="pa-2" outlined tile>
							<masonry class="masonary" :cols="cols" :gutter="gutter">
								<div
									v-for="(image, i) in images"
									:key="image.key"
									class="figure-wrapper"
								>
									<figure :class="[{ selected: image.selected }, 'figure']">
										<v-icon
											class="select-btn-background"
											v-show="edit && image.selected"
											color="white"
										>
											mdi-checkbox-blank-circle
										</v-icon>
										<v-icon
											class="select-btn"
											v-show="edit"
											:color="image.selected ? 'primary' : 'grey lighten-3'"
										>
											mdi-checkbox-marked-circle
										</v-icon>
										<img
											class="gallery-image"
											:src="image.url"
											alt="gallery-img.jpeg"
											@click="handleClickImage({ i, key: image.key })"
										/>
									</figure>
								</div>
							</masonry>
						</v-card>
						<v-card class="pa-2" outlined tile>
							<h3 class="subtitle-1 font-weight-bold">
								Images with no location
							</h3>
							<masonry class="masonary" :cols="cols" :gutter="gutter">
								<div
									v-for="(image, i) in noLocationImages"
									:key="image.key"
									class="figure-wrapper"
								>
									<figure :class="[{ selected: image.selected }, 'figure']">
										<v-icon
											class="select-btn-background"
											v-show="edit && image.selected"
											color="white"
										>
											mdi-checkbox-blank-circle
										</v-icon>
										<v-icon
											class="select-btn"
											v-show="edit"
											:color="image.selected ? 'primary' : 'grey lighten-3'"
										>
											mdi-checkbox-marked-circle
										</v-icon>
										<img
											class="gallery-image"
											:src="image.url"
											alt="gallery-img.jpeg"
											@click="handleClickImage({ i, key: image.key })"
										/>
									</figure>
								</div>
							</masonry>
						</v-card>
					</template>
				</v-col>
			</v-row>

			<VueGallery
				v-if="!edit"
				:images="imagesUrls"
				:index="index"
				@close="index = null"
			/>
		</v-sheet>
	</v-col>
</template>

<script>
	import { mapActions, mapState, mapGetters } from 'vuex'
	import VueGallery from 'vue-gallery'
	import { supportsFileReader, handleImages, geoJsonToImages } from '@/utils/'

	import Button from '@/components/UI/Button'

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
				cols: { default: 4, 1600: 3, 1300: 2 },
				gutter: { default: '8px' },
				showAlert: false,
				edit: false,
				images: [],
				imagesUrls: [],
				selectionCount: 0
			}
		},

		computed: {
			...mapState('data', [
				'status',
				'geoJson',
				'filteredGeoJson',
				'uploadStatuses'
			]),

			...mapGetters('data', ['noLocationGeoJson']),

			noLocationImages() {
				const { images } = geoJsonToImages(this.noLocationGeoJson)

				return images
			}
		},

		watch: {
			filteredGeoJson(newGeoJson) {
				const { images, urls } = geoJsonToImages(newGeoJson)
				this.imagesUrls = urls
				this.images = images
			}
		},

		components: {
			VueGallery,
			Button
		},

		methods: {
			...mapActions('data', ['uploadAll', 'delete', 'getGeojson']),

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
				const files = e.target.files,
					images = await handleImages(files)

				this.uploadAll(images)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.gallery-wrapper {
		display: flex;
		flex-direction: column;

		&.mobile {
			height: 38vh;
		}

		&.not-mobile {
			height: 85vh;
		}

		.gallery {
			margin: 8px;
			overflow: hidden;
			flex-grow: 1;
			position: relative;

			.overflow {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				overflow: auto;
				padding: 0;

				/* common styles */
				.figure-wrapper {
					cursor: pointer;
					position: relative;
					.figure {
						&.selected {
							border: 8px solid rgba(63, 187, 131, 0.2); /*primary*/
						}
						.select-btn,
						.select-btn-background {
							z-index: 5;
							top: 2px;
							right: 0;
							position: absolute;
							border-radius: 50%;
						}
					}
				}
			}

			/* mobile styles */
			&.overflow-mobile {
				display: flex;
				align-content: center;
				align-items: center;
			}
			.gallery-mobile {
				display: flex;
				align-items: center;
				.figure-wrapper {
					margin-right: 8px;
					&:last-child {
						margin-right: 0;
					}
				}
				.gallery-image-mobile {
					height: 158px;
					display: block;
				}
			}

			/* Desktop styles */
			.masonary {
				.figure-wrapper {
					margin-bottom: 8px;
					&:last-child {
						margin-bottom: 0;
					}
					.gallery-image {
						max-width: 400px;
						width: 100%;
						display: block;
					}
				}
			}
		}
	}
</style>
