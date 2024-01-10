<template>
  <v-container class="container">
    <v-row class="wrapper">
      <v-row class="controls">
        <v-col class="row from mt-4">
          <v-combobox
            filled
            clearable
            :items="countryOptions"
            v-model="fromLanguage"
            label="From"
          ></v-combobox>
        </v-col>
        <v-col class="exchange">
          <v-icon @click="exchangeLanguages">mdi-swap-horizontal</v-icon>
        </v-col>
        <v-col class="row to mt-4">
          <v-combobox
            filled
            clearable
            :items="countryOptions"
            v-model="toLanguage"
            label="To"
          ></v-combobox>
        </v-col>
      </v-row>
      <v-col class="text-input">
        <div class="box-1">
          <textarea
            class="text-original"
            v-model="fromText"
            label="Enter text"
            spellcheck="false"
            placeholder="Enter text"
          ></textarea>
          <v-btn icon @click="clearOriginalText"
            ><span class="mdi mdi-close"></span
          ></v-btn>
        </div>
        <div class="box-2">
          <textarea
            class="translate-text"
            v-model="toText"
            readonly
            disabled
            label="Translation"
            spellcheck="false"
            placeholder="Translation"
          ></textarea>
          <v-btn icon @click="clearTranslateText"
            ><span class="mdi mdi-close"></span
          ></v-btn>
        </div>
      </v-col>
    </v-row>
    <div
      class="character-count mt-2 ml-4 text-left"
      style="font-size: 12px; color: #7f7f7f"
    >
      {{ fromText.length }} characters
    </div>
    <v-btn
      class="translateBtn"
      @click="translateText"
      :disabled="isTranslationInProgress"
      >Translate Text</v-btn
    >
    <div class="loading-screen" v-if="loadingScreen">
      <v-progress-circular
        :width="6"
        :size="50"
        color="green"
        indeterminate
      ></v-progress-circular>
    </div>
  </v-container>
</template>
    
<script>
import axios from "axios";

export default {
  data() {
    return {
      countries: {
        en: "English",
        zh: "Chinese",
        de: "German",
        it: "Italian",
        es: "Spanish",
        fr: "French",
        az: "Azerbaijani",
        bs: "Bosnian",
        bg: "Bulgarian",
        hr: "Croatian",
        cs: "Czech",
        da: "Danish",
        nl: "Dutch",
        et: "Estonian",
        fi: "Finnish",
        hu: "Hungarian",
        ja: "Japanese",
        ko: "Korean",
        el: "Greek",
        lv: "Latvian",
        lt: "Lithuanian",
        mk: "Macedonian",
        no: "Norwegian",
        pt: "Portuguese",
        pl: "Polish",
        ro: "Romanian",
        ru: "Russian",
        sr: "Serbian",
        sl: "Slovenian",
        sk: "Slovak",
        sv: "Swedish",
        tr: "Turkish",
        uk: "Ukrainian",
      },
      isTranslationInProgress: false,
      fromText: "",
      toText: "",
      fromLanguage: "English",
      toLanguage: "English",
      loadingScreen: false,
    };
  },
  computed: {
    countryOptions() {
      return Object.entries(this.countries).map(([code, label]) => ({
        text: label,
        value: code,
      }));
    },
  },
  methods: {
    clearOriginalText() {
      this.fromText = "";
    },
    clearTranslateText() {
      this.toText = ""; // Postavi sadržaj textarea na prazan string
    },
    exchangeLanguages() {
      [this.fromLanguage, this.toLanguage] = [
        this.toLanguage,
        this.fromLanguage,
      ];
    },
    async translateText() {
      this.loadingScreen = true;
      this.isTranslationInProgress = true;
      const data = {
        stringForTranslate: this.fromText,
        translatedLanguageText: this.countries[this.toLanguage],
        originalLanguageText: this.countries[this.fromLanguage],
      };
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      console.log(data);

      try {
        const response = await axios.post(
          "https://verbumscript.app:5000/v1/translate_text",
          data,
          config
        );

        this.toText = response.data.results;
        console.log(this.toText);

        this.notify("Text successfully sent to translate!", "success");
      } catch (error) {
        console.error("Translation failed:", error);
      } finally {
        this.isTranslationInProgress = false;
        this.loadingScreen = false;
      }
    },
  },
};
</script>
    
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  min-height: 100vh;
  background: #5372f0;
}
.container {
  min-width: 100%;
  padding: 30px;
  background: #fff;
  border-radius: 7px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.01);
}
.wrapper {
  border-radius: 5px;
  border: 1px solid #ccc;
}
.wrapper .text-input {
  display: flex;
  border-top: 1px solid #ccc;
}
.text-input .to-text {
  border-radius: 0px;
  border-left: 1px solid #ccc;
}
.text-input textarea {
  height: 330px;
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  background: none;
  padding: 10px 15px;
  border-radius: 5px;
}
.text-input textarea::placeholder {
  color: #b7b6b6;
}
.controls,
li,
.icons,
.icons i {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.controls {
  list-style: none;
  padding: 12px 15px;
  margin: 0;
}
.controls .row .icons {
  width: 38%;
}
.controls .row .icons i {
  width: 50px;
  color: #adadad;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s ease;
  justify-content: center;
}
.controls .row.from .icons {
  padding-right: 15px;
  border-right: 1px solid #ccc;
}
.controls .row.to .icons {
  padding-left: 15px;
  border-left: 1px solid #ccc;
}
.controls .row select {
  color: #333;
  border: none;
  outline: none;
  font-size: 16px;
  background: none;
  padding-left: 5px;
}
.text-input textarea::-webkit-scrollbar {
  width: 4px;
}
.controls .row select::-webkit-scrollbar {
  width: 8px;
}
.text-input textarea::-webkit-scrollbar-track,
.controls .row select::-webkit-scrollbar-track {
  background: #fff;
}
.text-input textarea::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 8px;
}
.controls .row select::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 8px;
  border-right: 2px solid #ffffff;
}
.controls .exchange {
  color: #adadad;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s ease;
}
.controls i:active {
  transform: scale(0.9);
}
.translateBtn {
  width: 100%;
  height: 50px !important;
  padding: 14px;
  outline: none;
  border: none;
  color: #fff;
  cursor: pointer;
  margin-top: 20px;
  font-size: 16px;
  border-radius: 5px;
}

@media (max-width: 660px) {
  .container {
    padding: 20px;
  }
  .wrapper .text-input {
    flex-direction: column;
  }
  .text-input .to-text {
    border-left: 0px;
    border-top: 1px solid #ccc;
  }
  .text-input textarea {
    height: 185px;
  }
  .controls .row .icons {
    display: none;
  }
  .container button {
    padding: 13px;
    font-size: 16px;
  }
  .controls .row select {
    font-size: 16px;
  }
  .controls .exchange {
    font-size: 14px;
  }
  textarea.text-original {
    border-bottom: 1px solid #ccc !important;
    border-radius: 0 !important;
  }
  textarea.translate-text {
    border-left: unset !important;
  }
}
textarea.translate-text {
  border-radius: 0px !important;
  border-left: 1px solid #ccc;
}
li.row.to,
li.row.from {
  flex-wrap: nowrap;
}
.box-1,
.box-2 {
  width: 100%;
  position: relative;
}
.box-1 button,
.box-2 button {
  position: absolute;
  right: 0;
}
.loading-screen {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 10;
  background: #0000009e;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
    