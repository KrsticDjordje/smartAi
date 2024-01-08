<template>
  <v-container class="container">
    <v-row class="wrapper">
      <v-col class="text-input">
        <textarea
          class="text-original"
          v-model="fromText"
          label="Enter text"
          spellcheck="false"
          placeholder="Enter text"
          @input="updateCharacterCount"
        ></textarea>
        <textarea
          class="translate-text"
          v-model="toText"
          readonly
          disabled
          label="Translation"
          spellcheck="false"
          placeholder="Translation"
        ></textarea>
      </v-col>
      <div
        class="character-count mt-2 ml-4 text-left"
        style="font-size: 12px; color: #7f7f7f"
      >
        {{ fromText.length }} characters
      </div>
      <v-row class="controls">
        <v-col class="row from">
          <v-select
            v-model="fromLanguage"
            :items="countryOptions"
            label="From"
          ></v-select>
        </v-col>
        <v-col class="exchange">
          <v-icon @click="exchangeLanguages">mdi-swap-horizontal</v-icon>
        </v-col>
        <v-col class="row to">
          <v-select
            v-model="toLanguage"
            :items="countryOptions"
            label="To"
          ></v-select>
        </v-col>
      </v-row>
    </v-row>
    <v-btn class="translateBtn btn-style" @click="translateText"
      >Translate Text</v-btn
    >
  </v-container>
</template>
    
    <script>
export default {
  data() {
    return {
      countries: {
        "am-ET": "Amharic",
        "ar-SA": "Arabic",
        "be-BY": "Bielarus",
        "bem-ZM": "Bemba",
        "bi-VU": "Bislama",
        "bjs-BB": "Bajan",
        "bn-IN": "Bengali",
        "bo-CN": "Tibetan",
        "br-FR": "Breton",
        "bs-BA": "Bosnian",
      },
      fromText: "",
      toText: "",
      fromLanguage: "en-GB", // default values
      toLanguage: "hi-IN", // default values
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
    exchangeLanguages() {
      [this.fromLanguage, this.toLanguage] = [
        this.toLanguage,
        this.fromLanguage,
      ];
    },
    translateText() {
      // Implement translation logic
      // You can use external translation APIs or libraries for this
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
  border-bottom: 1px solid #ccc;
}
.text-input .to-text {
  border-radius: 0px;
  border-left: 1px solid #ccc;
}
.text-input textarea {
  height: 390px;
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
  background: #5372f0;
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
    height: 280px;
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
}
textarea.translate-text {
  border-radius: 0px !important;
  border-left: 1px solid #ccc !important;
}
li.row.to,
li.row.from {
  flex-wrap: nowrap;
}
</style>
    