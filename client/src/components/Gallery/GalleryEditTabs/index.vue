<template>
  <v-container
    :style="{
      height: mainHeight
    }"
    class="loc-container-wrapper secondary lighten-1"
  >
    <v-row no-gutters="">
      <v-col>
        <h3 class="white--text mb-2 px-2">{{ title }}</h3>
      </v-col>
    </v-row>
    <v-tabs
      active-class="active-tab"
      v-model="tab"
      class="tabs-location"
      background-color="secondary lighten-1"
      color="primary"
      centered
      dark
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
        <span class="tab-text">{{ tab.text }}</span>
      </v-tab>

      <v-tabs-items v-model="tab" class="edit-tabs">
        <v-tab-item
          class="secondary lighten-1 location-tab-item"
          v-for="(tab, i) in tabs"
          :key="`tab-item-${tab.title}`"
          :value="`${i}`"
        >
          <v-alert
            v-if="warning"
            class="mb-0 mt-4"
            dismissible
            type="warning"
            text
            dense
            outlined
            transition="slide-y-transition"
          >
            {{ warning }}
          </v-alert>
          <TabItem
            :edit="tab.edit"
            :title="title"
            :galleryId="`${tab.title}-${galleryMapId}`"
          >
            <slot />
          </TabItem>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>

<script>
  import TabItem from './TabItem'
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'GalleryEditTabs',
    components: {
      TabItem
    },
    props: {
      galleryMapId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        tab: 0,

        tabs: [
          {
            title: 'gallery',
            text: 'Gallery',
            icon: 'mdi-tooltip-image',
            edit: false
          },
          { title: 'edit', text: 'Edit', icon: 'mdi-trash-can', edit: true }
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
      ...mapState('data', ['hasLocation', 'warning']),
      ...mapState(['mainHeight']),
      title() {
        return this.hasLocation ? 'Mapped Images' : 'Unmapped Images'
      }
    }
  }
</script>

<style lang="scss">
  .loc-container-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;

    .row {
      flex-grow: unset;
      flex-shrink: unset;
    }
    .tabs-location {
      height: calc(100%);
    }
    .edit-tabs {
      height: calc(100% - 48px);
    }

    .v-window__container {
      height: 100% !important;
    }
    .location-tab-item {
      height: 100% !important;
      border: none;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
    }
    .tab-text {
      font-weight: 600;
      padding-left: 8px;
      text-transform: none;
      color: rgba(255, 255, 255, 0.7);
    }
    .active-tab {
      .tab-text {
        color: $primary;
      }
    }
  }
</style>
