<template>
	<v-container
		:style="{
			height: `calc(${mainHeight} - 40px)`
		}"
		class="location-container"
	>
		<v-row v-if="warning">
			<v-col>
				<v-alert
					class="mb-0"
					dismissible
					type="warning"
					text
					dense
					outlined
					transition="slide-y-transition"
				>
					{{ warning }}
				</v-alert>
			</v-col>
		</v-row>
		<slot />
		<EditControls v-if="edit" />
		<ImagesWrapper
			:edit="edit"
			:galleryId="galleryId"
			:currImages="currImages"
			@selectToggled="toggleSelect"
		/>
	</v-container>
</template>

<script>
	import { mapGetters, mapState, mapActions } from 'vuex'
	import ImagesWrapper from './ImagesWrapper'
	import EditControls from './EditControls'

	export default {
		name: 'GalleryEditTabItem',
		props: {
			edit: {
				type: Boolean,
				default: false,
				required: false
			},
			galleryId: {
				type: String,
				default: '',
				required: false
			}
		},

		components: {
			ImagesWrapper,
			EditControls
		},
		computed: {
			...mapGetters('data', ['noLocationCount']),
			...mapState(['mainHeight']),
			...mapState('data', ['warning', 'currImages'])
		},
		methods: {
			...mapActions('data', [
				'updateHasLocation',
				'updateCurrImages',
				'updateSelectionCount'
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
			}
		},
		beforeMount() {
			this.updateHasLocation(true)
		},
		beforeDestroy() {
			this.updateHasLocation(false)
		}
	}
</script>

<style lang="scss" scoped>
	.location-tab-item {
		height: 100%;
		.container.location-container {
			display: flex;
			flex-direction: column;

			.row {
				flex-grow: unset;
				flex-shrink: unset;
			}
		}
		.container >>> .row {
			flex-shrink: unset;
			flex-grow: unset;
		}
	}
</style>
