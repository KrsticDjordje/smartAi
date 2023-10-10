<template>
  <div>
    <div
      class="mx-auto transcriptionBox content-container box"
      style="padding: 10px"
      v-for="transcription in transcriptions"
      :key="transcription.id"
    >
      <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>
      <v-card-text>
        <span class="mdi mdi-timer-edit"></span> 02.05.2023. - dodati na
        API</v-card-text
      >
      <div class="d-flex align-items-center">
        <v-card-title>{{ transcription.live_transcription_name }}</v-card-title>
        <v-spacer></v-spacer>
        <v-btn color="deep-purple lighten-2" text> Edit </v-btn>
        <v-btn color="red lighten-2" text> Delete </v-btn>
      </div>
    </div>
    <div class="text-center" v-if="transcriptions && transcriptions.length > 0">
      <v-btn
        @click="loadMoreTranscriptions"
        class="ml-5"
        rounded
        color="#5D5FEF"
        dark
      >
        <v-wait :active="loading" color="white" size="14">
          {{ loading ? "Loading..." : "Load More" }}
        </v-wait>
      </v-btn>
    </div>
  </div>
</template>
  
<script>
import axios from "axios";

export default {
  name: "MyUploads",
  components: {},
  data() {
    return {
      loading: false,
      transcriptions: null,
      currentPage: 1,
    };
  },
  mounted() {
    this.fetchTranscriptions();
  },
  methods: {
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
    fetchTranscriptions() {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      axios
        .post("https://certoe.de:8080/api/frontend/getTranscriptionsForGroup", {
          userId: userId,
          limit: 5,
          page: this.currentPage,
          roleId: 1,
          token: "test",
          live: true,
        })
        .then((response) => {
          console.log(response.data.result.transcriptions);
          if (!this.transcriptions) {
            this.transcriptions = response.data.result.transcriptions;
          } else {
            this.transcriptions = [
              ...this.transcriptions,
              ...response.data.result.transcriptions,
            ];
          }
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    loadMoreTranscriptions() {
      this.loading = true;
      this.currentPage += 1;
      this.fetchTranscriptions();
    },
  },
};
</script>
<style scoped>
p {
  font-size: 14px;
}
.content-container.box {
  margin: 10px 0 !important;
}
</style>
  