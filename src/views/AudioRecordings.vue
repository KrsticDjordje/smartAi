<template>
  <div>
    <div
      class="mx-auto mb-8 mt-5 transcriptionBox content-container box"
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
      <p class="text-right mr-4 mt-2 mb-0">
        <span class="mdi mdi-timer-edit"></span>
        {{ formatDateTranscription(transcription.created_at) }}
      </p>
      <div class="d-flex align-items-center">
        <v-card-title>{{ transcription.brief_title }}</v-card-title>
        <v-spacer></v-spacer>
        <v-btn color="deep-purple" text> Translate </v-btn>
        <v-btn color="red" text> Delete </v-btn>
      </div>
      <v-card-text class="px-3 py-0">
        <v-chip-group active-class="deep-purple accent-4 white--text" column>
          <v-chip
            class="keyword"
            small
            v-for="(keyword, index) in getKeywords(transcription.keywords)"
            :key="'keyword-' + index"
            >{{ keyword }}</v-chip
          >
        </v-chip-group>
        <v-chip-group active-class="deep-purple accent-4 white--text" column>
          <v-chip
            class="people"
            small
            v-for="(people, index) in getPeople(transcription.tags)"
            :key="'person-' + index"
            >#{{ people }}</v-chip
          >
        </v-chip-group>
      </v-card-text>
      <v-hr class=""></v-hr>
      <div
        class="text-left mb-4"
        v-for="oneChunk in transcription.pieces"
        :key="oneChunk.id"
      >
        <div class="d-flex">
          <v-card-subtitle class="my-0">{{
            oneChunk.brief_title === "&#91;&#39;&lt;NONE&gt;&#39;&#93;"
              ? "Brief subtitle"
              : oneChunk.brief_title
          }}</v-card-subtitle>
          <p class="mx-3 mb-0 d-flex align-center text-left">
            <span class="mdi mdi-volume-high mx-1"></span>
            {{ formatTime(oneChunk.beginning_time) }} -
            {{ formatTime(oneChunk.concluding_time) }}
          </p>
          <v-spacer></v-spacer>
          <v-btn class="mx-2" icon fab dark small color="#05004E">
            <v-icon dark> mdi-content-copy </v-icon>
          </v-btn>
          <v-btn class="mx-2" icon fab dark small color="#05004E">
            <v-icon dark> mdi-file-replace-outline </v-icon>
          </v-btn>
        </div>

        <v-card-text class="chunkText">
          {{ oneChunk.transcript }}
        </v-card-text>
        <!-- <audio-player /> -->
        <audio ref="recordedAudio" controls>
          <source src="https://www.computerhope.com/jargon/m/example.mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
    <div class="text-center" v-if="transcriptions && transcriptions.length > 0">
      <v-btn
        @click="loadMoreTranscriptions"
        class="ml-5"
        rounded
        color="#5D5FEF"
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
import AudioPlayer from "@/components/AudioPlayer.vue";

export default {
  name: "MyUploads",
  components: { AudioPlayer },
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
    getPeople(keywordsString) {
      if (!keywordsString) {
        console.log("Keywords string is null or undefined.");
        return null;
      }

      try {
        const keywordsArray = JSON.parse(keywordsString);

        if (!Array.isArray(keywordsArray)) {
          console.log("Parsed keywords is not an array.");
          return null;
        }

        return keywordsArray.map((keyword) => keyword.trim());
      } catch (error) {
        console.log("Error parsing keywords.", error);
        return null;
      }
    },

    getKeywords(keywordsString) {
      if (!keywordsString) {
        console.log("Keywords string is null or undefined.");
        return null;
      }

      try {
        const keywordsArray = JSON.parse(keywordsString);

        if (!Array.isArray(keywordsArray)) {
          console.log("Parsed keywords is not an array.");
          return null;
        }

        return keywordsArray.map((keyword) => keyword.trim());
      } catch (error) {
        console.log("Error parsing keywords.", error);
        return null;
      }
    },
    formatDateTranscription(date) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      };
      return new Date(date).toLocaleString("en-US", options);
    },
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
          typeOfTranscription: 4,
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
</style>
    