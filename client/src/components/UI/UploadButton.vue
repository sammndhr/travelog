<template>
  <v-card
    @click="handleUploadClick"
    class="figure-wrapper upload-wrapper white darken-1"
    outlined
  >
    <v-btn
      ref="uploadButton"
      class="upload-button"
      :loading="loading"
      :disabled="loading"
      fab
      retain-focus-on-click
      elevation="0"
      fixed
      color="transparent"
      @click="handleButtonClick"
    >
      <v-icon color="primary" x-large>mdi-cloud-upload</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        loader: null,
        loading: false
      }
    },
    computed: {
      ...mapState('data', {
        uploadStatus: state => state.status
      })
    },
    watch: {
      loader() {
        const l = this.loader
        this[l] = !this[l]
        if (this.uploadStatus.fetched) this[l] = false
        this.loader = null
      },
      uploadStatus(val) {
        if (val.uploading) this.loading = val.uploading

        if (this.uploadStatus.fetched) this.loading = false
      }
    },
    methods: {
      handleButtonClick() {
        this.loader = 'loading'
      },
      handleUploadClick() {
        this.$refs.uploadButton.click()
        this.$emit('uploadClicked')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .figure-wrapper {
    &.upload-wrapper {
      width: 100%;
      padding-top: 98.42%;
      position: relative;
      button.upload-button {
        height: 100%;
        width: 100%;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        bottom: 0 !important;
        right: 0 !important;
        background-color: transparent !important;
      }
    }
  }
</style>
