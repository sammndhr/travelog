<template>
	<v-btn
		:disabled="disabled"
		elevation="3"
		class="ma-2"
		color="primary"
		@click="handleClick"
		:to="link"
	>
		{{ text }}
		<v-icon v-show="type === 'upload'" right dark>mdi-cloud-upload</v-icon>
	</v-btn>
</template>
<script>
	export default {
		name: 'Button',
		props: {
			link: {
				default: '',
				required: false,
				type: String
			},
			text: {
				default: 'Button',
				required: false,
				type: String
			},
			type: {
				default: '',
				required: false,
				type: String
			},

			disabled: {
				default: false,
				required: false,
				type: Boolean
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
