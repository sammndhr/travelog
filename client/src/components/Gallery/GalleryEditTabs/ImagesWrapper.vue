<template>
  <v-col
    class="overflow"
    :class="{ 'overflow-mobile': $vuetify.breakpoint.xs }"
  >
    <MobileImages
      @uploadClicked="$refs.fileInput.click()"
      @clicked="handleClickImage"
      :edit="edit"
      v-if="$vuetify.breakpoint.xs"
      :images="currImages.images"
    />

    <Images
      @uploadClicked="$refs.fileInput.click()"
      @clicked="handleClickImage"
      :edit="edit"
      v-else
      :images="currImages.images"
    />

    <input
      hidden
      ref="fileInput"
      id="upload-images"
      type="file"
      accept="image/*"
      multiple="{true}"
      @change="handleChange"
    />
  </v-col>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import MobileImages from './MobileImages'
  import Images from './Images'
  import { supportsFileReader, handleImages } from '@/utils/'

  export default {
    name: 'ImagesWrapper',
    components: {
      MobileImages,
      Images
    },

    props: {
      edit: { default: false, required: true, type: Boolean },
      galleryId: { default: '', required: false, type: String },
      currImages: { default: () => ({}), required: true, type: Object }
    },

    computed: {
      ...mapState('data', ['isEdit', 'mapped'])
    },

    methods: {
      ...mapActions('data', [
        'updateCurrImages',
        'updateSelectionCount',
        'uploadAll'
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
      },

      handleClickImage({ i, key }) {
        if (!this.edit) this.$emit('indexChanged', i)
        else {
          this.toggleSelect({ i, key })
        }
      },

      async handleChange(e) {
        if (!supportsFileReader()) {
          console.log(
            'Sorry, your web browser does not support the FileReader API.'
          )
          return
        }
        const files = e.target.files,
          images = await handleImages(files)

        this.uploadAll(images)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .overflow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;

    /* mobile styles */
    &.overflow-mobile {
      display: flex;
      align-content: center;
      align-items: center;
    }
  }
</style>
