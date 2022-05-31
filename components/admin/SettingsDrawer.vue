<template>
  <div>
    <v-btn
      title="Развернуть панель настроек и сохранения"
      @click.stop="shown = !shown"
      color="indigo darken-2"
      class="btn-settings"
      fixed right dark
    >
      <v-icon>mdi-cog-outline</v-icon>
    </v-btn>
    <v-navigation-drawer
      touchless fixed right
      :permanent="shown"
      v-model="shown"
      :clipped="true"
      width="400px"
    >
      <v-card elevation="5" class="card-right-drawer">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="12">
              <v-row>
                <v-col cols="2">
                  <v-btn
                    title="Свернуть панель настроек и сохранения"
                    @click.stop="shown = !shown"
                    color="indigo darken-2"
                    fixed left dark large
                    class="btn-settings"
                  >
                    <v-icon>mdi-cog-off-outline</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="10">
                  <slot name="saveButton"/>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <slot name="removeButton"/>
                </v-col>
              </v-row>
              <slot name="drawerContent"/>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "AdminSettingsDrawer",
  data() {
    return {
      shown: false,
    };
  },
};
</script>

<style lang="scss">
  .card-right-drawer {
    overflow-y: auto;
    top: 50px;
    bottom: 10px;
  }
  .btn-settings {
    z-index: 1;
  }
</style>
