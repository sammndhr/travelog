<template>
	<div class="gallery-mobile">
		<div class="figure-wrapper">
			<v-card @click="handleUploadClick" class="upload" outlined>
				<v-icon
					color="primary"
					x-large
					style="position: absolute; top: 0; left: 0; bottom: 0; right: 0;"
				>
					mdi-plus
				</v-icon>
			</v-card>
		</div>
		<div
			v-for="(image, i) in images"
			:key="image.key"
			class="figure-wrapper"
			@click="handleClick({ i, key: image.key })"
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
				/>
			</figure>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'MobileImages',
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
	.upload {
		width: 150px;
		height: 150px;
	}
	/* common styles */
	.figure-wrapper {
		cursor: pointer;
		position: relative;
		.figure {
			height: 150px;
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
	//mobile
	.gallery-mobile {
		display: flex;
		align-items: center;
		height: 100%;

		.figure-wrapper {
			margin-right: 8px;

			&:last-child {
				margin-right: 0;
			}
		}
		.gallery-image-mobile {
			height: 100%;
			display: block;
			object-fit: contain;
		}
	}
</style>
