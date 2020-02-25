<template>
	<v-col align-self="start" cols="12" xl="6" md="5">
		<v-sheet
			class="gallery-wrapper"
			:class="$vuetify.breakpoint.xs ? 'mobile' : 'not-mobile'"
			elevation="3"
		>
			<v-tabs
				active-class="active-tab"
				dark
				:right="false"
				:vertical="$vuetify.breakpoint.xs ? false : true"
				:height="$vuetify.breakpoint.xs ? '30px' : '100%'"
				color="primary"
			>
				<v-tabs-slider></v-tabs-slider>
				<v-tab @click="handleClickGallery" href="#tab-gallery">
					Gallery
				</v-tab>
				<v-tab @click="handleClickEdit" href="#tab-edit">
					Edit
				</v-tab>

				<v-tab-item
					class="secondary lighten-2"
					v-for="items in tabs"
					:key="`tab-${items}`"
					:value="'tab-' + items"
					style="height:100%;"
				>
					<v-col align="center">
						<Button text="No Location" @clicked="toggleNoLocationImages" />
						<template v-if="edit">
							<Button
								:disabled="currImages.images.length > 0 ? false : true"
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
					<ImagesWrapper :edit="edit" />
				</v-tab-item>
			</v-tabs>
		</v-sheet>
	</v-col>
</template>

<script>
	import { mapActions, mapState, mapGetters } from 'vuex'
	import Button from '@/components/UI/Button'
	import ImagesWrapper from './ImagesWrapper'

	export default {
		name: 'Travelog-Gallery',
		components: {
			Button,
			ImagesWrapper
		},
		props: {
			fadeUp: {
				type: Boolean,
				required: false,
				default: true
			}
		},
		data() {
			return {
				edit: false,
				tabs: ['gallery', 'edit']
			}
		},

		computed: {
			...mapGetters('data', ['hasLocationImages', 'noLocationImages']),

			...mapState('data', [
				'selectionCount',
				'currImages',
				'hasLocation',
				'filteredImages'
			])
		},

		watch: {
			filteredImages(newImages) {
				if (this.hasLocation) {
					this.updateCurrImages(newImages)
				}
			}
		},

		methods: {
			...mapActions('data', [
				'delete',
				'updateCurrImages',
				'updateSelectionCount',
				'toggleHasLocation'
			]),

			toggleNoLocationImages() {
				this.toggleHasLocation()
			},

			handleClickDelete() {
				const imagesToDelete = this.currImages.images.reduce(
					(filtered, image) => {
						if (image.selected) filtered.push(image.key)
						return filtered
					},
					[]
				)
				this.updateSelectionCount({ type: 'reset' })
				this.delete({ imagesToDelete })
			},

			unselectAllItems() {
				const currImages = JSON.parse(JSON.stringify(this.currImages))
				for (const image of currImages.images) {
					image.selected = false
				}
				this.updateCurrImages(currImages)
				this.updateSelectionCount({ type: 'reset' })
			},

			selectAllItems() {
				const currImages = JSON.parse(JSON.stringify(this.currImages))
				for (const image of currImages.images) {
					image.selected = true
				}
				this.updateCurrImages(currImages)
				const count = this.currImages.images.length
				this.updateSelectionCount({ type: 'update', count })
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.gallery-wrapper {
		display: flex;
		flex-direction: column;

		&.not-mobile {
			height: 85vh;
		}

		.active-tab {
			background-color: #4a4a4a;
		}
	}
</style>
