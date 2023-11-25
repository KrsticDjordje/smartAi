<template>
  <div class="back-audio content-container box text-center p-5">
    <h5 class="mt-4">Audio Recorder</h5>
    <div class="audioIcon" :class="{ audioRecorder: true, rec: isRecording }">
      <span class="mdi mdi-microphone"></span>
    </div>

    <span
      >Recording time: <b>{{ formattedRecordingTime }}</b></span
    >
    <br />
    <v-btn class="playRecording p-4" rounded @click="toggleRecording">
      {{ isRecording ? "Stop Recording" : "Start Recording" }}
    </v-btn>
    <!-- <button @click="downloadAudio" :disabled="!audioUrl" class="downloadAudio">
      Download Audio
    </button> -->
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
          this.sendAudioToApi(audioBlob); // Dodato slanje audio fajla na API
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
      }
    },
    async sendAudioToApi(audioBlob) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userIdAsArray = JSON.stringify([user.id]);

        const groupIds = user.groups.map((group) => group.id);
        const groupIdsAsArray = JSON.stringify(groupIds);

        const formData = new FormData();
        formData.append("file", audioBlob);
        formData.append("typeOfTranscription", "4");
        formData.append("originalLanguage", "Serbian");
        formData.append("userId", user.id);
        formData.append("groupIds", groupIdsAsArray);
        formData.append("userIds", userIdAsArray);

        console.log([...formData.entries()]);

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
          this.notify(
            "Your audio has been successfully submitted for transcription!",
            "success"
          );
          this.deleteLocalAudioFile(audioBlob); // Dodato brisanje lokalnog audio fajla
        } else {
          console.error("Neuspešno slanje audio na API.");
          this.notify("Failed!", "error");
        }
      } catch (error) {
        console.error("Error sending audio to API:", error);
        this.notify("Failed!", "error");
      }
    },

    deleteLocalAudioFile(audioBlob) {
      // Ovde dodajte kod za brisanje lokalnog audio fajla
      // audioBlob sadrži audio podatke koje možete koristiti za brisanje lokalnog fajla
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
