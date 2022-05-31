<template>
  <v-app dark>
    <Menu :title="'Личный кабинет'"/>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Menu from '../components/Menu.vue';

export default {
  components: {
    Menu
  },
  data() {
    return {
      title: 'Личный кабинет',
    }
  }
}
</script>
