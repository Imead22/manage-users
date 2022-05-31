export default {
  data() {
    return {
      isDataValid: false,
      // Правила валидации
      rules: {
        // Обязательно к заполнению
        required: value => {
          if (value instanceof Array && value.length === 0) {
            return 'Обязательно для заполнения';
          }
          return !!value || 'Обязательно для заполнения';
        },
        phone: value => {
          if (value) {
            let valid = false;
            let error = '';
            let valNumber = value.match(/\d/g);
            const pattern = /([^0-9-()])+/iu;
            if (!pattern.test(value) && valNumber && valNumber.length >= 6 && parseInt(value) !== 0) {
              valid = true;
            } else {
              if (valNumber && valNumber.length < 6 || parseInt(value) === 0) {
                error = 'Минимальная длина равна 6';
              }
              let regex = value.match(pattern);
              if (regex) {
                error = 'Недопустимый символ: ' + regex[0];
              }
            }
            return valid || error;
          }
          return true;
        },
        email: value => {
          if (value) {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
          return true;
        },
        // Мин/макс размер текста (от, до)
        size: (min, max) => [
          value => value.length >= min || `Минимум ${min} символов!`,
          value => value.length <= max || `Максимум ${max} символов!`,
        ],
        initials: value => {
          if (value) {
            let valid = false;
            let error = '';
            let pattern = /[^A-Za-zА-Яа-яЁё -]+/iu;
            if (!pattern.test(value) && value.toString().length >= 2 || !value) {
              valid = true;
            } else {
              if (value.toString().length < 2) {
                error = `Минимальное количество символов 2`;
              }
              let regex = value.match(pattern);
              if (regex) {
                error = `Недопустимый символ: ` + regex[0];
              }
            }
            return valid || error;
          }
          return true;
        },
        password: value => {
          //можно добавить проверку сложности пароля
          if (value) {
            let valid = false;
            let error = '';
            const pattern = /[^0-9A-Za-z]+/iu;
            if (!pattern.test(value) && value.toString().length >= 6 || !value) {
              valid = true;
            } else {
              if (value.toString().length < 6) {
                error = `Минимальное количество символов 6`;
              }
              let regex = value.match(pattern);
              if (regex) {
                error = `Недопустимый символ: ` + regex[0];
              }
            }
            return valid || error;
          }
          return true;
        },
      },
    };
  },
  methods: {
    /**
     * Запустить валидацию VuetifyForms основных полей ввода данных
     * @returns {undefined}
     */
    validateForms() {
      this.$refs.dataForm.validate();
    },
  },
};
