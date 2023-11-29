<template>
  <div>
    <!-- <h5 class="text-left my-4 mx-2">Translations</h5> -->
    <div
      class="mx-auto mb-8 mt-5 content-container box"
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
      <p class="text-right mr-4 mt-2 mb-0 date-time">
        <span class="mdi mdi-timer-edit"></span>
        {{ formatDateTranscription(transcription.created_at) }}
      </p>
      <div class="d-flex align-items-center wrap-reverse-mobile">
        <v-card-title>{{ transcription.document_name }}</v-card-title>
        <v-spacer></v-spacer>
        <v-btn
          class="mx-2"
          icon
          fab
          dark
          small
          @click="copy(transcription.transcript)"
          color="#05004E"
        >
          <v-icon dark> mdi-content-copy </v-icon>
        </v-btn>
        <v-btn @click="deleteTranslation(transcription.id)" color="red" text>
          <v-icon>mdi-delete-empty</v-icon>
        </v-btn>
      </div>
      <div class="text-left">
        <!-- <v-card-subtitle class="my-0">{{
          transcription.short_title
        }}</v-card-subtitle> -->
        <v-card-text class="chunkText">
          {{ transcription.transcript }}
        </v-card-text>
      </div>

      <v-card-text>
        <v-chip-group active-class="deep-purple accent-4 white--text" column>
          <v-chip class="people">Type: Translations</v-chip>

          <v-chip class="keyword">
            Language: {{ transcription.translated_language }}</v-chip
          >
        </v-chip-group>
      </v-card-text>
    </div>
    <div class="text-center" v-if="transcriptions && transcriptions.length > 0">
      <v-btn
        @click="loadMoreTranscriptions"
        class="ml-5 mt-2"
        rounded
        color="#5D5FEF"
      >
        <div :active="loading" color="white" size="14">
          {{ loading ? "Loading..." : "Load More" }}
        </div>
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
      loading: true,
      transcriptions: null,
      currentPage: 0,
    };
  },
  mounted() {
    this.fetchTranscriptions();
  },
  methods: {
    formatDateTranscription(date) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      return new Date(date).toLocaleString("en-GB", options);
    },
    copy(text) {
      this.notify("You have successfully copy text", "success");
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    },
    async deleteTranslation(transcriptId) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        await axios.post(
          "https://certoe.de:8080/api/frontend/deleteTranslation",
          {
            userId: user.id,
            transcriptionId: transcriptId,
            token: "test",
          }
        );
        this.transcriptions = this.transcriptions.filter(
          (translation) => translation.id !== transcriptId
        );
        this.notify("You have successfully deleted translation", "success");
      } catch (error) {
        console.error(error);
        this.notify("Failed", "error");
      }
    },
    fetchTranscriptions() {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      axios
        .post("https://certoe.de:8080/api/frontend/getTranslationsForUser", {
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
  