<template>
	<v-row>
		<v-col>
			<v-card flat tile>
				<v-toolbar dark dense class="secondary lighten-3">
					<IconButton
						v-show="selectionCount > 0"
						icon="mdi-close"
						@clicked="handleClickCancel"
					/>

					<v-toolbar-title v-show="selectionCount > 0" class="pl-0">
						{{ selectionCount }} selected</v-toolbar-title
					>
					<v-spacer></v-spacer>
					<IconButton
						v-show="currImages.images.length !== selectionCount"
						icon="mdi-checkbox-multiple-marked-outline"
						@clicked="handleClickSelectAll"
					/>
					<IconButton
						v-show="selectionCount > 0"
						icon="mdi-trash-can"
						@clicked="handleClickDelete"
					/>
				</v-toolbar>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
	import { mapActions, mapState } from 'vuex'
	import IconButton from '@/components/UI/IconButton'

	export default {
		name: 'EditControls',
		components: {
			IconButton
		},

		computed: {
			...mapState('data', ['selectionCount', 'currImages'])
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
				const count = this.currImages.images.length
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
