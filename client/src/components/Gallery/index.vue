<template>
	<v-col align-self="start" cols="12" xl="6" md="5">
		<v-sheet
			class="gallery-wrapper"
			:class="$vuetify.breakpoint.xs ? 'mobile' : 'not-mobile'"
			elevation="3"
		>
			<v-tabs
				@change="handleTabItemClick"
				active-class="active-tab"
				dark
				:right="false"
				:vertical="$vuetify.breakpoint.xs ? false : true"
				:height="$vuetify.breakpoint.xs ? '30px' : '100%'"
				color="primary"
			>
				<v-tab @click="handleClickGallery" href="#tab-gallery">
					Gallery
				</v-tab>
				<v-tab @click="handleClickEdit" href="#tab-edit">
					Edit
				</v-tab>
				<v-tab-item
					:transition="false"
					:reverse-transition="false"
					class="secondary tab-item lighten-2"
					v-for="item in tabs"
					:key="`tab-${item}`"
					:value="'tab-' + item"
					style="height:100%;"
				>
					<v-tabs
						:height="noLocationImages.images.length ? '40px' : '0px'"
						class="tabs-location"
						background-color="secondary lighten-2"
						style="height:100%;"
						color="primary"
						centered
					>
						<v-tabs-slider color="primary slider"></v-tabs-slider>

						<v-tab
							@click="handleClickHasLoc"
							style="width: 48%;"
							href="#tab-hasLocation"
							class="primary--text"
						>
							<v-icon>mdi-map-marker</v-icon>
						</v-tab>
						<v-tab
							@click="handleClickNoLoc"
							style="width: 48%;"
							href="#tab-noLocation"
							class="primary--text"
						>
							<v-icon>mdi-map-marker-off</v-icon>
						</v-tab>

						<v-tab-item
							class="secondary lighten-2"
							:transition="false"
							:reverse-transition="false"
							v-for="item in tabsL"
							:key="`tab-${item}`"
							:value="'tab-' + item"
							style="height:100%;"
						>
							<div v-if="warning" class="pa-3">
								<v-alert
									dismissible
									type="warning"
									text
									dense
									outlined
									transition="slide-y-transition"
								>
									{{ warning }}
								</v-alert>
							</div>
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

							<ImagesWrapper :edit="edit" />
						</v-tab-item>
					</v-tabs>
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
				hasLocation: true,
				tabs: ['gallery', 'edit'],
				tabsL: ['hasLocation', 'noLocation']
			}
		},

		computed: {
			...mapGetters('data', ['hasLocationImages', 'noLocationImages']),
			...mapState('data', [
				'selectionCount',
				'currImages',
				'filteredImages',
				'warning'
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
				'updateHasLocation',
				'updateWarning'
			]),

			handleClickHasLoc() {
				this.updateHasLocation(true)
				this.updateWarning('')
			},
			handleClickNoLoc() {
				this.updateWarning('')
				this.updateHasLocation(false)
			},
			handleTabItemClick() {
				this.updateWarning('')
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
		.tabs-location {
			padding: 8px;
			padding-top: 16px;
		}
	}
</style>
