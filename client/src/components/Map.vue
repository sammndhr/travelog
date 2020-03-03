<template>
  <v-col align-self="start" cols="12" md="7" xl="6">
    <v-card
      class="map-wrapper"
      :class="$vuetify.breakpoint.xs ? 'mobile' : ''"
      :style="{ height: mainHeight }"
      outlined
    >
      <MglMap
        id="map"
        :zoom="zoom"
        class="map"
        :accessToken="accessToken"
        :mapStyle="mapStyle"
        @load="onMapLoaded"
      >
        <MglMarker
          v-for="feature in geoJson.features"
          :anchor="'top'"
          :key="feature.properties.name"
          :coordinates="feature.geometry.coordinates"
        >
          <div slot="marker" class="marker">
            <img
              class="marker-img"
              :src="feature.properties.url"
              alt="marker"
            />
          </div>
          <MglPopup :anchor="anchor">
            <div>
              <p>{{ feature.properties.dateCreated }}</p>
              <p>
                {{
                  `${feature.properties.location.region}, ${feature.properties.location.country}`
                }}
              </p>
            </div>
          </MglPopup>
        </MglMarker>
        <MglGeojsonLayer
          :sourceId="sourceId"
          layerId="images"
          :layer="geoJsonlayer"
        />
      </MglMap>
    </v-card>
  </v-col>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  import { MglMap, MglPopup, MglGeojsonLayer, MglMarker } from 'vue-mapbox'
  import Mapbox from 'mapbox-gl/dist/mapbox-gl.js'
  import { filterInBoundsGeoJson } from '@/utils'

  export default {
    components: {
      MglMap,
      MglMarker,
      MglGeojsonLayer,
      MglPopup
    },
    data() {
      return {
        accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
        mapStyle: 'mapbox://styles/mapbox/streets-v11',
        sourceId: 'image',
        anchor: 'bottom',
        // map: null, //will break. Don't uncomment
        zoom: 1,
        geoJsonlayer: {
          id: 'images',
          type: 'symbol',
          source: 'image',
          replaceSource: true,
          layout: {
            'icon-image': 'transparentPixel',
            'icon-size': 0.01
          }
        }
      }
    },

    computed: {
      ...mapGetters('data', ['hasLocationGeoJson']),
      ...mapState('data', ['hasLocation']),
      ...mapState(['mainHeight']),
      geoJson() {
        const geoJsonEmpty = {
          type: 'FeatureCollection',
          features: []
        }
        return this.hasLocation ? this.hasLocationGeoJson : geoJsonEmpty
      }
    },

    watch: {
      // Need to watch geoJson cause filteredGeoJson isn't reactive to geoJson only (map.on('moveend') is another one)
      geoJson() {
        if (!this.map) return
        this.filter()
      }
    },

    methods: {
      ...mapActions('data', ['updateFilteredGeoJson']),

      filter() {
        const geoJson = this.geoJson,
          // works fine without map being set in data
          bounds = this.map.getBounds()
        const filteredGeoJson = filterInBoundsGeoJson({ bounds, geoJson })
        this.updateFilteredGeoJson(filteredGeoJson)
      },

      createImage(width) {
        const bytesPerPixel = 4,
          data = new Uint8Array(width * width * bytesPerPixel)

        for (let x = 0; x < width; x++) {
          for (let y = 0; y < width; y++) {
            const offset = (y * width + x) * bytesPerPixel
            data[offset + 0] = 0
            data[offset + 1] = 0
            data[offset + 2] = 0
            data[offset + 3] = 255
          }
        }
        return data
      },

      onMapLoaded(event) {
        const map = event.map,
          width = 0.5,
          data = this.createImage(width),
          vm = this
        this.map = map
        map.addImage('transparentPixel', {
          width: width,
          height: width,
          data: data
        })
        map.addSource('image', {
          type: 'geojson',
          data: this.geoJson
        })

        this.filter()

        map.on('moveend', function() {
          vm.filter()
        })
      }
    },

    created() {
      this.mapbox = Mapbox
    }
  }
</script>

<style lang="scss" scoped>
  .marker-img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    object-fit: cover;
    cursor: pointer;
    &.rotate-1 {
      transform: rotate(0deg);
    }
    &.rotate-3 {
      transform: rotate(180deg);
    }
    &.rotate-6 {
      transform: rotate(90deg);
    }
    &.rotate-8 {
      transform: rotate(270deg);
    }
  }

  .map-wrapper {
    min-width: min-content;

    &.mobile {
      height: 60vh;
    }
    .map {
      height: 100%;
      min-height: 400px;
    }
  }
</style>
