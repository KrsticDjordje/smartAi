<template>
  <div>
    <div
      class="mx-auto mb-8 mt-5 content-container box"
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
        <v-card-subtitle class="my-0">{{
          transcription.short_title
        }}</v-card-subtitle>
        <v-card-text class="chunkText">
          {{ transcription.transcription }}
        </v-card-text>
      </div>
      <v-divider class="mx-4"></v-divider>

      <v-card-text>
        <v-chip-group active-class="deep-purple accent-4 white--text" column>
          <v-chip>Language: {{ transcription.target_language }}</v-chip>

          <v-chip>Type: Translations</v-chip>
        </v-chip-group>
      </v-card-text>
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
  