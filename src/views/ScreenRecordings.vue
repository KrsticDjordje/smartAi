<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col
          cols="12"
          md="6"
          lg="3"
          v-for="transcription in transcriptions"
          :key="transcription.id"
          @click="
            routerLink(transcription, transcription.live_transcription_name)
          "
        >
          <div
            class="transcriptionBox content-container box"
            style="
              padding: 10px;
              height: 290px;
              cursor: pointer;
              position: relative;
            "
          >
            <div>
              <v-img
                :src="require('@/assets/folder.png')"
                height="200"
                class="rounded"
              ></v-img>
              <div class="d-flex align-items-center wrap-reverse-mobile">
                <v-card-text class="px-1" style="overflow-wrap: anywhere">{{
                  transcription.live_transcription_name
                }}</v-card-text>
              </div>
              <v-btn
                class="editFolder"
                v-bind="attrs"
                v-on="on"
                text
                color="purple"
              >
                <v-icon>mdi-folder-edit</v-icon>
              </v-btn>
              <v-btn
                class="deleteFolder"
                v-bind="attrs"
                v-on="on"
                text
                color="red"
              >
                <v-icon>mdi-delete-empty</v-icon>
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Load More Button -->
    <div class="text-center" v-if="transcriptions && transcriptions.length > 0">
      <v-btn @click="loadMoreTranscriptions" rounded color="#5D5FEF" dark>
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
      loading: false,
      transcriptions: null,
      currentPage: 1,
    };
  },
  mounted() {
    this.fetchTranscriptions();
  },
  methods: {
    routerLink(item, name) {
      this.$router.push({
        name: "folderTranscriptions",
        params: { id: item.id, name: name },
      });
      this.textTerm = "";
    },
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
    fetchTranscriptions() {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      axios
        .post("https://certoe.de:8080/api/frontend/getTranscriptionsForUser", {
          userId: userId,
          limit: 8,
          page: this.currentPage,
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
.transcriptionBox.content-container.box:hover {
  background: #eef3fb !important;
  transition: 0.3s;
}
</style>
  