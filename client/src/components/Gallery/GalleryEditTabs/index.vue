<template>
	<!-- :height="noLocationCount ? '40px' : '0px'" -->
	<v-tabs
		v-model="tab"
		height="40px"
		class="tabs-location"
		background-color="secondary lighten-2"
		color="primary"
		centered
	>
		<v-tabs-slider color="primary slider"></v-tabs-slider>
		<v-tabs-slider color="primary slider"></v-tabs-slider>

		<v-tab
			v-for="(tab, i) in tabs"
			:key="`tab-${tab.title}`"
			style="width: 48%;"
			:href="`#${i}`"
			class="primary--text"
		>
			<v-icon>{{ tab.icon }}</v-icon>
		</v-tab>

		<v-tabs-items v-model="tab">
			<v-tab-item
				class="secondary lighten-2 location-tab-item"
				v-for="(tab, i) in tabs"
				:key="`tab-item-${tab.title}`"
				:value="`${i}`"
			>
				<TabItem :edit="tab.edit" :galleryId="`gallery-${tab.title}`">
					<slot />
				</TabItem>
			</v-tab-item>
		</v-tabs-items>
	</v-tabs>
</template>

<script>
	import TabItem from './TabItem'
	import { mapGetters, mapState } from 'vuex'

	export default {
		name: 'GalleryEditTabs',
		components: {
			TabItem
		},
		data() {
			return {
				tab: 0,
				tabs: [
					{ title: 'gallery', icon: 'mdi-tooltip-image', edit: false },
					{ title: 'edit', icon: 'mdi-trash-can', edit: true }
				]
			}
		},
		//RESET state to if hasLocation state changes so renders gallery view.
		watch: {
			hasLocation(newValue, oldValue) {
				if (newValue !== oldValue) this.tab = 0
			}
		},

		computed: {
			...mapGetters('data', ['noLocationCount']),
			...mapState('data', ['hasLocation'])
		}
	}
</script>

<style lang="scss" scoped>
	.location-tab-item {
		height: 100%;
	}
</style>
