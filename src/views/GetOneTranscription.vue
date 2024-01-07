<template>
  <div>
    <v-simple-table class="mb-5 statusTranscription">
      <template v-slot:default>
        <thead>
          <tr>
            <!-- <th class="text-center">Tokens spent</th> -->
            <th class="text-center">Date</th>
            <th class="text-center">Duration</th>
            <th class="text-center">Type</th>
            <th class="text-center">Language</th>
            <th class="text-right">More Options</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <!-- <td>73 tokens</td> -->
            <td>
              <span class="mdi mdi-calendar-range"></span>
              {{ formatDateTranscription(transcriptions.created_at) }}
            </td>
            <td>
              <span class="mdi mdi-timer-play-outline"></span>
              {{ formatDuration(transcriptions.duration) }} sec
            </td>
            <td>
              <span v-if="transcriptions.type === 4">Audio</span>
              <span v-else-if="transcriptions.type === 3">Screen</span>
              <span v-else-if="transcriptions.type === 1">Upload</span>
            </td>
            <td>
              <span class="mdi mdi-translate"></span>
              {{ transcriptions.original_language }}
            </td>
            <td>
              <div class="d-flex align-items-center">
                <v-spacer></v-spacer>
                <v-dialog
                  v-model="dialog"
                  fullscreen
                  hide-overlay
                  transition="dialog-bottom-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      color="blue"
                      text
                      :disabled="
                        !transcriptions.translations ||
                        transcriptions.translations.length === 0
                      "
                    >
                      <v-icon>mdi-text-recognition</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-toolbar dark color="mainGradientColor">
                      <v-btn icon dark @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                      <v-toolbar-title>Translations</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-list three-line subheader>
                      <v-list-item
                        v-for="oneTranslation in transcriptions.translations"
                        :key="oneTranslation.id"
                      >
                        <v-list-item-content>
                          <v-card class="d-flex my-3">
                            <v-list-item-title>{{
                              oneTranslation.translated_language
                            }}</v-list-item-title>
                            <v-spacer></v-spacer>
                            <v-btn
                              class="mx-2"
                              icon
                              fab
                              dark
                              small
                              @click="copy(oneTranslation.transcript)"
                              color="#05004E"
                            >
                              <v-icon dark> mdi-content-copy </v-icon>
                            </v-btn>
                            <v-btn
                              @click="deleteTranslation(oneTranslation.id)"
                              color="red"
                              text
                            >
                              <v-icon>mdi-delete-empty</v-icon>
                            </v-btn>
                          </v-card>
                          <v-list-item-subtitle>{{
                            oneTranslation.transcript
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-dialog>
                <v-btn
                  @click="share(transcriptions.id, transcriptions.brief_title)"
                  color="teal"
                  text
                >
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>

                <v-dialog
                  v-model="transcriptions.openTranslate"
                  scrollable
                  max-width="300px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" color="deep-purple" text>
                      <v-icon>mdi-translate</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>Choose Language</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 300px">
                      <v-radio-group v-model="selectLanguage" column>
                        <v-radio label="English" value="English"></v-radio>
                        <v-radio label="Chinese" value="Chinese"></v-radio>
                        <v-radio label="German" value="German"></v-radio>
                        <v-radio label="Italian" value="Italian"></v-radio>
                        <v-radio label="Spanish" value="Spanish"></v-radio>
                        <v-radio label="French" value="French"></v-radio>
                        <hr />
                        <v-radio
                          label="Azerbaijani"
                          value="Azerbaijani"
                        ></v-radio>
                        <v-radio label="Bosnian" value="Bosnian"></v-radio>
                        <v-radio label="Bulgarian" value="Bulgarian"></v-radio>
                        <v-radio label="Croatian" value="Croatian"></v-radio>
                        <v-radio label="Czech" value="Czech"></v-radio>
                        <v-radio label="Danish" value="Danish"></v-radio>
                        <v-radio label="Dutch" value="Dutch"></v-radio>
                        <v-radio label="Estonian" value="Estonian"></v-radio>
                        <v-radio label="Finnish" value="Finnish"></v-radio>
                        <v-radio label="Hungarian" value="Hungarian"></v-radio>
                        <v-radio label="Japanese" value="Japanese"></v-radio>
                        <v-radio label="Korean" value="Korean"></v-radio>
                        <v-radio label="Greek" value="Greek"></v-radio>
                        <v-radio label="Latvian" value="Latvian"></v-radio>
                        <v-radio
                          label="Lithuanian"
                          value="Lithuanian"
                        ></v-radio>
                        <v-radio
                          label="Macedonian"
                          value="Macedonian"
                        ></v-radio>
                        <v-radio label="Norwegian" value="Norwegian"></v-radio>
                        <v-radio
                          label="Portuguese"
                          value="Portuguese"
                        ></v-radio>
                        <v-radio label="Polish" value="Polish"></v-radio>
                        <v-radio label="Romanian" value="Romanian"></v-radio>
                        <v-radio label="Russian" value="Russian"></v-radio>
                        <v-radio label="Serbian" value="Serbian"></v-radio>
                        <v-radio label="Slovenian" value="Slovenian"></v-radio>
                        <v-radio label="Slovak" value="Slovak"></v-radio>
                        <v-radio label="Swedish" value="Swedish"></v-radio>
                        <v-radio label="Turkish" value="Turkish"></v-radio>
                        <v-radio label="Ukrainian" value="Ukrainian"></v-radio>
                      </v-radio-group>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="transcriptions.openTranslate = false"
                      >
                        Close
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="
                          translateSend(
                            transcriptions.external_id,
                            transcriptions.original_language
                          )
                        "
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <v-dialog
                  v-model="transcriptions.openDialogDelete"
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
                        @click="transcriptions.openDialogDelete = false"
                        >No</v-btn
                      >
                      <v-btn
                        color="red darken-1"
                        text
                        @click="deleteTranscption(transcriptions.id)"
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
    <div
      class="mx-auto mb-2 mt-2 transcriptionBox content-container box"
      style="padding: 10px"
      :key="transcriptions.id"
    >
      <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>
      <v-card-text class="px-3 mt-2 py-0 d-flex flex-wrap">
        <v-chip-group active-class="deep-purple accent-4 white--text" column>
          <v-chip
            class="keyword"
            small
            v-for="(keyword, index) in getKeywords(transcriptions.keywords)"
            :key="'keyword-' + index"
            >{{ keyword }}</v-chip
          >
        </v-chip-group>
        <v-chip-group active-class="deep-purple accent-4 white--text" column>
          <v-chip
            class="people"
            small
            v-for="(people, index) in getPeople(transcriptions.tags)"
            :key="'person-' + index"
            >#{{ people }}</v-chip
          >
        </v-chip-group>
      </v-card-text>
      <div class="d-flex align-items-center wrap-reverse-mobile">
        <v-card-title>{{ transcriptions.brief_title }}</v-card-title>
      </div>

      <v-hr class=""></v-hr>
      <div
        class="text-left mb-4"
        v-for="oneChunk in transcriptions.pieces"
        :key="oneChunk.id"
      >
        <div class="d-flex wrap-reverse-mobile">
          <!-- <v-card-subtitle class="my-0">{{
            oneChunk.brief_title === "&#91;&#39;&lt;NONE&gt;&#39;&#93;"
              ? "Brief subtitle"
              : oneChunk.brief_title
          }}</v-card-subtitle> -->
          <p
            class="mx-3 mb-0 d-flex align-center text-left"
            style="cursor: pointer"
            @click="goToBeginningTime(oneChunk)"
          >
            <span class="mdi mdi-volume-high mx-1"></span>
            {{ formatTime(oneChunk.beginning_time) }} -
            {{ formatTime(oneChunk.concluding_time) }}
          </p>
          <v-spacer></v-spacer>
          <v-btn
            class="mx-2"
            icon
            fab
            dark
            small
            @click="copy(oneChunk.transcript)"
            color="#05004E"
          >
            <v-icon dark> mdi-content-copy </v-icon>
          </v-btn>
        </div>
        <v-edit-dialog
          v-model="oneChunk.dialog"
          @update:active="editClose(oneChunk.id, oneChunk.transcript)"
        >
          <v-card-text class="chunkText">{{ oneChunk.transcript }}</v-card-text>
          <template v-slot:input>
            <v-textarea
              v-model="oneChunk.transcript"
              @blur="editTextBlur(oneChunk.id, oneChunk.transcript)"
            ></v-textarea>
          </template>
        </v-edit-dialog>
      </div>
      <!-- <audio-player /> -->
      <audio ref="recordedAudio" controls>
        <source :src="transcriptions.document_link" />
        Your browser does not support the audio element.
      </audio>
    </div>
  </div>
</template>
      
    <script>
import axios from "axios";
import AudioPlayer from "@/components/AudioPlayer.vue";

export default {
  name: "MyUploads",
  components: { AudioPlayer },
  props: ["id", "name"],
  data() {
    return {
      transcriptions: null,
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      selectLanguage: "",
    };
  },
  mounted() {
    this.fetchTranscriptions();
  },
  methods: {
    goToBeginningTime(oneChunk) {
      const beginningTime = oneChunk.beginning_time;
      this.$refs.recordedAudio.currentTime = beginningTime;
    },
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
    copy(text) {
      this.notify("You have successfully copy text", "success");
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
      this.notify("You have successfully edited the transcription", "success");

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
        this.$router.go(-1);
        this.notify(
          "You have successfully deleted this transcription",
          "success"
        );
      } catch (error) {
        console.error(error);
        this.notify("Failed", "error");
      }
    },
    async deleteTranslation(transcriptId) {
      console.log(transcriptId, "Korpa transkription");
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
        this.transcriptions.translations =
          this.transcriptions.translations.filter(
            (translation) => translation.id !== transcriptId
          );
        this.notify(
          "You have successfully deleted this translation",
          "success"
        );
      } catch (error) {
        console.error(error);
        this.notify("Failed", "error");
      }
    },
    async translateSend(transcriptExternalId, transcriptOriginalLang) {
      const user = JSON.parse(localStorage.getItem("user"));
      const userIdAsArray = JSON.stringify([user.id]);
      const data = {
        originalLanguage: transcriptOriginalLang,
        translatedLanguage: this.selectLanguage,
        externalId: transcriptExternalId,
        userIds: userIdAsArray,
        ownerId: user.id,
      };

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      console.log(data);

      try {
        await axios.post(
          "https://verbumscript.app:5000/v1/translateForTranscription",
          data,
          config
        );
        this.notify(
          "You have successfully sent your text for translation",
          "success"
        );
      } catch (error) {
        console.error(error);
        this.notify("Failed", "error");
      }
    },
    fetchTranscriptions() {
      const data = {
        transcriptionId: this.$route.params.id,
        token: "test",
      };
      console.log(data, "radi");
      axios
        .post(
          "https://verbumscript.app:8080/api/frontend/getOneTranscription",
          data
        )
        .then((response) => {
          console.log(response.data.result.transcription, "radilica");
          if (!this.transcriptions) {
            this.transcriptions = response.data.result.transcription;
          } else {
            this.transcriptions = [
              ...this.transcriptions,
              ...response.data.result.transcription,
            ];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
p {
  font-size: 14px;
}
td {
  white-space: nowrap;
}

audio {
  background-color: #91adf5;
  height: 100px;
  padding: 23px 5px;
  position: sticky;
  bottom: 12px;
  left: 0;
  right: 0;
  width: 100%;
  margin: 0 auto;
}
.v-card__subtitle,
.v-card__text,
.v-card__title {
  padding: 3px 16px 16px 16px;
}

/* Boja za pozadinu dugmadi reprodukcije, pauze i stop */
audio::-webkit-media-controls-panel {
  background-color: #91adf5;
  /* Postavite željenu boju pozadine */
}

/* Boja za ikone reprodukcije, pauze i stop */
audio::-webkit-media-controls-play-button,
audio::-webkit-media-controls-pause-button,
audio::-webkit-media-controls-stop-button {
  color: #fff;
  /* Postavite željenu boju ikona */
}

/* Boja za progresnu traku reprodukcije */
audio::-webkit-media-controls-current-time-display,
audio::-webkit-media-controls-time-remaining-display,
audio::-webkit-media-controls-seek-back-button,
audio::-webkit-media-controls-seek-forward-button {
  color: #000;
  /* Postavite željenu boju teksta i ikona */
}

/* Boja za progresnu traku reprodukcije */
audio::-webkit-media-controls-timeline {
  color: #fff;
  /* Postavite željenu boju trake */
}

/* Boja za traku punjenja progresne trake reprodukcije */
audio::-webkit-media-controls-timeline-progress-bar {
  background-color: #fff;
  /* Postavite željenu boju trake punjenja */
}
</style>
      