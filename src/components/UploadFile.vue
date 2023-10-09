<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          class="d-flex mt-3 btn-style-2 upload-btn"
          rounded
          large
          color="#5D5FEF"
          @click="toggleForm"
          v-on="on"
        >
          + Upload
        </v-btn>
      </template>
      <span>Upload a video or audio file to be transcribed.</span>
    </v-tooltip>
    <v-expand-transition>
      <v-container v-if="showForm" class="upload-form-container">
        <div class="upload-form-container">
          <div class="upload-form">
            <form
              @submit.prevent="submitForm"
              enctype="multipart/form-data"
              @drop.prevent="onDrop"
              @dragenter.prevent
              @dragover.prevent
            >
              <div class="form-group">
                <v-row>
                  <v-col cols="12" sm="6">
                    <label for="language-select" class="language-label"
                      >Select Language:</label
                    >
                    <v-select
                      v-model="selectedLanguage"
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
                      v-model="recordingType"
                      :items="recordingTypes"
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
              </div>

              <div class="form-actions">
                <v-btn
                  type="submit"
                  class="form-submit"
                  :disabled="
                    !selectedFile ||
                    (selectedFile && !isValidFileType(selectedFile.name)) ||
                    (selectedFile && selectedFile.size > 500000000)
                  "
                >
                  Submit
                </v-btn>
              </div>
              <v-progress-circular
                v-if="uploadLoading"
                class="mt-5"
                indeterminate
                color="purple"
              ></v-progress-circular>
            </form>
          </div>
        </div>
      </v-container>
    </v-expand-transition>

    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
    >
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="showSnackbar" bottom color="success" :timeout="2000">
      Text copied!
    </v-snackbar>
  </div>
</template>

  
  <script>
import axios from "axios";
// import LoadingTranscription from "@/components/LoadingTranscription.vue";

export default {
  name: "FileUpload",
  components: {
    // LoadingTranscription,
  },
  data() {
    return {
      showCode: false,
      showForm: false,
      file: null,
      selectedLanguage: "",
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
      recordingType: "",
      recordingTypes: [
        "Press conference",
        "Podcast",
        "Lecture",
        "Interview",
        "Short quote",
      ],
      snackbar: {
        show: false,
        message: "",
        timeout: 3000,
        color: "success",
      },
      uploadLoading: false,
      selectedFile: null,
      showSnackbar: false,
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
        "oog",
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

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFile = {
          name: file.name,
          content: reader.result,
        };
        this.file = file;
        console.log("Dropped file:", this.file);
      };
      reader.readAsText(file);
    },
    onFileSelected(event) {
      this.file = event.target.files[0];
      console.log("Selected file:", this.file);
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFile = {
          name: event.target.files[0].name,
          content: reader.result,
        };
      };
      reader.readAsText(event.target.files[0]);
    },

    async submitForm() {
      this.uploadLoading = true;

      const formData = new FormData();
      formData.append("file", this.file);
      // formData.append("start_time", "22");
      formData.append("typeOfTranscription", "1");
      formData.append("originalLanguage", "Serbian");
      const user = JSON.parse(localStorage.getItem("user"));
      formData.append("userId", "1");
      formData.append("groupIds", "[1]");
      formData.append("userIds", "[1]");
      // formData.append("ownerId", "1");

      console.log([...formData.entries()]);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      try {
        const response = await axios.post(
          "https://certoe.de:5000/v1/transcribe_video_new",
          formData,
          config
        );
        console.log(response.data);
        localStorage.setItem("response", JSON.stringify(response.data));
        if (response.data.success) {
          this.showCode = true;
          this.showForm = false;
          this.snackbar.message = "File uploaded successfully!";
          this.snackbar.color = "success";
        } else {
          this.snackbar.message = "File upload failed!";
          this.snackbar.color = "error";
        }
        this.snackbar.show = true;
        this.uploadLoading = false;
      } catch (error) {
        alert("Error - Network Error");
        console.log(error);
        this.uploadLoading = false;
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
  