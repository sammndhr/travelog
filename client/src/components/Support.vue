<template>
  <v-container fluid style="height:90vh;">
    <v-row class="ma-8" justify="center" no-gutters>
      <v-col cols="12" md="4">
        <v-card flat class="mx-auto" max-width="344">
          <v-card-text>
            <v-icon x-large color="secondary">mdi-comment-question</v-icon>

            <p class="title secondary--text font-weight-bold">
              General Questions
            </p>
            <div class="secondary--text ">
              <router-link
                class="support-link secondary--text"
                to="/support/missing-location-images"
              >
                Missing location images.
              </router-link>
            </div>
          </v-card-text>
          <!-- <v-card-actions>
            <v-btn text class="primary--text">
              View All
            </v-btn>
          </v-card-actions> -->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Support'
  }
</script>

<style lang="scss" scoped>
  .support-link {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  .pa-4 {
    background-color: palegoldenrod;
  }
</style>
