<template>
	<div class="upload">
		<div className="form options">
			<fieldset className="form-group">
				<label className="button" htmlFor="upload-images">
					<span>Upload Images</span>
				</label>
				<input id="upload-images" type="file" accept="image/*, image/heic" multiple="{true}" @change="handleChange" />
			</fieldset>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: 'Upload',
		data() {
			return {
				file: ''
			}
		},
		methods: {
			readMultipleFiles: function(files) {
				return files
			},
			async handleChange(e) {
				const formData = new FormData(),
					files = e.target.files
				formData.append('file', files[0])
				try {
					const getReq = await axios.post('/upload', formData)
					console.log(getReq)
					this.message = 'Uploaded!!'
				} catch (err) {
					console.log(err.response)
					this.message = 'Something went wrongs!!'
				}
			}
		}
	}
</script>

<style scoped lang="scss"></style>
