<template>
  <v-app-bar
    fixed
    app
  >
    <v-toolbar-title v-text="title" />
    <v-spacer />
    <button v-if="!$auth.loggedIn || !userStore.id"
         @click="openSignIn"
    >
      Личный кабинет <v-icon>mdi-login</v-icon>
    </button>
    <div v-else>
      <button
        @click="$auth.logout();"
      >
        <v-icon>mdi-logout</v-icon>
      </button>
      <button
        @click="openAccountProfile();"
      >
        {{ userStore.first_name }}
      </button>
    </div>
  </v-app-bar>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "defaultMenu",
  props: ['title'],
  computed: {
    ...mapState('user', {userStore: (state) => ({ ...state })}),
  },
  beforeMount() {
    this.$store.dispatch('user/loadUser');
  },
  methods: {
    /**
     * Открыть личный кабинет.
     * @returns {undefined}
     */
    openAccountProfile() {
      this.$router.push({name: 'profile'});
    },
    /**
     * Открыть форму авторизации.
     * @returns {undefined}
     */
    openSignIn() {
      this.$router.push({name: 'signIn'});
    },
  }
}
</script>

<style scoped>

</style>
