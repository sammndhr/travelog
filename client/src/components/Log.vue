<template>
	<div class="log">
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
		<Map />
	</div>
</template>

<script>
	import { supportsFileReader, handleImages } from '../utils/'
	import { mapActions } from 'vuex'
	import Map from './Map'

	export default {
		name: 'Log',
		components: { Map },
		methods: {
			...mapActions('data', ['upload']),
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
					allImageData = []

				for (const image of images) {
					const { key, exif, file } = image,
						extension = file.type.split('/').pop(),
						newName = `${key}.${extension}`

					allImageData.push({ key, exif, extension })
					formData.append('photos', file, newName)
				}

				formData.append('allImageData', JSON.stringify(allImageData))
				this.upload(formData)
			}
		}
	}
</script>

<style scoped lang="scss"></style>
