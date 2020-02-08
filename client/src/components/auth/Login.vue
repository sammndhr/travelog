<template>
	<v-app id="inspire">
		<Alert />
		<v-content>
			<v-container class="fill-height" fluid>
				<v-row align="center" justify="center">
					<v-col cols="12" sm="8" md="4">
						<v-card class="elevation-12">
							<v-toolbar color="primary" dark flat>
								<v-toolbar-title>Login form</v-toolbar-title>
								<v-spacer />
							</v-toolbar>
							<v-card-text>
								<v-form
									id="login-form"
									@submit.prevent="handleSubmit"
									ref="form"
									v-model="valid"
									lazy-validation
								>
									<v-text-field
										label="Login"
										name="login"
										v-model="email"
										:rules="emailRules"
										prepend-icon="mdi-account"
										type="text"
									/>
									<v-text-field
										id="password"
										label="Password"
										name="password"
										prepend-icon="mdi-lock"
										v-model="password"
										:rules="passwordRules"
										type="password"
									/>
								</v-form>
							</v-card-text>
							<v-card-actions>
								<v-spacer />
								<v-btn
									:disabled="!valid"
									color="primary"
									class="mr-4"
									@click="validate"
									block
									type="submit"
									form="login-form"
									>Login</v-btn
								>
							</v-card-actions>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import Alert from '../Alert'
	export default {
		data() {
			return {
				email: '',
				password: '',
				submitted: false,
				valid: true,
				passwordRules: [v => !!v || 'Password is required'],
				emailRules: [
					v => !!v || 'E-mail is required',
					v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
				]
			}
		},
		components: { Alert },
		computed: {
			...mapState('account', ['status'])
		},
		created() {
			// reset login status
			this.logout()
		},
		methods: {
			...mapActions('account', ['login', 'logout']),
			validate() {
				if (this.$refs.form.validate()) {
					this.snackbar = true
				}
			},
			handleSubmit() {
				this.submitted = true
				const { email, password } = this
				if (email && password) {
					this.login({ email, password })
				}
			}
		}
	}
</script>
