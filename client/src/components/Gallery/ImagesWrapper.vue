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
			<div class="gallery-mobile" v-if="$vuetify.breakpoint.xs">
				<div
					v-for="(image, i) in hasLocationImages.images"
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
							v-for="(image, i) in hasLocationImages.images"
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
							v-for="(image, i) in noLocationImages.images"
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
			<VueGallery
				v-if="!edit"
				:images="hasLocationImages.urls"
				:index="index"
				@close="index = null"
			/>
		</v-col>
	</v-row>
</template>

<script>
	import VueGallery from 'vue-gallery'
	import { mapActions, mapState } from 'vuex'

	export default {
		data() {
			return {
				index: null,
				gutter: { default: '8px' },
				cols: { default: 4, 1600: 3, 1300: 2 }
			}
		},
		props: {
			edit: { default: false, required: true, type: Boolean }
		},
		components: {
			VueGallery
		},
		computed: {
			...mapState('data', ['hasLocationImages', 'noLocationImages'])
		},
		methods: {
			...mapActions('data', ['updateFilteredImages', 'updateSelectionCount']),
			toggleSelect({ i, key }) {
				const hasLocationImages = JSON.parse(
					JSON.stringify(this.hasLocationImages)
				)
				const images = hasLocationImages.images,
					selectedImage = images[i]
				if (selectedImage.key === key) {
					selectedImage.selected = !selectedImage.selected
					if (selectedImage.selected) {
						this.updateSelectionCount({ type: 'increment' })
					} else {
						{
							this.updateSelectionCount({ type: 'decrement' })
						}
					}
					this.updateFilteredImages(hasLocationImages)
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
</style>
