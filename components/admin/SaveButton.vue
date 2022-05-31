<template>
  <v-btn
    color="indigo darken-2"
    depressed block large
    :disabled="disabled"
    :loading="loading"
    :dark="!disabled"
    form="data-form"
    target="_blank"
    type="submit"
  >
    Сохранить
  </v-btn>
</template>

<script>
export default {
  name: "AdminSaveButton",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    }
  },
};
</script>

<style lang="scss">

</style>
