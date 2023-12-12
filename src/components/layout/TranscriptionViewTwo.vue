<template>
  <div>
    <UploadFIle />
    <div
      class="mx-auto mb-2 mt-2 transcriptionBox content-container box"
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
      <div class="d-flex align-items-center wrap-reverse-mobile">
        <v-card-title
          @click="routerLink(transcription.id, transcription.brief_title)"
          style="cursor: pointer"
          >{{ transcription.brief_title }}</v-card-title
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="share(transcription.id, transcription.brief_title)"
          color="teal"
          text
        >
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
        <v-btn color="deep-purple" text> <v-icon>mdi-translate</v-icon> </v-btn>
        <v-dialog v-model="transcription.openDialogDelete" max-width="600px">
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
              >Are you sure you want to delete this transcription?</v-card-text
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
    </div>
    <div class="text-center" v-if="transcriptions && transcriptions.length > 0">
      <v-btn
        @click="loadMoreTranscriptions"
        class="ml-5"
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
  name: "MyUploads",
  components: { AudioPlayer, UploadFIle },
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
    async share(id, title) {
      const url = `${window.location.origin}/oneTranscription/${id}/${title}`;

      try {
        if (
          navigator.userAgent.match(
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
          ) &&
          navigator.share
        ) {
          // Provera da li je korisnik na mobilnom uređaju i da li podržava navigator.share
          await navigator.share({
            title: "Naslov vašeg dela",
            text: "Opis vašeg dela",
            url: url,
          });

          // Ako share uspešno završi, obavesti korisnika
          this.notify(
            "You have successfully shared this transcription",
            "success"
          );
        } else if (navigator.clipboard) {
          // Ako nije podržan navigator.share, koristi Clipboard API
          await navigator.clipboard.writeText(url);

          // Ako kopiranje u klipbord uspešno završi, obavesti korisnika
          this.notify(
            "You have successfully copied the link, you can now share this transcription",
            "success"
          );
        } else {
          // Ako nijedna opcija nije podržana, obavesti korisnika
          this.notify(
            "Sharing is not supported on this device or browser.",
            "warning"
          );
        }
      } catch (error) {
        console.error("Greška prilikom deljenja ili kopiranja:", error);
        this.notify(
          "Error sharing or copying the link. Please try again.",
          "error"
        );
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
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
    async editTextBlur(id, editText) {
      console.log(id, editText, "Edit teksta");
      try {
        await axios.post(
          "https://verbumscript.app:8080/api/frontend/editPiece",
          {
            pieceId: id,
            editedContent: editText,
            token: "test",
          }
        );
      } catch (error) {
        console.error(error);
      }
    },
    async deleteTranscption(transcriptId) {
      console.log(transcriptId, "Korpa");
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        await axios.post(
          "https://verbumscript.app:8080/api/frontend/deleteTranslation",
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
      axios
        .post(
          "https://verbumscript.app:8080/api/frontend/getTranscriptionsForGroup",
          {
            userId: userId,
            limit: 5,
            page: this.currentPage,
            roleId: roleId,
            token: "test",
            typeOfTranscription: 1,
          }
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
</style>
    