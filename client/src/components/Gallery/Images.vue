<template>
	<masonry class="masonary" :cols="cols" :gutter="gutter">
		<v-card
			@click="handleUploadClick"
			class="figure-wrapper upload-wrapper white darken-1"
			outlined
		>
			<v-icon color="primary" x-large class="upload-icon">
				mdi-plus
			</v-icon>
		</v-card>
		<div v-for="(image, i) in images" :key="image.key" class="figure-wrapper">
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
					@click="handleClick({ i, key: image.key })"
				/>
			</figure>
		</div>
	</masonry>
</template>

<script>
	export default {
		name: 'Images',
		props: {
			images: {
				type: Array,
				default: () => [],
				required: true
			},

			edit: {
				type: Boolean,
				default: false,
				required: true
			}
		},
		data() {
			return {
				gutter: { default: '8px' },
				cols: { default: 4, 1600: 3, 1300: 2 }
			}
		},
		methods: {
			handleClick({ i, key }) {
				this.$emit('clicked', { i, key })
			},

			handleUploadClick() {
				this.$emit('uploadClicked')
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* common styles */
	.figure-wrapper {
		&.upload-wrapper {
			width: 100%;
			padding-top: 98.42%;
			position: relative;
			.upload-icon {
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				background-color: transparent;
			}
		}
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
</style>
