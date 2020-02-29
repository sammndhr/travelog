<template>
	<v-btn color="primary" icon @click="handleClick">
		<v-icon>{{ icon }}</v-icon>
	</v-btn>
</template>
<script>
	export default {
		name: 'IconButton',

		props: {
			icon: {
				default: '',
				required: true,
				type: String
			}
		},

		methods: {
			handleClick() {
				this.$emit('clicked')
			}
		}
	}
</script>
<style></style>
