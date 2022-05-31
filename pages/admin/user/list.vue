<template>
  <div>
    <client-only>
      <div>
        <v-card flat>
          <v-row justify="center">
            <v-col cols="12" md="2">
              <v-select v-model="fetchParams.searchRequest"
                        :items="searchItems()"
                        item-value="value"
                        item-text="text"
                        label="Что ищем"
                        color="indigo darken-3"
                        item-color="indigo darken-3"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="fetchParams.searchText"
                            @keyup.enter="loadUserList()"
                            label="Строка поиска"
                            :error-messages="errors.searchInput"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-btn depressed light large
                     color="yellow darken-1"
                     @click="loadUserList()"
              >
                <v-icon>mdi-magnify</v-icon>
                Найти
              </v-btn>
              <v-btn depressed light large
                     color="yellow darken-1"
                     @click="resetFilters(); loadUserList();"
              >
                <v-icon>mdi-arrow-u-left-top</v-icon>
                Сбросить фильтры
              </v-btn>
            </v-col>
          </v-row>
          <v-data-table
            ref="usersTable"
            :headers="tableHeaders"
            :items="users"
            loading-text="Загрузка..."
            :loading="loading"
            :page.sync="fetchParams.page"
            hide-default-footer
            dense
          >
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn icon
                         v-bind="attrs"
                         v-on="on"
                         :to="{name: 'adminUserEdit', params: {userId: item.id}}"
                  >
                    <v-icon color="green">mdi-circle-edit-outline</v-icon>
                  </v-btn>
                </template>
                <span>Редактировать</span>
              </v-tooltip>
            </template>
            <template v-slot:item.phone="{ item }">
              {{ item.phone | phoneNumber }}
            </template>
            <template v-slot:item.created_at="{ item }">
              {{ item.created_at | prettyDateNumeric }}
            </template>
            <template v-slot:item.updated_at="{ item }">
              {{ item.updated_at | prettyDateNumeric }}
            </template>
          </v-data-table>
        </v-card>
      </div>
    </client-only>
  </div>
</template>

<script>

export default {
  name: 'adminUserList',
  layout: 'admin',
  data() {
    return {
      loading: false,
      users: [],
      fetchParams: {
        searchRequest: 'name',
        searchText: '',
        page: 1,
      },
      tableHeaders: [
        {value: 'action', searchable: false},
        {text: 'id', value: 'id', sortable: false, searchable: false},
        {text: 'Имя входа', value: 'login', sortable: false,},
        {text: 'Фамилия', value: 'family_name', sortable: false},
        {text: 'Имя', value: 'first_name', sortable: false},
        {text: 'Отчество', value: 'middle_name', sortable: false},
        {text: 'Email', value: 'email', sortable: false},
        {text: 'Телефон', value: 'phone', sortable: false},
        {text: 'Дата создания', value: 'created_at', sortable: false},
        {text: 'Дата изменения', value: 'updated_at', sortable: false},
      ],
      errors: {
        searchInput: null,
      },
    };
  },
  created() {
    this.loadUserList();
  },
  methods: {
    /**
     * Загрузить список пользователей;
     * @returns {undefined}
     */
    loadUserList() {
      this.errors.searchInput = null;
      this.loading = true;
      this.$axios.$get('/users.json', {
        params: {
          ...this.fetchParams,
        },
        withCredentials: true
      })
        .then((result) => {
          this.users = result.data;
          this.loading = false;
        })
        .catch((e) => {
          let errorMessages = ['Произошла ошибка во время поиска.'];
          if (e.response.status === 422) {
            Object.values(e.response.data.errors).forEach(
              (set) => errorMessages.push(...set)
            );
            errorMessages = errorMessages.join('\n');
          }
          this.errors.searchInput = errorMessages;
          this.loading = false;
        });
    },
    /**
     * Сбросить поисковые фильтры.
     * @return {undefined}
     */
    resetFilters() {
      this.fetchParams = {
        searchRequest: 'name',
        searchText: '',
        page: 1,
      };
    },
    /**
     * Отсекаем из заголовков таблицы наименования, для вывода в поиске
     */
    searchItems() {
      return this.tableHeaders.filter(function (item) {
        return item.searchable !== false
      });
    },
  },
  head() {
    return {
      title: 'Пользователи',
    };
  },
};
</script>

<style lang="scss">
.row {
  margin-top: 0;
}

.col-md-6, .col-md-4, .col-md-2 {
  padding-bottom: 0;
}
</style>
