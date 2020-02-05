<template>
	<div id="marker">
		<img src="imgSrc" alt="" />
	</div>
</template>

<script>
	export default {
		props: {
			imgSrc: {
				default: '',
				type: String,
				required: true
			}
		},
		mounted() {}
	}
</script>

<style>
	#marker {
		background-image: url('https://docs.mapbox.com/mapbox-gl-js/assets/washington-monument.jpg');
		background-size: cover;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		cursor: pointer;
	}
</style>
