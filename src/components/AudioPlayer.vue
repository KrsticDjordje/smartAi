<template>
  <div class="text-center mb-4">
    <v-bottom-sheet inset :no-click="true" :hide-overlay="true">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="red"
          dark
          v-bind="attrs"
          v-on="on"
          @click="togglePlayPause"
          >Open Player</v-btn
        >
      </template>
      <v-card tile>
        <v-progress-linear
          :value="(currentTime / duration) * 100"
          class="my-0"
          height="3"
        ></v-progress-linear>

        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Subtitle</v-list-item-title>
              <v-list-item-subtitle>Chunk 3</v-list-item-subtitle>
            </v-list-item-content>

            <v-spacer></v-spacer>

            <v-list-item-icon>
              <v-btn icon @click="rewindAudio">
                <v-icon>mdi-rewind</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }">
              <v-btn icon @click="togglePlayPause">
                <v-icon>{{ isPlaying ? "mdi-pause" : "mdi-play" }}</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon
              class="ml-0"
              :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }"
            >
              <v-btn icon @click="fastForwardAudio">
                <v-icon>mdi-fast-forward</v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      audio: new Audio("https://www.computerhope.com/jargon/m/example.mp3"),
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    };
  },
  methods: {
    togglePlayPause() {
      if (this.isPlaying) {
        this.audio.pause();
      } else {
        this.audio.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    rewindAudio() {
      this.audio.currentTime -= 10; // Pomeri se unazad za 10 sekundi
    },
    fastForwardAudio() {
      this.audio.currentTime += 10; // Pomeri se unapred za 10 sekundi
    },
  },
  mounted() {
    this.audio.addEventListener("timeupdate", () => {
      this.currentTime = this.audio.currentTime;
      this.duration = this.audio.duration;
    });
    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;
    });
  },
};
</script>
  