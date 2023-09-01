<template>
  <v-container>
    <!-- Prvi red -->
    <v-row>
      <v-col cols="8">
        <!-- Sadržaj za prvu kolonu sa širinom 8 kolona -->
        <div>Prva kolona (8)</div>
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
        <div>Treća kolona (6)</div>
      </v-col>
      <v-col cols="6">
        <!-- Sadržaj za četvrtu kolonu sa širinom 6 kolona -->
        <div>Četvrta kolona (6)</div>
      </v-col>
    </v-row>

    <!-- Treći red -->
    <v-row>
      <v-col cols="12">
        <!-- Sadržaj za petu kolonu sa širinom 12 kolona -->
        <div>Peta kolona (12)</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import weather from "@/components/dashboard/weather.vue";
export default {
  components: {
    weather,
  },
};
</script>
