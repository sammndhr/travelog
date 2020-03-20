<template>
  <v-container
    class="location-container"
    style="flex-grow:1 !important; flex-shrink: 0 !important;"
  >
    <EditControls v-if="edit" />
    <v-row
      style="height: 100% !important;"
      id="gallery"
      :class="{ 'order-2': $vuetify.breakpoint.xs }"
      class="gallery"
    >
      <ImagesWrapper
        v-show="mapped"
        :edit="edit"
        :galleryId="galleryId"
        :currImages="currMappedImages"
        @indexChanged="indexChanged"
      />
      <ImagesWrapper
        v-show="!mapped"
        :edit="edit"
        :galleryId="galleryId"
        :currImages="currUnmappedImages"
        @indexChanged="indexChanged"
      />
      <VueGallery
        :id="galleryId"
        v-if="!edit"
        :images="currUrls"
        :index="index"
        @close="index = null"
      />
    </v-row>
  </v-container>
</template>

<script>
  import VueGallery from 'vue-gallery'
  import { mapGetters, mapState } from 'vuex'
  import ImagesWrapper from './ImagesWrapper'
  import EditControls from './EditControls'

  export default {
    name: 'GalleryEditTabItem',
    props: {
      edit: {
        type: Boolean,
        default: false,
        required: false
      },
      galleryId: {
        type: String,
        default: '',
        required: false
      },
      title: {
        type: String,
        default: '',
        required: false
      }
    },
    data() {
      return {
        index: null
      }
    },
    components: {
      VueGallery,
      ImagesWrapper,
      EditControls
    },
    computed: {
      ...mapGetters('data', ['unmappedCount']),
      ...mapState(['mainHeight']),
      ...mapState('data', ['mapped', 'currUnmappedImages', 'currMappedImages']),
      currUrls() {
        return this.mapped
          ? this.currMappedImages.urls
          : this.currUnmappedImages.urls
      }
    },

    methods: {
      indexChanged(i) {
        this.index = i
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container.location-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100%;
    .gallery {
      overflow: hidden;
      flex-grow: 1;
      position: relative;
    }
    .row {
      flex-grow: unset;
      flex-shrink: unset;
    }
  }
</style>
