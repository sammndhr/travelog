<template>
	<div>
		<Button
			:disabled="currImages.images.length > 0 ? false : true"
			text="Select All"
			@clicked="handleClickSelectAll"
		/>
		<Button
			:disabled="selectionCount > 0 ? false : true"
			text="Delete"
			@clicked="handleClickDelete"
		/>

		<Button
			:disabled="selectionCount > 0 ? false : true"
			text="Cancel"
			@clicked="handleClickCancel"
		/>
	</div>
</template>

<script>
	import { mapActions, mapState } from 'vuex'
	import Button from '@/components/UI/Button'

	export default {
		name: 'EditControls',
		components: {
			Button
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
