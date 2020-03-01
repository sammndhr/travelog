<template>
	<v-tooltip dark bottom>
		<template v-slot:activator="{ on }">
			<v-btn
				v-show="show"
				color="primary"
				icon
				v-on="on"
				dark
				@click="handleClick"
			>
				<v-icon>{{ icon }}</v-icon>
			</v-btn>
		</template>
		<span>{{ tooltip }}</span>
	</v-tooltip>
</template>
<script>
	export default {
		name: 'IconButton',

		props: {
			icon: {
				default: '',
				required: true,
				type: String
			},
			tooltip: {
				default: '',
				required: false,
				type: String
			},
			show: {
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
