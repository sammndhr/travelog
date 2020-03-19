<template>
  <v-container
    class="location-container"
    style="flex-grow:1 !important; flex-shrink: 0 !important;"
  >
    <EditControls v-if="edit" />
    <ImagesWrapper
      :edit="edit"
      :galleryId="galleryId"
      :currImages="currImages"
      @selectToggled="toggleSelect"
    />
  </v-container>
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex'
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

    components: {
      ImagesWrapper,
      EditControls
    },
    computed: {
      ...mapGetters('data', ['unmappedCount']),
      ...mapState(['mainHeight']),
      ...mapState('data', ['currImages'])
    },
    methods: {
      ...mapActions('data', [
        'updateMapped',
        'updateCurrImages',
        'updateSelectionCount'
      ]),

      toggleSelect({ i, key }) {
        const images = JSON.parse(JSON.stringify(this.currImages))
        const imagesArr = images.images,
          selectedImage = imagesArr[i]
        if (selectedImage.key === key) {
          selectedImage.selected = !selectedImage.selected
          if (selectedImage.selected) {
            this.updateSelectionCount({ type: 'increment' })
          } else {
            {
              this.updateSelectionCount({ type: 'decrement' })
            }
          }
          this.updateCurrImages(images)
        }
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
    .row {
      flex-grow: unset;
      flex-shrink: unset;
    }
  }
</style>
