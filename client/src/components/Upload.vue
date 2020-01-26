<template>
	<div class="upload">
		<div className="form options">
			<fieldset className="form-group">
				<label className="button" htmlFor="upload-images">
					<span>Upload Images</span>
				</label>
				<input
					id="upload-images"
					type="file"
					accept="image/*, image/heic"
					multiple="{true}"
					@change="handleChange"
				/>
			</fieldset>
		</div>
	</div>
</template>

<script>
	import { supportsFileReader, handleImages } from '../utils/getExif'
	import axios from 'axios'
	import { mapState } from 'vuex'
	export default {
		name: 'Upload',
		data() {
			return {
				file: '',
				userId: 1
			}
		},
		computed: {
			...mapState({
				user: state => state.account.user
			})
		},
		methods: {
			async handleChange(e) {
				if (!supportsFileReader()) {
					console.log(
						'Sorry, your web browser does not support the FileReader API.'
					)
					return
				}
				const formData = new FormData(),
					files = e.target.files,
					images = await handleImages(files),
					allExif = []

				for (const image of images) {
					const { key, exif, file } = image,
						extension = file.type.split('/').pop(),
						newName = `${key}.${extension}`

					allExif.push({ key, exif })
					formData.append('photos', file, newName)
				}

				formData.append('allExif', JSON.stringify(allExif))

				try {
					const getReq = await axios.post('/uploads', formData, {
						headers: { 'x-access-token': this.user.token }
					})

					console.log(getReq.status)
					console.log(getReq.data)
					this.message = 'Uploaded!!'
				} catch (err) {
					console.log(err.response)
					this.message = 'Something went wrong!!'
				}
			}
		},
		mounted() {}
	}
</script>

<style scoped lang="scss"></style>
