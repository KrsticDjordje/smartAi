<template>
  <v-container-fluid>
    <!-- Prvi red -->
    <v-row>
      <v-col cols="8">
        <!-- Sadržaj za prvu kolonu sa širinom 8 kolona -->
        <div><all-companies /></div>
      </v-col>
      <v-col cols="4">
        <!-- Sadržaj za drugu kolonu sa širinom 4 kolona -->
        <div><weather /></div>
      </v-col>
    </v-row>

    <!-- Drugi red -->
    <v-row>
      <v-col cols="6">
        <!-- Sadržaj za treću kolonu sa širinom 6 kolona -->

        <div><AllPacketItems /></div>
      </v-col>
      <v-col cols="6">
        <!-- Sadržaj za četvrtu kolonu sa širinom 6 kolona -->
        <div><all-packets /></div>
      </v-col>
    </v-row>

    <!-- Treći red -->
    <v-row>
      <v-col cols="12">
        <!-- Sadržaj za petu kolonu sa širinom 12 kolona -->
        <div><all-companies /></div>
      </v-col>
    </v-row>
  </v-container-fluid>
</template>

<script>
import weather from "@/components/dashboard/weather.vue";
import AllCompanies from "@/components/adminPanel/AllCompanies.vue";
import AllPacketItems from "@/components/adminPanel/AllPacketItems.vue";
import AllPackets from "@/components/adminPanel/AllPackets.vue";
export default {
  components: {
    weather,
    AllCompanies,
    AllPacketItems,
    AllPackets,
  },
};
</script>
<style scoped>
.content-container.box {
  margin: 0 !important;
}
</style>
