<template>
	<div id="gallery" class="gallery">
		<div class="gallery-mobile" v-if="isMobile">
			<img
				v-for="(imageUrl, name) in filteredImages"
				:key="name"
				class="gallery-image-mobile"
				:src="imageUrl"
				alt="gallery-img.jpeg"
				@click="onClick(i)"
			/>
		</div>
		<masonry v-else class="masonary" :cols="cols" :gutter="{ default: '5px' }">
			<img
				v-for="image in filteredImages"
				:style="{ paddingBottom: gutter.default }"
				:key="image"
				class="gallery-image"
				:src="image"
				alt="gallery-img.jpeg"
				@click="onClick(i)"
			/>
		</masonry>

		<gallery
			:images="Object.values(filteredImages)"
			:index="index"
			@close="index = null"
		></gallery>
	</div>
</template>

<script>
	import VueGallery from 'vue-gallery'

	export default {
		props: {
			filteredImages: {
				type: Object,
				required: false,
				default: () => {}
			},
			fadeUp: {
				type: Boolean,
				required: false,
				default: true
			}
		},

		data() {
			return {
				index: null,
				cols: { default: 3, 1000: 2, 900: 1 },
				items: [1, 2, 3, 4, 5],
				isMobile: false,
				gutter: { default: '5px' }
			}
		},

		components: {
			gallery: VueGallery
		},

		methods: {
			onClick(i) {
				this.index = i
			}
		},
		updated() {
			console.log(this.filteredImages)
		},
		mounted() {
			if (window.innerWidth <= 500) this.isMobile = true
			this.$root.$on('resized', ({ width, height }) => {
				this.isMobile = width <= 500 ? true : false
				this.isMobile = height > 750 || width > 500 ? false : true
				this.cols =
					width < 450 && height > 750
						? { default: 2 }
						: { default: 3, 1000: 2, 900: 1 }
			})
		}
	}
</script>

<style lang="scss" scoped>
	.gallery {
		overflow: scroll;
		flex-basis: 45%;
		display: flex;
		align-items: center;

		.gallery-mobile {
			display: flex;
			align-items: center;
		}

		.gallery-image-mobile,
		.gallery-image {
			background-size: cover;
			cursor: pointer;
		}

		.gallery-image-mobile {
			height: 185px;
			display: block;
		}
		.gallery-image {
			max-width: 250px;
			width: 100%;
			display: block;
		}
	}

	@include small-breakpoint {
		.gallery {
			display: block;
			flex-basis: 30%;
		}
	}

	@include large-breakpoint {
		.gallery {
			flex-basis: 40%;
		}
	}
</style>
