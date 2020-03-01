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
				<v-list class="nav-list" dense nav dark>
					<v-list-item-group mandatory v-model="model" color="primary">
						<v-list-item
							active-class="active-tab-list"
							class="tab-list-item"
							v-for="item in items"
							:key="item.title"
							inactive
						>
							<v-list-item-icon>
								<v-icon class="tab-icon">{{ item.icon }}</v-icon>
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
		.nav-list {
			padding: 0;
		}
		display: flex;
		flex-wrap: nowrap;
		.tab-icon {
			color: rgba(255, 255, 255, 0.7);
		}
		.tab-list-item {
			margin: 0 !important;
			padding: 8px !important;
			border-radius: 0 !important;
		}
		.active-tab-list {
			background-color: #232c27 !important;

			.tab-icon {
				color: $primary;
			}
		}
	}
</style>
