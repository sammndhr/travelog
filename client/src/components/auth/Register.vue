<template>
	<div>
		<Alert />
		<div>
			<h2>Register</h2>
			<form @submit.prevent="handleSubmit">
				<div class="form-group">
					<label for="email">Email</label>

					<input
						type="text"
						v-model="user.email"
						name="email"
						class="form-control"
					/>

					<!-- <div v-if="submitted && errors.has('email')" class="invalid-feedback">{{ errors.first('email') }}</div> -->
				</div>
				<div class="form-group">
					<label htmlFor="password">Password</label>

					<input
						type="password"
						v-model="user.password"
						name="password"
						class="form-control"
					/>

					<!-- <div v-if="submitted && errors.has('password')" class="invalid-feedback">{{ errors.first('password') }}</div> -->
				</div>
				<div class="form-group">
					<button class="btn btn-primary" :disabled="status.registering">
						Register
					</button>
					<Loader v-show="status.loggingIn" />

					<router-link to="/login" class="btn btn-link">Cancel</router-link>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import Loader from '../Loader'
	import Alert from '../Alert'
	export default {
		data() {
			return {
				user: {
					password: '',
					email: ''
				},
				submitted: false
			}
		},
		components: { Loader, Alert },
		computed: {
			...mapState('account', ['status'])
		},
		methods: {
			...mapActions('account', ['register']),
			handleSubmit() {
				this.submitted = true
				this.register(this.user)
			}
		}
	}
</script>
