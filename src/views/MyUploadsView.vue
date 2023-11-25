<template>
  <div>
    <UploadFIle />
    <div
      class="mx-auto mb-2 mt-2 transcriptionBox content-container box"
      :class="{ 'in-progress-bcg-p': transcription.finished === 0 }"
      style="padding: 10px"
      v-for="transcription in transcriptions"
      :key="transcription.id"
    >
      <v-simple-table
        :class="{ 'in-progress-bcg': transcription.finished === 0 }"
      >
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Duration</th>
              <th class="text-left">Date</th>
              <th class="text-left">Language</th>
              <th class="text-left">Status</th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                class="titleBrief"
                @click="routerLink(transcription.id, transcription.brief_title)"
                style="cursor: pointer"
              >
                <strong>{{ transcription.brief_title }}</strong>
              </td>
              <td>{{ formatDuration(transcription.duration) }} sec</td>
              <td class="date">
                {{ formatDateTranscription(transcription.created_at) }}
              </td>
              <td>{{ transcription.original_language }}</td>
              <td>
                <div
                  class="statusIcon"
                  :class="{ 'in-progress-icon': transcription.finished === 0 }"
                >
                  <v-progress-circular
                    v-if="transcription.finished === 0"
                    :width="3"
                    :size="15"
                    color="white"
                    class="mr-2"
                    indeterminate
                  ></v-progress-circular>
                  <span v-else class="mdi mdi-check-circle-outline mr-1"></span>
                  <span v-if="transcription.finished === 0">In Progress</span>
                  <span v-else class="transcribed-text">Transcribed</span>
                </div>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="
                      translate(transcription.id, transcription.brief_title)
                    "
                    color="blue"
                    text
                    :disabled="
                      !transcription.translations ||
                      transcription.translations.length === 0
                    "
                  >
                    <v-icon>mdi-text-recognition</v-icon>
                  </v-btn>
                  <v-btn
                    @click="share(transcription.id, transcription.brief_title)"
                    color="teal"
                    text
                  >
                    <v-icon>mdi-share-variant</v-icon>
                  </v-btn>
                  <v-btn color="deep-purple" text>
                    <v-icon>mdi-translate</v-icon>
                  </v-btn>
                  <v-dialog
                    v-model="transcription.openDialogDelete"
                    max-width="600px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" text color="red">
                        <v-icon>mdi-delete-empty</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">Delete transcription</span>
                      </v-card-title>
                      <v-card-text class="text-left"
                        >Are you sure you want to delete this
                        transcription?</v-card-text
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="transcription.openDialogDelete = false"
                          >No</v-btn
                        >
                        <v-btn
                          color="red darken-1"
                          text
                          @click="deleteTranscption(transcription.id)"
                          >Yes</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-progress-linear
        v-if="transcription.finished === 0"
        class="mt-1 rounded"
        color="#3792ef"
        :value="transcription.progress"
      ></v-progress-linear>
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
import AudioPlayer from "@/components/AudioPlayer.vue";
import UploadFIle from "@/components/UploadFile.vue";

export default {
  name: "GroupUploads",
  components: { AudioPlayer, UploadFIle },
  props: {
    groupId: {
      type: Number,
    },
  },
  data() {
    return {
      loading: false,
      transcriptions: null,
      currentPage: 1,
    };
  },
  watch: {
    groupId(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.transcriptions = null;
        this.fetchTranscriptions();
      }
    },
  },
  mounted() {
    this.fetchTranscriptions();
  },
  methods: {
    share(id, title) {
      const url = `${window.location.origin}/oneTranscription/${id}/${title}`;
      if (navigator.clipboard) {
        // Moderni način: Koristite Clipboard API
        navigator.clipboard
          .writeText(url)
          .then(() => {
            console.log("URL kopiran u klipbord!");
          })
          .catch((err) => {
            console.error("Greška pri kopiranju:", err);
          });
      } else {
        // Alternativni način: Kreirajte privremeni textarea element za kopiranje
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          console.log("URL kopiran u klipbord!");
        } catch (err) {
          console.error("Greška pri kopiranju:", err);
        }
        document.body.removeChild(textArea);
      }
    },
    routerLink(id, name) {
      this.$router.push({
        name: "oneTranscription",
        params: { id: id, name: name },
      });
      this.textTerm = "";
    },
    copy(text) {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    },
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
    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
    async editTextBlur(id, editText) {
      console.log(id, editText, "Edit teksta");
      try {
        await axios.post("https://certoe.de:8080/api/frontend/editPiece", {
          pieceId: id,
          editedContent: editText,
          token: "test",
        });
      } catch (error) {
        console.error(error);
      }
    },
    async deleteTranscption(transcriptId) {
      console.log(transcriptId, "Korpa");
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
          (transcript) => transcript.id !== transcriptId
        );
      } catch (error) {
        console.error(error);
      }
    },
    fetchTranscriptions() {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const roleId = JSON.parse(localStorage.getItem("user")).role_id;

      const data = {
        userId: userId,
        limit: 20,
        page: this.currentPage,
        token: "test",
      };

      console.log(data, "Za prikaz upload-a");
      axios
        .post(
          "https://certoe.de:8080/api/frontend/getTranscriptionsForUser",
          data
        )
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
th.text-left {
  text-wrap: nowrap;
}
</style>
    