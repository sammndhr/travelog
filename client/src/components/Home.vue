<template>
  <v-container class="px-12">
    <v-row
      align="center"
      justify="space-between"
      :class="$vuetify.breakpoint.xs ? 'text-center' : ''"
    >
      <v-col md="4" cols="12" :class="{ 'order-1': $vuetify.breakpoint.xs }">
        <template v-if="register">
          <Register
            @backButtonClicked="handleBackButtonClicked"
            :cols="{ sm: 12, md: 12 }"
          />
        </template>
        <template v-else>
          <h1 class="display-1 font-weight-bold mb-3">
            Log your travels.
          </h1>
          <template v-if="!loggedIn">
            <p class="subheading font-weight-regular">
              Get started. Create an account
            </p>
            <Button text="Register" @clicked="handleClickRegister" />
          </template>
          <template v-else>
            <v-btn
              to="/log"
              class="title"
              text
              color="primary"
              style="padding-left: 0;"
            >
              Get started.
            </v-btn>
          </template>
        </template>
      </v-col>
      <v-col md="8" cols="12" :class="{ 'order-0': $vuetify.breakpoint.xs }">
        <v-img src="/images/landing.png"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  import Button from '@/components/UI/Button'
  import Register from '@/components/Auth/Register'
  export default {
    name: 'Landing',

    components: {
      Register,
      Button
    },

    data() {
      return {
        loggedIn: false,
        register: false
      }
    },

    computed: {
      ...mapState('account', ['status'])
    },

    methods: {
      handleBackButtonClicked() {
        this.register = false
      },
      handleClickRegister() {
        this.register = true
      }
    },

    mounted() {
      this.loggedIn = this.status.loggedIn
    }
  }
</script>
<style lang="scss" scoped></style>
