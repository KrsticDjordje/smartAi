<template>
  <div>
    <h5 class="mt-4">Audio Recorder</h5>
    <div class="audioIcon" :class="{ audioRecorder: true, rec: isRecording }">
      <span class="mdi mdi-microphone"></span>
    </div>

    <span
      >Recording time: <b>{{ formattedRecordingTime }}</b></span
    >
    <br />
    <button class="playRecording" @click="toggleRecording">
      {{ isRecording ? "Stop Recording" : "Start Recording" }}
    </button>
    <button @click="downloadAudio" :disabled="!audioUrl" class="downloadAudio">
      Download Audio
    </button>
    <audio
      ref="audioPlayer"
      controls
      v-if="audioUrl"
      :src="audioUrl"
      type="audio/mpeg"
    ></audio>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      mediaRecorder: null,
      audioChunks: [],
      isRecording: false,
      audioUrl: null,
      timer: null,
      recordingStartTime: null,
      recordingTime: 0,
      stream: null,
    };
  },
  computed: {
    formattedRecordingTime() {
      const hours = Math.floor(this.recordingTime / 3600);
      const minutes = Math.floor((this.recordingTime % 3600) / 60);
      const seconds = this.recordingTime % 60;
      return `${this.formatNumber(hours)}:${this.formatNumber(
        minutes
      )}:${this.formatNumber(seconds)}`;
    },
  },
  methods: {
    formatNumber(number) {
      return number.toString().padStart(2, "0");
    },
    async requestAudioPermission() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      } catch (error) {
        console.error("Error requesting audio permission:", error);
      }
    },
    async toggleRecording() {
      if (!this.isRecording) {
        await this.requestAudioPermission();
        if (this.stream) {
          this.startRecording();
          this.recordingStartTime = Date.now() - this.recordingTime * 1000;
          this.timer = setInterval(() => {
            this.recordingTime = Math.floor(
              (Date.now() - this.recordingStartTime) / 1000
            );
          }, 1000);
        }
      } else {
        this.stopRecording();
        clearInterval(this.timer);
        this.recordingTime = 0;
      }
    },
    async startRecording() {
      try {
        this.mediaRecorder = new MediaRecorder(this.stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: "audio/mpeg" });
          this.audioUrl = URL.createObjectURL(audioBlob);
          this.stream.getTracks().forEach((track) => track.stop());
        };

        this.mediaRecorder.start();
        this.isRecording = true;
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    },
    stopRecording() {
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
        this.isRecording = false;
        this.sendAudioToApi();
      }
    },
    async sendAudioToApi() {
      try {
        const formData = new FormData();
        const audioBlob = new Blob(this.audioChunks, { type: "audio/mpeg" });
        formData.append("file", audioBlob);
        formData.append("start_time", "22");
        formData.append("recording_type", "4");
        formData.append("audio_language", "Serbian");
        formData.append("user_id", "1");
        formData.append("groupIds", "[1]");
        formData.append("userIds", "[1]");
        formData.append("ownerId", "1");
        formData.append("liveTranscriptionGroupName", "Proba Audio Recorder");

        const response = await axios.post(
          "https://certoe.de:5000/v1/transcribe_video_new",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          const responseData = response.data;
          console.log("API Response:", responseData);
          alert("Audio je uspešno poslat na API.");
        } else {
          console.error("Neuspešno slanje audio na API.");
          alert("Neuspešno slanje audio na API.");
        }
      } catch (error) {
        console.error("Error sending audio to API:", error);
        alert("Greška prilikom slanja audio na API.");
      }
    },

    downloadAudio() {
      const link = document.createElement("a");
      link.href = this.audioUrl;
      link.download = "recording.mp3";
      link.click();
    },
  },
  beforeDestroy() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop();
    }
    clearInterval(this.timer);
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  },
};
</script>

<style scoped>
audio {
  margin-top: 20px;
}
</style>
