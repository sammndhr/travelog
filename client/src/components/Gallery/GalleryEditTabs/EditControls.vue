<template>
	<v-row v-if="currImagesCount > 0">
		<v-col>
			<v-card flat tile>
				<v-toolbar dark dense class="secondary lighten-2">
					<IconButton
						tooltip="Cancel"
						:show="selectionCount > 0"
						icon="mdi-close"
						@clicked="handleClickCancel"
					/>

					<v-toolbar-title v-show="selectionCount > 0" class="pl-0">
						{{ selectionCount }} selected</v-toolbar-title
					>
					<v-spacer></v-spacer>
					<IconButton
						tooltip="Select All"
						:show="currImagesCount !== selectionCount"
						icon="mdi-checkbox-multiple-marked-outline"
						@clicked="handleClickSelectAll"
					/>
					<IconButton
						tooltip="Delete"
						:show="selectionCount > 0"
						icon="mdi-trash-can"
						@clicked="handleClickDelete"
					/>
				</v-toolbar>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
	import { mapActions, mapState, mapGetters } from 'vuex'
	import IconButton from '@/components/UI/IconButton'

	export default {
		name: 'EditControls',
		components: {
			IconButton
		},

		computed: {
			...mapState('data', ['selectionCount', 'currImages']),
			...mapGetters('data', ['currImagesCount'])
		},

		methods: {
			...mapActions('data', [
				'delete',
				'updateCurrImages',
				'updateSelectionCount',
				'unselectAllItems'
			]),

			handleClickDelete() {
				const imagesToDelete = this.currImages.images.reduce(
					(filtered, image) => {
						if (image.selected) filtered.push(image.key)
						return filtered
					},
					[]
				)
				this.updateSelectionCount({ type: 'reset' })
				this.delete({ imagesToDelete })
			},

			selectAllItems() {
				const currImages = JSON.parse(JSON.stringify(this.currImages))
				for (const image of currImages.images) {
					image.selected = true
				}
				this.updateCurrImages(currImages)
				const count = this.currImagesCount
				this.updateSelectionCount({ type: 'update', count })
			},

			handleClickSelectAll() {
				this.selectAllItems()
			},

			handleClickCancel() {
				this.unselectAllItems()
			}
		}
	}
</script>

<style></style>
