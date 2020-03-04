<template>
  <v-col align-self="start" cols="12" xl="6" md="5">
    <v-sheet class="gallery-wrapper" :height="mainHeight"
      ><!-- Set the height on sheet wrapping first tabs component so the vertical tabs will take up full height  -->
      <v-tabs
        v-model="tab"
        active-class="active-tab"
        dark
        icons-and-text
        :hide-slider="true"
        background-color="#0E1813"
        :right="false"
        :vertical="true"
        height="100%"
        color="white"
      >
        <v-tab v-for="(item, i) in items" :key="item.title" :href="`#${i}`">
          <template v-if="$vuetify.breakpoint.xs ? false : true">
            {{ item.text }}
          </template>
          <v-icon>{{ item.icon }}</v-icon>
        </v-tab>

        <v-tabs-items v-model="tab">
          <v-tab-item
            :transition="false"
            :reverse-transition="false"
            v-for="(item, i) in items"
            :key="`tab-item-${item.title}`"
            :value="`${i}`"
            class="secondary tab-item lighten-2"
          >
            <TabItem />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
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
        expandOnHover: false,
        items: [
          {
            title: 'mapped',
            text: 'Mapped',
            icon: 'mdi-map-marker',
            hasLocation: true
          },
          {
            title: 'unmapped',
            text: 'Unmapped',
            icon: 'mdi-map-marker-off',
            hasLocation: false
          }
        ],

        tab: 0
      }
    },

    watch: {
      tab(val) {
        this.updateHasLocation(this.items[val].hasLocation)
      },

      filteredImages(newImages) {
        if (this.hasLocation) {
          this.updateCurrImages(newImages)
        }
      }
    },

    computed: {
      ...mapState(['mainHeight']),
      ...mapState('data', ['hasLocation', 'noLocationCount', 'filteredImages'])
    },

    methods: {
      ...mapActions('data', ['updateHasLocation', 'updateCurrImages'])
    }
  }
</script>

<style lang="scss" scoped>
  .gallery-wrapper {
    display: flex;
    flex-direction: column;
    .active-tab {
      background-color: #232c27;
    }
    .v-tab {
      text-transform: unset;
      font-weight: 600;
      font-size: 10px;
    }
  }
</style>
