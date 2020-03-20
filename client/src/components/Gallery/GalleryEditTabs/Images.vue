<template>
  <masonry class="masonary" :cols="cols" :gutter="gutter">
    <UploadButton @uploadClicked="handleUploadClick" />
    <div
      v-for="(image, i) in images"
      :key="image.key"
      class="figure-wrapper"
      @click="handleClick({ i, key: image.key })"
    >
      <figure
        :class="[{ selected: image.selected }, 'figure']"
        @mouseenter="handleMouseEnter(i)"
        @mouseleave="handleMouseLeave(i)"
      >
        <template v-if="edit">
          <v-icon
            class="select-btn-background"
            v-show="!image.selected && !hovering[i]"
            color="white"
            style="opacity: 0.5;"
          >
            mdi-checkbox-blank-circle-outline
          </v-icon>

          <v-icon
            v-show="hovering[i]"
            class="select-btn"
            color="white"
            style="opacity: 0.8;"
          >
            mdi-checkbox-marked-circle
          </v-icon>

          <v-icon
            class="select-btn-background"
            v-show="image.selected"
            color="white"
          >
            mdi-checkbox-blank-circle
          </v-icon>
          <v-icon v-show="image.selected" class="select-btn" color="primary">
            mdi-checkbox-marked-circle
          </v-icon>
        </template>
        <img class="gallery-image" :src="image.url" alt="gallery-img.jpeg" />
      </figure>
    </div>
  </masonry>
</template>

<script>
  import UploadButton from '@/components/UI/UploadButton'
  export default {
    name: 'Images',
    props: {
      images: {
        type: Array,
        default: () => [],
        required: true
      },

      edit: {
        type: Boolean,
        default: false,
        required: true
      }
    },
    data() {
      return {
        hovering: new Array(this.images.length).fill(false),
        gutter: { default: '8px' },
        cols: { default: 4, 1600: 3, 1300: 2 }
      }
    },
    components: {
      UploadButton
    },
    watch: {
      images(val) {
        this.hovering = new Array(val.length).fill(false)
      }
    },
    methods: {
      handleClick({ i, key }) {
        this.$emit('clicked', { i, key })
      },

      handleMouseEnter(i) {
        const hovering = JSON.parse(JSON.stringify(this.hovering))
        hovering[i] = true
        this.hovering = hovering
      },

      handleMouseLeave(i) {
        const hovering = JSON.parse(JSON.stringify(this.hovering))
        hovering[i] = false
        this.hovering = hovering
      },

      handleUploadClick() {
        this.$emit('uploadClicked')
      }
    }
  }
</script>
<style lang="scss" scoped>
  /* common styles */
  .figure-wrapper {
    cursor: pointer;
    position: relative;
    .figure {
      border: none;
      &.selected {
        border: 8px solid rgba(255, 255, 255, 0.4);
      }
      .select-btn,
      .select-btn-background {
        z-index: 5;
        top: 2px;
        right: 0;
        position: absolute;
        border-radius: 50%;
      }
    }
  }
  /* Desktop styles */
  .masonary {
    .figure-wrapper {
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
      }
      .gallery-image {
        max-width: 400px;
        width: 100%;
        display: block;
      }
    }
  }
</style>
