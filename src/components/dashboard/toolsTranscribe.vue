<template>
  <v-card max-width="auto" class="">
    <v-row dense class="d-flex">
      <v-col cols="12" md="4">
        <router-link router :to="{ name: 'audioRecording' }">
          <v-card class="audio-gradient-card rounded-lg" dark>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-subtitle>Audio Recorder</v-card-subtitle>
              </div>

              <v-avatar class="ma-3" size="125" tile>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/cards/halcyon.png"
                ></v-img>
              </v-avatar>
            </div>
          </v-card>
        </router-link>
      </v-col>
      <v-col cols="12" md="4">
        <router-link router :to="{ name: 'screenRecording' }">
          <v-card class="screen-gradient-card rounded-lg" dark>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-subtitle>Screen Recorder</v-card-subtitle>
              </div>

              <v-avatar class="ma-3" size="125" tile>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/cards/halcyon.png"
                ></v-img>
              </v-avatar>
            </div>
          </v-card>
        </router-link>
      </v-col>
      <v-col cols="12" md="4">
        <router-link router :to="{ name: 'myUploads' }">
          <v-card class="upload-gradient-card rounded-lg" dark>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-subtitle>Upload File / YT links</v-card-subtitle>
              </div>

              <v-avatar class="ma-3" size="125" tile>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/cards/halcyon.png"
                ></v-img>
              </v-avatar>
            </div>
          </v-card>
        </router-link>
      </v-col>
    </v-row>
  </v-card>
</template>
  
<script>
import UploadFIle from "@/components/UploadFile.vue";

export default {
  data: () => ({}),
};
</script>
<style scoped>
.audio-gradient-card {
  background: linear-gradient(93.96deg, #5d5fef 6.46%, #f02b0da9 98.85%);
}
.screen-gradient-card {
  background: linear-gradient(93.96deg, #5d5fef 6.46%, #0d33f0a1 98.85%);
}
.upload-gradient-card {
  background: linear-gradient(93.96deg, #5d5fef 6.46%, #0df03792 98.85%);
}
a {
  text-decoration: none;
}
</style>
  