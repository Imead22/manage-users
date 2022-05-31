<template>
  <div>
    <div @click="shown=!shown" class="profile__edit-password">
      {{ 'Изменить пароль' }}
    </div>
    <div v-if="shown">
      <div>
        <label>
          {{ 'Старый пароль' }}
        </label>
        <v-text-field
          :type="oldPasswordShown ? 'text' : 'password'"
          @change="oldPasswordShown=false"
          @input="oldPasswordShown=false"
          @blur="oldPasswordShown=false"
          v-model="current_password"
          solo
        >
          <template #append>
              <span
                :class="{'icon-password_active': oldPasswordShown}"
                @click="oldPasswordShown = !oldPasswordShown;"
                class="icon-password"
              />
          </template>
        </v-text-field>
      </div>
      <div>
        <label>
          {{ 'Новый пароль' }}
        </label>
        <v-text-field
          :type="passwordShown ? 'text' : 'password'"
          @change="passwordShown=false"
          @input="passwordShown=false"
          @blur="passwordShown=false"
          :rules="[rules.required, rules.password]"
          v-model="new_password"
          solo
        >
          <template #append>
              <span
                :class="{'icon-password_active': passwordShown}"
                @click="passwordShown = !passwordShown;"
                class="icon-password"
              />
          </template>
        </v-text-field>
      </div>
      <div>
        <label>
          {{ 'Подтверждение пароля' }}
        </label>
        <v-text-field
          :type="repeatPasswordShown ? 'text' : 'password'"
          @change="repeatPasswordShown=false"
          @input="repeatPasswordShown=false"
          @blur="repeatPasswordShown=false"
          v-model="new_password_confirmation"
          :rules="[passwordConfirmationRule]"
          solo
        >
          <template #append>
              <span
                :class="{'icon-password_active': repeatPasswordShown}"
                @click="repeatPasswordShown = !repeatPasswordShown;"
                class="icon-password"
              />
          </template>
        </v-text-field>
      </div>
    </div>
  </div>
</template>

<script>
import editPageValidationMixin from "../../mixins/pages/editPageValidation";

export default {
  name: "profileChangePassword",
  mixins: [
    editPageValidationMixin,
  ],
  data() {
    return {
      shown: false,
      passwordShown: false,
      oldPasswordShown: false,
      repeatPasswordShown: false,
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    };
  },
  computed: {
    /**
     * Правило проверки нового пароля и его подтверждения на совпадение.
     * Игнорируем, если оба - пустые строки.
     * @returns {(function(): (boolean|*))|*}
     */
    passwordConfirmationRule() {
      return () => {
        if (this.isNewPasswordEmptyString)
          return true;
        return (this.newPasswordsMatch) || 'Пароли не совпадают!';
      };
    },
    /**
     * Совпадают ли новый пароль и его подтверждение.
     * @returns {boolean}
     */
    newPasswordsMatch() {
      return (this.new_password === this.new_password_confirmation) && !this.isNewPasswordEmptyString;
    },
    /**
     * Является ли новый пароль и его подтверждение пустыми строками.
     * @returns {boolean}
     */
    isNewPasswordEmptyString() {
      return this.new_password === '' && this.new_password_confirmation === '';
    },
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
.profile__edit-password {
    font-size: 16px;
    line-height: 16px;
    text-decoration: underline;
    cursor: pointer;
    margin: 0 0 30px 0;
}
</style>
