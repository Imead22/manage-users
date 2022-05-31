<template>
  <div v-if="$auth.loggedIn && userStore.id">
    <client-only>
      <v-form
        @submit.prevent="save"
        id="profile-data-form"
      >
        <v-row justify="center">
          <v-col cols=12 md="12">
            <v-row>
              <v-col cols="12" md="12">
                <h2>Ваш профиль</h2>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  :error-messages="errors['userStore.family_name']"
                  :rules="[rules.required, rules.initials]"
                  color="indigo darken-3"
                  v-model="userStore.family_name"
                  label="Фамилия"
                />
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  :error-messages="errors['userStore.first_name']"
                  :rules="[rules.required, rules.initials]"
                  color="indigo darken-3"
                  v-model="userStore.first_name"
                  label="Имя"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  :error-messages="errors['userStore.middle_name']"
                  :rules="[rules.initials]"
                  v-model="userStore.middle_name"
                  color="indigo darken-3"
                  label="Отчество"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <h3>Данные при регистрации</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  :error-messages="errors['userStore.phone']"
                  label="Телефон"
                  color="indigo darken-3"
                  required
                  :rules="[rules.required, rules.phone]"
                  v-model="userStore.phone"
                  prefix="+"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  :error-messages="errors['userStore.email']"
                  label="Email"
                  color="indigo darken-3"
                  :rules="[rules.required, rules.email]"
                  v-model="userStore.email"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  :error-messages="errors['userStore.secret_word']"
                  label="Секретное слово"
                  color="indigo darken-3"
                  v-model="userStore.secret_word"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
      <v-row>
        <v-col cols="12" md="12">
          <ProfileChangePassword
            ref="changePassword"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <v-btn
            :disabled="!!Object.keys(errors).filter(key => !!errors[key]).length || loading"
            form="profile-data-form"
            type="submit"
          >
            {{ 'Сохранить' }}
          </v-btn>
        </v-col>
      </v-row>
      <v-snackbar v-model="alertShow"
                  v-bind:timeout="4000"
      >{{ alert }}
      </v-snackbar>
    </client-only>
  </div>
</template>

<script>
import editPageValidationMixin from "../../mixins/pages/editPageValidation";
import ProfileChangePassword from "../../components/profile/ChangePassword";
import {mapState} from 'vuex';

export default {
  name: 'profile',
  layout: 'lk',
  mixins: [
    editPageValidationMixin,
  ],
  components: {
    ProfileChangePassword,
  },
  data() {
    return {
      loading: false,
      errors: {},
      passwordShown: false,
      alert: '',
      alertShow: false,
    };
  },
  computed: {
    ...mapState('user', {userStore: (state) => ({...state})}),
  },
  beforeMount() {
    this.$store.dispatch('user/loadUser', {}).then(() => {
      this.loading = false
      if (!this.userStore.id || !this.$auth.loggedIn) {
        this.$nuxt.error({statusCode: 401, message: 'Ошибка авторизации'});
      }
    });
  },
  methods: {
    /**
     * Собрать данные с полей объекта пользователя.
     * @return {Object}
     */
    collect() {
      return Object.entries(this.userStore).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    },
    /**
     * Получить данные из компонента изменения пароля.
     * @returns {Object}
     */
    getResetPasswordData() {
      if (!this.$refs.changePassword) {
        return {current_password: '', new_password: '', new_password_confirmation: ''};
      }
      return {
        current_password: this.$refs.changePassword.current_password,
        new_password: this.$refs.changePassword.new_password,
        new_password_confirmation: this.$refs.changePassword.new_password_confirmation,
      };
    },
    /**
     * Сохранить новые данные пользователя.
     * @return {undefined}
     */
    save() {
      this.loading = true;
      this.$store.dispatch('user/saveUser', {
        ...this.collect(),
        ...this.getResetPasswordData(),
      })
        .then(() => {
          this.alert = 'Успешно выполнено';
          this.alertShow = true;
        })
        .catch((e) => {
          this.alert = e.message;
          this.alertShow = true;
        })
        .finally(() => this.loading = false);
    },
  },
  head() {
    return {
      title: `Личный кабинет`,
    };
  },
}
</script>

<style scoped>

</style>
