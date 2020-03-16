<template>
  <GalleryEditTabs :galleryMapId="galleryMapId" />
</template>

<script>
  import GalleryEditTabs from '../GalleryEditTabs'

  export default {
    props: {
      galleryMapId: {
        type: String,
        default: ''
      }
    },
    components: {
      GalleryEditTabs
    }
  }
</script>

<style></style>
