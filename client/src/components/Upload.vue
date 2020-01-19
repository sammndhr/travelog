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
	/* eslint-disable */
	import { supportsFileReader, readExif } from '../utils/getExif'
	import axios from 'axios'
	export default {
		name: 'Upload',
		data() {
			return {
				file: ''
			}
		},
		methods: {
			async handleChange(e) {
				if (!supportsFileReader()) {
					console.log('Sorry, your web browser does not support the FileReader API.')
					return
				}
				const formData = new FormData(),
					files = e.target.files,
					allExif = await readExif(files)

				console.log(allExif)

				// for (const exif of allExif) {
				// 	formData.append(0, exif)
				// }
				const dataToSend = allExif[0]
				// formData.append(0, exif)
				try {
					const getReq = await axios.post('/uploads', dataToSend)
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
