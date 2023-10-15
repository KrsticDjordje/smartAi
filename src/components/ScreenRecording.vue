<template>
  <div>
    <v-col cols="12">
      <v-combobox
        v-model="folderName"
        :items="transcriptions"
        label="Enter the name of the new folder or select an old folder where you will transcribe."
        hide-selected
        :search-input.sync="search"
        deletable-chips
        chips
      ></v-combobox>
    </v-col>
    <v-btn
      min-width="20%"
      width="30%"
      rounded
      color="red"
      style="color: white"
      class="recordingBtn mt-5 m-auto"
      @click="toggleRecording"
    >
      <v-icon style="color: white" class="mx-2">mdi-record-circle</v-icon>
      {{ isRecording ? "Recording Off" : "Recording On" }}
    </v-btn>
    <video
      ref="recordedVideo"
      controls
      v-if="recordedChunks.length > 0 || isRecording"
      @click="playRecording"
    >
      Your browser does not support the video element.
    </video>
    <a
      v-if="downloadUrl"
      :href="downloadUrl"
      download="recording.webm"
      class="btn btn-success"
    >
      Download video
    </a>
  </div>
</template>
  
  <script>
import "webrtc-adapter";
import axios from "axios";

export default {
  data() {
    return {
      isRecording: false,
      mediaRecorder: null,
      recordedChunks: [],
      downloadUrl: null,
      folderName: null,
      transcriptions: null,
    };
  },
  mounted() {
    this.fetchTranscriptions();
  },
  methods: {
    fetchTranscriptions() {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const roleId = JSON.parse(localStorage.getItem("user")).role_id;
      axios
        .post("https://certoe.de:8080/api/frontend/getTranscriptionsForGroup", {
          userId: userId,
          limit: 5,
          page: this.currentPage,
          roleId: roleId,
          token: "test",
          live: true,
        })
        .then((response) => {
          console.log(response.data.result.transcriptions);
          if (!this.transcriptions) {
            this.transcriptions = response.data.result.transcriptions.map(
              (t) => t.live_transcription_name
            );
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

    async sendRecordingToApi(blob) {
      try {
        const formData = new FormData();
        formData.append("file", blob, "screen-recording.webm");
        formData.append("typeOfTranscription", "3");
        formData.append("originalLanguage", "Serbian");
        formData.append("userId", "1");
        formData.append("groupIds", "[1]");
        formData.append("userIds", "[1]");
        formData.append("liveTranscriptionGroupName", this.folderName);

        console.log([...formData.entries()]);

        const apiUrl = "https://certoe.de:5000/v1/transcribe_video_new";

        const response = await axios.post(apiUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Snimak je uspješno poslat na API:", response.data);
      } catch (error) {
        console.error("Greška pri slanju snimka na API:", error);
      }
    },

    async toggleRecording() {
      if (this.isRecording) {
        this.mediaRecorder.stop(); // Stopiranje snimanja će automatski pokrenuti mediaRecorder.onstop
      } else {
        try {
          this.recordedChunks = []; // Očisti prethodne snimke
          this.downloadUrl = null; // Resetuj URL za preuzimanje
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              sampleRate: 44100,
            },
          });
          this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp9",
            audioBitsPerSecond: 128000,
          });
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.recordedChunks.push(event.data);
            }
          };
          this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.recordedChunks, { type: "video/webm" });
            const videoUrl = URL.createObjectURL(blob);
            if (this.downloadUrl) {
              URL.revokeObjectURL(this.downloadUrl);
            }

            this.downloadUrl = videoUrl;
            this.$refs.recordedVideo.src = videoUrl;
            this.isRecording = false;
            this.sendRecordingToApi(blob); // Slanje na API se izvršava tek nakon zaustavljanja snimanja
          };
          this.mediaRecorder.start();
          this.isRecording = true;
        } catch (error) {
          console.error("Greška pri snimanju ekrana:", error);
        }
      }
    },
    stopRecording() {
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
        this.sendRecordingToApi(
          new Blob(this.recordedChunks, { type: "video/webm" })
        );
      }
    },
    playRecording() {
      if (this.$refs.recordedVideo.paused) {
        this.$refs.recordedVideo.play();
      } else {
        this.$refs.recordedVideo.pause();
      }
    },
  },
};
</script>
  
  <style scoped>
video {
  width: 90%;
  margin: 17px 0;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 60px;
  min-width: 96%;
  padding: 0 16px;
}
.recordingBtn {
  display: flex;
  margin: 20px;
}
</style>
  