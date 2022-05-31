import Axios from 'axios';

const API = {
  get: (params) => Axios.get('/user_1.json', {params}),
  patch: (id, data) =>
    Axios.patch(`/api/user/${id}`, data, {withCredentials: true}),
};

const getOwnProperties = (target, source) => Object.entries(source).reduce(
  (acc, [key, value]) => {
    if (target.hasOwnProperty(key)) {
      acc[key] = value;
    }
    return acc;
  }, {}
);

export default {
  actions: {
    /**
     * @description Загрузить данные пользователя.
     * @param {Object} params Fetch параметры.
     * @param {function} commit
     * @param {Object} state Состояние User.
     * @return {Promise<any>}
     */
    loadUser: ({commit,state}, params) => {
      return API.get(params).then(async ({data}) => {
          commit('SET_USER_FIELDS', data)
        })
        .catch((e) => {
          if (e.response) {
            if (e.response.status === 401) {
              commit('resetState')
            }
          }
        });
    },

    /**
     * @description Сохранить данные пользователя.
     * @param {function} commit
     * @param {Object}   state
     * @param {Object}   payload
     * @return {Promise<any>}
     */
    saveUser: async ({commit, state}, payload) => {
      const stage = getOwnProperties(state, payload);
      if (!Object.keys(stage).length) {
        return;
      }
      return API.patch(state.id, stage)
        .then(async ({data}) => commit('SET_USER_FIELDS', data))
        .catch(async ({response}) => {
          const errorMessages = ['Произошла ошибка при сохранении.'];
          if (422 === response.status) {
            Object.values(response.data.errors)
              .forEach((set) => errorMessages.push(...set));
          }
          throw new Error(errorMessages.join('\n'));
        });
    },

    logout({commit}){
      return new Promise((resolve, reject) => {
        commit('resetState')
        resolve()
      })
    },
  },

  getters: {

  },

  mutations: {
    /**
     * @description Установить обновлённые значения полей пользователя.
     * @param {Object} state  Хранилище.
     * @param {Object} fields Обновляемые поля.
     */
    SET_USER_FIELDS: (state, fields) => {
      Object.assign(state, getOwnProperties(state, fields));
    },
    resetState(state) {
        state.id = null;
        if($nuxt && $nuxt.$auth.loggedIn) {
          $nuxt.error({
            statusCode: 401,
            message: 'Ошибка авторизации',
          });
        }
    },
  },

  namespaced: true,

  state: () => ({
    id: null,
    login: '',
    family_name: '',
    first_name: '',
    middle_name: '',
    email: '',
    phone: '',
    secret_word: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
    created_at: '',
    updated_at: ''
  }),
};
