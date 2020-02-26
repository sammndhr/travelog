<template>
	<!-- :style="{ height: $vuetify.breakpoint.xs ? '180px' : '100%' }" -->
	<v-row
		style="flex-grow:1 !important; flex-shrink: 0 !important;"
		id="gallery"
		:class="{ 'order-2': $vuetify.breakpoint.xs }"
		class="gallery"
	>
		<v-col
			class="overflow"
			:class="{ 'overflow-mobile': $vuetify.breakpoint.xs }"
		>
			<MobileImages
				@uploadClicked="$refs.fileInput.click()"
				@clicked="handleClickImage"
				:edit="edit"
				v-if="$vuetify.breakpoint.xs"
				:images="currImages.images"
			/>

			<Images
				@uploadClicked="$refs.fileInput.click()"
				@clicked="handleClickImage"
				:edit="edit"
				v-else
				:images="currImages.images"
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
			<VueGallery
				:id="galleryId"
				v-if="!edit"
				:images="currImages.urls"
				:index="index"
				@close="index = null"
			/>
		</v-col>
	</v-row>
</template>

<script>
	import VueGallery from 'vue-gallery'
	import { mapActions, mapState } from 'vuex'
	import MobileImages from './MobileImages'
	import Images from './Images'
	import { supportsFileReader, handleImages } from '@/utils/'

	export default {
		data() {
			return {
				index: null
			}
		},
		props: {
			edit: { default: false, required: true, type: Boolean },
			galleryId: { default: '', required: false, type: String }
		},

		components: {
			VueGallery,
			MobileImages,
			Images
		},
		computed: {
			...mapState('data', ['currImages'])
		},

		methods: {
			...mapActions('data', [
				'updateCurrImages',
				'updateSelectionCount',
				'uploadAll'
			]),

			toggleSelect({ i, key }) {
				const images = JSON.parse(JSON.stringify(this.currImages))
				const imagesArr = images.images,
					selectedImage = imagesArr[i]
				if (selectedImage.key === key) {
					selectedImage.selected = !selectedImage.selected
					if (selectedImage.selected) {
						this.updateSelectionCount({ type: 'increment' })
					} else {
						{
							this.updateSelectionCount({ type: 'decrement' })
						}
					}
					this.updateCurrImages(images)
				}
			},

			handleClickImage({ i, key }) {
				if (!this.edit) this.index = i
				else {
					this.toggleSelect({ i, key })
				}
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
	.gallery {
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
		}

		/* mobile styles */
		&.overflow-mobile {
			display: flex;
			align-content: center;
			align-items: center;
		}
	}
</style>
