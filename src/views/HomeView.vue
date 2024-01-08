<template>
  <v-container-fluid>
    <!-- Prvi red -->
    <v-row>
      <v-col cols="12" md="12">
        <div><tools-transcribe /></div>
      </v-col>
    </v-row>
    <!-- Drugi red -->
    <v-row>
      <v-col cols="12" md="12">
        <div><all-users /></div>
      </v-col>
    </v-row>
  </v-container-fluid>
</template>

<script>
import weather from "@/components/dashboard/weather.vue";
import AllUsers from "@/components/adminPanel/AllUsers.vue";
import ToolsTranscribe from "@/components/dashboard/toolsTranscribe.vue";
export default {
  components: {
    weather,
    AllUsers,
    ToolsTranscribe,
  },
};
</script>,
    AllEditors
<style scoped>
.content-container.box {
  margin: 0 !important;
}
</style>
