<template>
  <v-container fluid style="height:90vh;">
    <v-row justify="center" class="secondary--text my-9">
      <div class="py-2 px-8 support-main">
        <h1>My images have missing location.</h1>
        <h2>
          Why don't the photos I uploaded get mapped?
        </h2>
        <p>
          If you're exporting pictures from icloud, make sure you're exporting
          with location data.
        </p>
        <p>
          After selecting images you want to export, from the menu bar, click on
          File -> Export
        </p>
        <p>
          <v-img class="support-image" src="/images/support-q-01.png"></v-img>
        </p>
        <p>
          Make sure to check the 'Location Information' checkbox before clicking
          export.
        </p>
        <p>
          <v-img class="support-image" src="/images/support-q-02.png"></v-img>
        </p>
      </div>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Support'
  }
</script>

<style lang="scss" scoped>
  .support-main {
    max-width: 700px;
    width: 100%;

    h1,
    p {
      margin-bottom: 1rem;
    }
    h2 {
      margin-bottom: 2rem;
    }
    .support-image {
      max-width: 650px;
    }
  }
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
