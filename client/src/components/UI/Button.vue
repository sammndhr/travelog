<template>
  <v-btn
    :disabled="disabled"
    dark
    elevation="3"
    class="ma-2"
    :style="{
      backgroundColor: disabled ? 'rgba(0, 0, 0, 0.5) !important' : ''
    }"
    color="primary"
    @click="handleClick"
    :to="link"
  >
    {{ text }}
  </v-btn>
</template>
<script>
  import { mapState } from 'vuex'
  export default {
    name: 'Button',
    data() {
      return {
        loader: null,
        uploading: false
      }
    },
    props: {
      link: {
        default: '',
        required: false,
        type: String
      },
      text: {
        default: 'Button',
        required: false,
        type: String
      },
      type: {
        default: '',
        required: false,
        type: String
      },

      disabled: {
        default: false,
        required: false,
        type: Boolean
      }
    },
    computed: {
      ...mapState('data', ['status'])
    },
    watch: {
      status(data) {
        if (data.uploading) this.loader = 'uploading'
        const l = this.loader
        if (data.fetched) {
          this[l] = false
          this.loader = null
        }
      },
      loader() {
        const l = this.loader
        this[l] = !this[l]
      }
    },
    methods: {
      handleClick() {
        this.$emit('clicked')
      }
    }
  }
</script>
<style></style>
