<template>
  <v-app dark>
    <div v-if="$auth.loggedIn && $auth.user.id">
      <v-navigation-drawer
        v-model="drawer"
        :mini-variant="miniVariant"
        :clipped="clipped"
        fixed
        app
      >
        <v-list>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"/>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar
        :clipped-left="clipped"
        fixed
        app
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
        <v-toolbar-title v-text="title"/>
        <v-spacer/>
        <v-btn
          icon
          @click.stop="rightDrawer = !rightDrawer"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main>
        <v-container>
          <Nuxt/>
        </v-container>
      </v-main>
      <v-navigation-drawer
        v-model="rightDrawer"
        :right="right"
        temporary
        fixed
      >
        <v-list>
          <v-list-item @click.stop="logout">
            <v-list-item-action>
              <v-icon light> mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-title>Выход</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-footer
        :absolute="!fixed"
        app
      >
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </v-footer>
    </div>
  </v-app>
</template>

<script>
import {mapState} from "vuex";

export default {
  computed: {
    ...mapState('user', {userStore: (state) => ({...state})}),
  },
  beforeMount() {
    this.$store.dispatch('user/loadUser', {}).then(() => {
      this.loading = false
      if (!this.userStore.id) {
        this.$nuxt.error({statusCode: 401, message: 'Ошибка авторизации'});
      }
    });
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Пользователи',
          to: '/admin/users'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Роли',
          to: '/admin/roles'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Панель управления'
    }
  },
  methods: {
    logout() {
      this.$auth.logout();
    },
  }
}
</script>
