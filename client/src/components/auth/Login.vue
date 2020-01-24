<template>
	<div>
		<Alert />
		<div>
			<h2>Login</h2>
			<form @submit.prevent="handleSubmit">
				<div class="form-group">
					<label for="email">Email</label>
					<input
						type="text"
						v-model="email"
						name="email"
						class="form-control"
					/>
					<div v-show="submitted && !email" class="invalid-feedback">
						email is required
					</div>
				</div>
				<div class="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						v-model="password"
						name="password"
						class="form-control"
					/>
					<div v-show="submitted && !password" class="invalid-feedback">
						Password is required
					</div>
				</div>
				<div class="form-group">
					<button class="btn btn-primary" :disabled="status.loggingIn">
						Login
					</button>
					<Loader v-show="status.loggingIn" />
					<router-link to="/register" class="btn btn-link"
						>Register</router-link
					>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import Loader from '../Loader'
	import Alert from './Alert'
	export default {
		data() {
			return {
				email: '',
				password: '',
				submitted: false
			}
		},
		components: { Loader, Alert },
		computed: {
			...mapState('account', ['status'])
		},
		created() {
			// reset login status
			this.logout()
		},
		methods: {
			...mapActions('account', ['login', 'logout']),
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
