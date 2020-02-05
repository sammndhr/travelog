<template>
	<v-container class="log">
		<v-layout text-center wrap>
			<Alert />
			<Loader v-show="status.uploading" />
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
			<Gallery :filteredImages="filteredImages" />
		</v-layout>
	</v-container>
</template>

<script>
	import { supportsFileReader, handleImages } from '../utils/'
	import { mapActions, mapState } from 'vuex'
	import Gallery from './Gallery'

	import Map from './Map'
	import Loader from './Loader'
	import Alert from './Alert'

	export default {
		name: 'Log',
		components: { Loader, Alert, Map, Gallery },
		computed: {
			...mapState('data', ['status', 'filteredImages'])
		},
		methods: {
			...mapActions('data', ['upload', 'getGeojson']),
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
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.getGeojson()
			})
		}
	}
</script>

<style scoped lang="scss"></style>
