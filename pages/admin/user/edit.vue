<template>
  <div>
    <v-form
      @submit.prevent="save"
      v-model="isDataValid"
      id="data-form"
      ref="dataForm"
    >
      <AdminSettingsDrawer>
        <template #saveButton>
          <AdminSaveButton :disabled="!isDataValid" :loading="loading"/>
        </template>
        <template #removeButton>
          <v-btn
            depressed large dark block
            color="indigo darken-2"
            @click.stop="!user.active ? deleteUser(user) : ''"
            :loading="loading"
            target="_blank"
            :disabled="!!user.active"
          >
            Удалить
          </v-btn>
        </template>
        <template #drawerContent>
          <v-row>
            <v-col cols="12" md="12">
              <h3>Id</h3>
              <span>{{ user.id }}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <h3>Дата создания</h3>
              <span>{{ user.created_at | moment("DD[.] MM[.] YYYY HH[:]MM") }}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <h3>Дата изменения</h3>
              <span>{{ user.updated_at | moment("DD[.] MM[.] YYYY HH[:]MM") }}</span>
            </v-col>
          </v-row>
        </template>
      </AdminSettingsDrawer>
      <v-row justify="center">
        <v-col cols=12 md="12">
          <v-row>
            <v-col cols="12" md="12">
              <h2>Основная информация</h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                :error-messages="errors['user.family_name']"
                :rules="[rules.required, rules.initials]"
                color="indigo darken-3"
                v-model="user.family_name"
                label="Фамилия"
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                :error-messages="errors['user.first_name']"
                :rules="[rules.required, rules.initials]"
                color="indigo darken-3"
                v-model="user.first_name"
                label="Имя"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                :error-messages="errors['user.middle_name']"
                :rules="[rules.initials]"
                v-model="user.middle_name"
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
                :error-messages="errors['user.phone']"
                label="Телефон"
                color="indigo darken-3"
                required
                :rules="[rules.required, rules.phone]"
                v-model="user.phone"
                prefix="+"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                :error-messages="errors['user.email']"
                label="Email"
                color="indigo darken-3"
                :rules="[rules.required, rules.email]"
                v-model="user.email"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                label="Пароль"
                :type="passwordShown ? 'text' : 'password'"
                :rules="[rules.required, rules.password]"
                v-model="user.password"
              >
                <template #append>
              <span
                :class="{'icon-password_active': passwordShown}"
                @click="passwordShown = !passwordShown;"
                class="icon-password"
              />
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                :error-messages="errors['user.secret_word']"
                label="Секретное слово"
                color="indigo darken-3"
                v-model="user.secret_word"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-dialog v-model="dialogDeleteUser" max-width="500px">
        <v-card>
          <v-card-title class="text-h6">Вы уверены что хотите удалить пользователя? Будут удалены все связанные с ним
            данные
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Отменить</v-btn>
            <v-btn color="blue darken-1" text @click="deleteUserConfirm">Да</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
    <v-snackbar v-model="alertShow"
                v-bind:timeout="4000"
    >{{ alert }}
    </v-snackbar>
  </div>
</template>

<script>
import adminEditPageValidationMixin from "../../../mixins/pages/editPageValidation";
import AdminSettingsDrawer from "../../../components/admin/SettingsDrawer";
import AdminSaveButton from "../../../components/admin/SaveButton";

export default {
  name: 'adminUserEdit',
  layout: 'admin',
  props: {
    userId: [Number, String],
  },
  mixins: [
    adminEditPageValidationMixin,
  ],
  components: {
    AdminSettingsDrawer,
    AdminSaveButton,
  },
  data() {
    return {
      user: {},
      loading: false,
      errors: {},
      dialogDeleteUser: false,
      rightDrawer: false,
      passwordShown: false,
      alert: '',
      alertShow: false,
    };
  },
  mounted() {
    this.loadUser();
    this.validateForms();
  },
  methods: {
    loadUser() {
      if (!this.userId) {
        return;
      }
      this.$axios.$get(`/user_${this.userId}.json`)
        .then((result) => {
          this.user = result;
        })
        .catch((e) => {
          this.alert = e.message;
          this.alertShow = true;
        });
    },
    save() {
      this.loading = true;
      this.$axios.$post('/api/admin/user/save', {
        user: this.user,
      }, {withCredentials: true})
        .then((result) => {
          this.user = result;
          this.alert = 'Успешно выполнено';
          this.alertShow = true;
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          this.alert = e.message;
          this.alertShow = true;
        });
    },
    /**
     * Вызов диалога на удаление пользователя
     */
    deleteUser() {
      this.dialogDeleteUser = true
    },
    /**
     * Подтверждение удаления участника
     */
    deleteUserConfirm() {
      let item = this.user;
      this.loading = true;
      this.$axios.$post(`/api/admin/user/remove`, {
        id: item.id
      }, {withCredentials: true})
        .then((result) => {
          this.loading = false;
          this.$router.push({name: 'adminUserList'});
          this.alert = result.message;
          this.alertShow = true;
        })
        .catch((e) => {
          this.loading = false;
          this.alert = e.message;
          this.alertShow = true;
        });
      this.closeDialog()
    },
    /**
     * Скрытие диалога
     */
    closeDialog() {
      this.dialogDeleteUser = false;
    },
  },
  head() {
    return {
      title: `${this.userId} - Редактирование пользователя`,
    };
  },
};
</script>

<style lang="scss">
.icon-password {
  background-position: center;
  background-image: url("static/icon/eye-closed.svg");
  width: 45px;
  height: 30px;
  cursor: pointer;

  &_active {
    background-image: url("static/icon/eye.svg");
  }
}
</style>
