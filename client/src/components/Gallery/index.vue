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
							<EditControls v-if="edit" />
							<ImagesWrapper :edit="edit" :galleryId="`gallery-${item}`" />
						</v-tab-item>
					</v-tabs>
				</v-tab-item>
			</v-tabs>
		</v-sheet>
	</v-col>
</template>

<script>
	import { mapActions, mapState, mapGetters } from 'vuex'
	import ImagesWrapper from './ImagesWrapper'
	import EditControls from './EditControls'

	export default {
		name: 'Travelog-Gallery',

		components: {
			ImagesWrapper,
			EditControls
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
				'warning',
				'hasLocation'
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
				'updateHasLocation',
				'updateWarning',
				'unselectAllItems'
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

			handleClickEdit() {
				this.edit = true
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
