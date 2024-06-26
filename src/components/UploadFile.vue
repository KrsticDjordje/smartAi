<template>
  <div>
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn
          class="d-flex mt-3 btn-style-2 upload-btn"
          rounded
          large
          color="success"
          @click="toggleForm"
          v-on="on"
        >
          + Upload
        </v-btn>
      </template>
      <span>Upload a video or audio file to be transcribed.</span>
    </v-tooltip>

    <v-dialog v-model="showForm" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">Upload files</span>
        </v-card-title>
        <v-card-text>
          <div class="upload-form-container">
            <div class="upload-form">
              <form
                @submit.prevent="submitForm"
                enctype="multipart/form-data"
                @drop.prevent="onDrop"
                @dragenter.prevent
                @dragover.prevent
              >
                <v-row>
                  <v-col cols="12" sm="6">
                    <label for="language-select" class="language-label"
                      >Select Language:</label
                    >
                    <v-select
                      v-model="originalLanguage"
                      :items="languages"
                      label="Select Language"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <label
                      for="recording-type-select"
                      class="recording-type-label"
                      >Recording type:</label
                    >
                    <v-select
                      v-model="typeOfTranscription"
                      :items="typeRecordings"
                      label="Recording Type"
                      required
                    ></v-select>
                  </v-col>
                </v-row>

                <label for="file-upload" class="upload-label"
                  >Upload File</label
                >
                <div class="form-upload">
                  <v-file-input
                    v-model="selectedFile"
                    label="Drag & Drop files here or click to browse"
                    accept=".avi,.mp3,.mp4,.wma,.m4a,.wav,.flac,.aac,.oog,.mkv,.mov,.flv,.wmv"
                    @change="onFileSelected"
                  ></v-file-input>
                </div>

                <transition name="fade">
                  <v-alert
                    v-if="selectedFile && !isValidFileType(selectedFile.name)"
                    border="left"
                    type="error"
                    elevation="2"
                    outlined
                    dismissible
                    @click:close="selectedFile = null"
                  >
                    This file type is not supported. Please select a file with
                    one of the following extensions: .avi, .mp3, .mp4, .wma,
                    .m4a, .wav, .flac, .aac, .oog, .mkv, .mov, .flv, .wmv.
                  </v-alert>
                </transition>

                <transition name="fade">
                  <v-alert
                    v-if="selectedFile && selectedFile.size > 500000000"
                    border="left"
                    type="error"
                    elevation="2"
                    outlined
                    dismissible
                    @click:close="selectedFile = null"
                  >
                    The selected file is too large. Please select a file smaller
                    than 500MB.
                  </v-alert>
                </transition>

                <v-btn
                  type="submit"
                  class="form-submit mt-4"
                  :active="loading"
                  :disabled="
                    uploadLoadingBtn ||
                    !selectedFile ||
                    !isValidFileType(selectedFile.name) ||
                    selectedFile.size > 500000000
                  "
                >
                  {{ uploadLoadingBtn ? "Loading..." : "Submit" }}
                </v-btn>
                <br />
              </form>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showForm = false"
            >Close</v-btn
          >
        </v-card-actions>
        <v-expand-transition v-if="uploadLoading">
          <v-progress-linear
            :value="progressUpload"
            :height="8"
            class="mt-4"
            color="primary"
          ></v-progress-linear>
        </v-expand-transition>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
    >
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FileUpload",
  components: {},
  data() {
    return {
      showCode: false,
      showForm: false,
      file: null,
      originalLanguage: "",
      languages: [
        "English",
        "German",
        "Spanish",
        "French",
        "Azeri",
        "Bosnian",
        "Bulgarian",
        "Croatian",
        "Greek",
        "Italian",
        "Latvian",
        "Portuguese",
        "Polish",
        "Romanian",
        "Russian",
        "Serbian",
        "Slovenian",
        "Turkish",
        "Ukrainian",
      ],
      typeOfTranscription: "",
      typeRecordings: [
        "Press conference",
        "Podcast",
        "Lecture",
        "Interview",
        "Short quote",
      ],
      progressUpload: 0,
      snackbar: {
        show: false,
        message: "",
        timeout: 3000,
        color: "success",
      },
      uploadLoading: false,
      selectedFile: null,
      uploadLoadingBtn: false,
    };
  },
  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
      this.scrollToTop();
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    isValidFileType(filename) {
      const ext = filename.split(".").pop();
      return [
        "avi",
        "mp3",
        "mp4",
        "wma",
        "m4a",
        "wav",
        "flac",
        "aac",
        "ogg",
        "mkv",
        "mov",
        "flv",
        "wmv",
      ].includes(ext);
    },

    onDrop(event) {
      event.dataTransfer.effectAllowed = "copy";
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      this.selectedFile = file;
      console.log("Dropped file:", this.selectedFile);
    },
    onFileSelected(event) {
      console.log("Selected file:", this.selectedFile);

      // Provera da li je tip fajla validan
      if (!this.isValidFileType(this.selectedFile.name)) {
        this.notify(
          "This file type is not supported. Please select a file with one of the following extensions: .avi, .mp3, .mp4, .wma, .m4a, .wav, .flac, .aac, .ogg, .mkv, .mov, .flv, .wmv.",
          "error"
        );
        this.selectedFile = null;
        return;
      }

      // Provera veličine fajla
      if (this.selectedFile.size > 500000000) {
        this.notify(
          "The selected file is too large. Please select a file smaller than 500MB.",
          "error"
        );
        this.selectedFile = null;
        return;
      }
    },

    async submitForm() {
      this.uploadLoading = true;
      this.uploadLoadingBtn = true;

      const user = JSON.parse(localStorage.getItem("user"));
      const userIdAsArray = JSON.stringify([user.id]);

      const groupIds = user.groups.map((group) => group.id);
      const groupIdsAsArray = JSON.stringify(groupIds);

      const formData = new FormData();
      formData.append("file", this.selectedFile);
      formData.append("typeOfTranscription", "1");
      formData.append("originalLanguage", this.originalLanguage);
      formData.append("userId", user.id);
      formData.append("groupIds", groupIdsAsArray);
      formData.append("userIds", userIdAsArray);
      formData.append("companieId", user.company_id);

      console.log([...formData.entries()]);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          this.progressUpload = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
        },
      };

      try {
        const response = await axios.post(
          "https://verbumscript.app:5000/v1/transcribe_video_new",
          formData,
          config
        );
        console.log(response.data);
        localStorage.setItem("response", JSON.stringify(response.data));

        this.showCode = true;
        this.showForm = false;
        this.notify("File uploaded successfully!", "success");
        this.uploadLoading = false;
        this.uploadLoadingBtn = false;
        this.file = null;
        this.progressUpload = 0;
      } catch (error) {
        this.notify("Failed", "error");
        console.log(error);
        this.uploadLoading = false;
        this.uploadLoadingBtn = false;
      }
    },
  },
};
</script>
  
  <style scoped>
.upload-form-container {
  display: block;
  height: auto;
  overflow: hidden;
  transition: height 0.5s ease-in-out;
  max-width: 100%;
}
.expand-enter-active,
.expand-leave-active {
  transition: height 0.5s;
}

.expand-enter,
.expand-leave-to {
  height: 0;
  opacity: 0;
  overflow: hidden;
}
</style>
  