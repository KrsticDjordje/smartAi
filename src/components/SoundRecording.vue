<template>
  <div>
    <button @click="toggleRecording">
      {{ isRecording ? "Stop Recording" : "Start Recording" }}
    </button>
    <button @click="downloadAudio" :disabled="!audioUrl">Download Audio</button>
    <audio
      ref="audioPlayer"
      controls
      v-if="audioUrl"
      :src="audioUrl"
      type="audio/mpeg"
    ></audio>
    <span v-if="isRecording">Recording time: {{ formattedRecordingTime }}</span>
  </div>
</template>
  
  <script>
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
      stream: null, // Dodajte stream promenljivu
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
    async toggleRecording() {
      if (!this.isRecording) {
        this.startRecording();
        this.recordingStartTime = Date.now() - this.recordingTime * 1000;
        this.timer = setInterval(() => {
          this.recordingTime = Math.floor(
            (Date.now() - this.recordingStartTime) / 1000
          );
        }, 1000);
      } else {
        this.stopRecording();
        clearInterval(this.timer);
        this.recordingTime = 0;
      }
    },
    async startRecording() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
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
          this.stream.getTracks().forEach((track) => track.stop()); // Zaustavi audio uređaj
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
        formData.append("audio", audioBlob, "recording.mp3");

        // Send audio to API, replace 'your-api-url' with the actual API endpoint.
        // const response = await fetch('https://your-api-url', {
        //   method: 'POST',
        //   body: formData,
        // });

        // If sending is successful, you can handle the API response here.
        // const data = await response.json();
        // console.log('API Response:', data);
      } catch (error) {
        console.error("Error sending audio to API:", error);
      }
    },
    downloadAudio() {
      // Create a download link for the audio file.
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
      this.stream.getTracks().forEach((track) => track.stop()); // Dodajte ovu liniju da zaustavite audio uređaj prilikom uništavanja komponente
    }
  },
};
</script>
  