<template>
	<v-row
		id="gallery"
		:class="{ 'order-2': $vuetify.breakpoint.xs }"
		class="gallery"
	>
		<v-col
			class="overflow"
			:class="{ 'overflow-mobile': $vuetify.breakpoint.xs }"
		>
			<MobileImages
				@clicked="handleClickImage"
				:edit="edit"
				v-if="$vuetify.breakpoint.xs"
				:images="currImages.images"
			/>

			<Images
				@clicked="handleClickImage"
				:edit="edit"
				v-else
				:images="currImages.images"
			/>
			<VueGallery
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
	export default {
		data() {
			return {
				index: null
			}
		},
		props: {
			edit: { default: false, required: true, type: Boolean }
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
			...mapActions('data', ['updateCurrImages', 'updateSelectionCount']),
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
			}
		}
	}
</script>

<style lang="scss" scoped>
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
		}

		/* mobile styles */
		&.overflow-mobile {
			display: flex;
			align-content: center;
			align-items: center;
		}
	}
</style>
