<template>
  <div>
    <v-btn class="d-flex ml-5 btn-style-2" rounded color="#5D5FEF" dark>
      + Upload
    </v-btn>
    <v-card
      class="mx-auto mb-8 mt-5 transcriptionBox"
      style="padding: 10px"
      max-width="97%"
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
      <div class="d-flex align-items-center">
        <v-card-title>{{ transcription.filename }}</v-card-title>
        <v-spacer></v-spacer>
        <v-btn color="deep-purple lighten-2" text> Reserve </v-btn>
        <v-btn color="deep-red lighten-2" text> Delete </v-btn>
      </div>
      <v-divider class="mx-4"></v-divider>
      <div class="text-left">
        <v-card-subtitle class="my-0">Chunk title</v-card-subtitle>
        <v-card-text class="chunkText">
          Chunk text Chunk text Chunk text Chunk text Chunk text Chunk text
          Chunk text
        </v-card-text>
      </div>
      <v-divider class="mx-4"></v-divider>
      <v-divider class="mx-4"></v-divider>
      <div class="text-left">
        <v-card-subtitle class="my-0">Chunk title</v-card-subtitle>
        <v-card-text class="chunkText">
          Chunk text Chunk text Chunk text Chunk text Chunk text Chunk text
          Chunk text
        </v-card-text>
      </div>
      <v-divider class="mx-4"></v-divider>

      <v-card-text>
        <v-chip-group active-class="deep-purple accent-4 white--text" column>
          <v-chip>Keywords</v-chip>

          <v-chip>Keywords</v-chip>

          <v-chip>People</v-chip>

          <v-chip>People</v-chip>
        </v-chip-group>
      </v-card-text>

      <audio ref="recordedAudio" controls>
        Your browser does not support the audio element.
      </audio>
    </v-card>
  </div>
</template>
  
<script>
import axios from "axios";

export default {
  name: "MyUploads",
  components: {},
  data() {
    return {
      loading: true,
      transcriptions: null,
    };
  },
  mounted() {
    this.fetchTranscriptions();
  },
  methods: {
    fetchTranscriptions() {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      axios
        .post("http://49.12.0.17:8000/api/frontend/getTranslationsForUser", {
          userId: userId,
          token: "test",
        })
        .then((response) => {
          console.log(response.data.result.translations);
          this.transcriptions = response.data.result.translations;

          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    loadMoreTranscriptions() {
      this.currentPage += 1;
      this.fetchTranscriptions();
    },
  },
};
</script>
<style scoped>
</style>
  