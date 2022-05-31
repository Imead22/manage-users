module.exports = [
  /** Main */
  {
    name: 'main',
    path: '/',
    component: 'pages/index.vue',
    meta: {
      ru: {
        title: 'Главная',
      },
      en: {
        title: 'Home'
      }
    },
  },
  /** Admin */
  {
    name: 'adminUserList',
    path: '/admin',
    component: 'pages/admin/user/list.vue'
  },
  {
    name: 'adminUserEdit',
    path: '/admin/users/edit/:userId',
    component: 'pages/admin/user/edit.vue',
    props: true,
  },
  /** Profile */
  {
    name: 'profile',
    path: '/lk',
    component: 'pages/lk/profile.vue',
  },
  /** Auth */
  {
    name: 'signIn',
    path: '/signIn',
    component: 'pages/signIn.vue'
  },
]
