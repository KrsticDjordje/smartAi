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
      :disabled="isRecording"
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

export default {
  data() {
    return {
      isRecording: false,
      mediaRecorder: null,
      recordedChunks: [],
    };
  },
  methods: {
    async toggleRecording() {
      if (this.isRecording) {
        this.stopRecording();
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
  