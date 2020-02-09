<template>
	<v-btn elevation="3" class="ma-2" color="primary" @click="handleClick">
		{{ text }}
		<v-icon v-show="type === 'upload'" right dark>mdi-cloud-upload</v-icon>
	</v-btn>
</template>
<script>
	export default {
		name: 'Button',
		props: {
			text: {
				default: 'Button',
				required: false,
				type: String
			},
			type: {
				default: '',
				required: false,
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
