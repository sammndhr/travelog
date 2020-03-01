<template>
	<v-col align-self="start" cols="12" xl="6" md="5">
		<v-sheet class="gallery-wrapper" :height="mainHeight"
			><!-- Set the height on sheet wrapping first tabs component so the vertical tabs will take up full height  -->
			<v-navigation-drawer
				v-model="drawer"
				:expand-on-hover="expandOnHover"
				:mini-variant="miniVariant"
				:mini-variant-width="miniWidth"
				dark
				color="secondary"
				:permanent="true"
			>
				<v-list dense nav>
					<v-list-item-group mandatory v-model="model" color="primary">
						<v-list-item v-for="item in items" :key="item.title" link>
							<v-list-item-icon>
								<v-icon>{{ item.icon }}</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>
									{{ item.title }}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list-item-group>
				</v-list>
			</v-navigation-drawer>
			<TabItem />
		</v-sheet>
	</v-col>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import TabItem from './TabItem'
	export default {
		name: 'Travelog-Gallery',
		components: {
			TabItem
		},

		data() {
			return {
				miniVariant: true,
				miniWidth: '65px',
				expandOnHover: false,
				items: [
					{ title: 'Mapped', icon: 'mdi-map-marker', hasLocation: true },
					{ title: 'Unmapped', icon: 'mdi-map-marker-off', hasLocation: false }
				],
				drawer: true,
				model: 0
			}
		},

		watch: {
			model(val) {
				this.updateHasLocation(this.items[val].hasLocation)
			}
		},

		computed: {
			...mapState(['mainHeight']),
			...mapState('data', ['noLocationCount'])
		},

		methods: {
			...mapActions('data', ['updateHasLocation'])
		}
	}
</script>

<style lang="scss" scoped>
	.gallery-wrapper {
		display: flex;
		flex-wrap: nowrap;
		.active-tab {
			color: $primary;
			background-color: #4a4a4a;
		}
	}
</style>
