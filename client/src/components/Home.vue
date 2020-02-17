<template>
	<v-container class="px-12">
		<v-row
			align="center"
			justify="space-between"
			:class="$vuetify.breakpoint.xs ? 'text-center' : ''"
		>
			<v-col md="3" cols="12">
				<h2 class="headline font-weight-bold mb-3">
					Log your travels.
				</h2>
				<p class="subheading font-weight-regular">
					Get started. Create an account
				</p>
				<Button text="Register" link="/register" />
			</v-col>
			<v-col md="8" cols="12">
				<v-card class="pa-2" outlined tile>
					<v-img src="/images/banner.png"></v-img>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
	import Button from './ui/Button'
	export default {
		name: 'Landing',
		components: {
			Button
		}
	}
</script>
<style lang="scss" scoped>
	.home {
		text-align: center;
		.mx-auto {
			background-color: palevioletred;
		}
	}
</style>
