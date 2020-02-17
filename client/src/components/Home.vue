<template>
	<v-container class="px-12">
		<v-row
			align="center"
			justify="space-between"
			:class="$vuetify.breakpoint.xs ? 'text-center' : ''"
		>
			<v-col md="4" cols="12">
				<template v-if="register">
					<Register
						@backButtonClicked="handleBackButtonClicked"
						:cols="{ sm: 12, md: 12 }"
					/>
				</template>
				<template v-else>
					<h2 class="headline font-weight-bold mb-3">
						Log your travels.
					</h2>
					<p class="subheading font-weight-regular">
						Get started. Create an account
					</p>
					<Button text="Register" @clicked="handleClickRegister" />
				</template>
			</v-col>
			<v-col md="8" cols="12">
				<v-img src="/images/landing.png"></v-img>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import Button from './ui/Button'
	import Register from './auth/Register'
	export default {
		name: 'Landing',
		components: {
			Register,
			Button
		},
		data() {
			return {
				register: false
			}
		},
		methods: {
			handleBackButtonClicked() {
				this.register = false
			},
			handleClickRegister() {
				this.register = true
			}
		}
	}
</script>
<style lang="scss" scoped></style>
