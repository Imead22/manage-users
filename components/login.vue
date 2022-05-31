<template>
  <div>
    <v-card width="300px" elevation="5" v-if="!$nuxt.$auth.loggedIn || !$nuxt.$auth.user.id">
      <v-card-title>
        Вход
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form
            v-model="isInputsDataValid"
            @submit.prevent="login"
            id="login-data-form"
          >
            <v-row>
              <v-text-field
                @input="errors.login='';"
                :rules="rules.email"
                v-model="email"
                label="Логин"
              >
              </v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                :error-messages="errors.login"
                :rules="[rules.required]"
                @input="errors.login='';"
                v-model="password"
                type="password"
                label="Пароль"
              >
                <template #message="data">
                  <div>{{ data.message }}</div>
                </template>
              </v-text-field>
            </v-row>
          </v-form>
          <v-row>
            <v-btn
              :disabled="!isInputsDataValid"
              form="login-data-form"
              type="submit"
            >
              Войти
            </v-btn>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import authenticationMixin from '../mixins/authentication'

export default {
  name: "login",
  mixins: [authenticationMixin],
  data() {
    return {
      isInputsDataValid: false,
      password: '',
      email: '',
      errors: {
        login: '',
      },
      rules: {
        email: [
          v => !!v || 'E-mail обязателен',
          v => /.+@.+\..+/.test(v) || 'Некорректный Email',
        ],
        required: value => {
          if (value instanceof Array && value.length === 0) {
            return 'Заполните поле.';
          }
          return !!value || 'Заполните поле.';
        },
      },
    };
  },
  beforeMount() {
    if($nuxt.$auth.loggedIn && $nuxt.$auth.user.id){
      this.$router.push({ name: 'profile' });
    }
  },
  methods: {
    login() {
      this.refreshToken()
        .then(
          () => {
            this.authenticate(this.email, this.password).then(() => {
              this.email = '';
              this.password = '';
              this.$router.push({ name: 'profile' });
            })
              .catch(() => {
                this.errors.login = 'Неверный логин или пароль';
              });
          }
        );
    },
  }
}
</script>

<style lang="scss">

</style>
