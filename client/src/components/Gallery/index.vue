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
					<Button text="No Location" @clicked="toggleNoLocationImages" />
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
			</v-row>
			<ImagesWrapper :edit="edit" />
		</v-sheet>
	</v-col>
</template>

<script>
	import { mapActions, mapState, mapGetters } from 'vuex'
	import { supportsFileReader, handleImages } from '@/utils/'
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
				showAlert: false,
				edit: false
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
				'uploadAll',
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
	}
</style>
