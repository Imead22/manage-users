export default {
  methods: {
    /**
     * @description Выполнить аутентификацию.
     * @param {String} email    Почта.
     * @param {String} password Пароль.
     * @return {Promise<any>}
     */
    authenticate(email, password) {
      return this.$auth.loginWith("local", {
        data: {
          email: email,
          password: password,
        }
      })
    },
    /**
     * @description Обновить XSRF токен.
     * @return {Promise<any>}
     */
    refreshToken() {
      return this.$axios.$get("/sanctum/csrf-cookie", {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true,
      });
    },
  },
};
