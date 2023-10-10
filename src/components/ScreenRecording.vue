<template>
  <div>
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
    };
  },
  methods: {
    async sendRecordingToApi(blob) {
      try {
        const formData = new FormData();
        formData.append("file", blob, "screen-recording.webm");
        formData.append("typeOfTranscription", "3");
        formData.append("originalLanguage", "Serbian");
        formData.append("userId", "1");
        formData.append("groupIds", "[1]");
        formData.append("userIds", "[1]");
        formData.append(
          "liveTranscriptionGroupName",
          "screen recording test - code"
        );

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
  