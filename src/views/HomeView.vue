<template>
  <div>
    <v-btn class="d-flex ml-5" rounded color="#5D5FEF" dark> + Upload </v-btn>
    <v-card
      class="mx-auto mb-8 mt-5 transcriptionBox"
      style="padding: 10px"
      max-width="97%"
    >
      <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>
      <div class="d-flex align-items-center">
        <v-card-title>Title Transcriptions</v-card-title> <v-spacer></v-spacer>
        <v-btn color="deep-purple lighten-2" text @click="reserve">
          Reserve
        </v-btn>
        <v-btn color="deep-red lighten-2" text @click="reserve"> Delete </v-btn>
      </div>
      <v-divider class="mx-4"></v-divider>
      <div class="text-left">
        <v-card-subtitle class="my-0 text-h6">Chunk title</v-card-subtitle>
        <v-card-text class="chunkText">
          Chunk text Chunk text Chunk text Chunk text Chunk text Chunk text
          Chunk text
        </v-card-text>
      </div>
      <v-divider class="mx-4"></v-divider>
      <v-divider class="mx-4"></v-divider>
      <div class="text-left">
        <v-card-subtitle class="my-0 text-h6">Chunk title</v-card-subtitle>
        <v-card-text class="chunkText">
          Chunk text Chunk text Chunk text Chunk text Chunk text Chunk text
          Chunk text
        </v-card-text>
      </div>
      <v-divider class="mx-4"></v-divider>

      <v-card-text>
        <v-chip-group
          v-model="selection"
          active-class="deep-purple accent-4 white--text"
          column
        >
          <v-chip>Keywords</v-chip>

          <v-chip>Keywords</v-chip>

          <v-chip>People</v-chip>

          <v-chip>People</v-chip>
        </v-chip-group>
      </v-card-text>

      <audio ref="recordedAudio" controls>
        Your browser does not support the audio element.
      </audio>
    </v-card>

    <v-card
      class="mx-auto mb-8 mt-5 transcriptionBox"
      max-width="97%"
      style="padding: 10px"
    >
      <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>
      <div class="d-flex align-items-center">
        <v-card-title>Title Transcriptions</v-card-title> <v-spacer></v-spacer>
        <v-btn color="deep-purple lighten-2" text @click="reserve">
          Reserve
        </v-btn>
        <v-btn color="deep-red lighten-2" text @click="reserve"> Delete </v-btn>
      </div>
      <v-divider class="mx-4"></v-divider>
      <div class="text-left">
        <v-card-subtitle class="my-0 text-h6">Chunk title</v-card-subtitle>
        <v-card-text class="chunkText">
          Chunk text Chunk text Chunk text Chunk text Chunk text Chunk text
          Chunk text
        </v-card-text>
      </div>
      <v-divider class="mx-4"></v-divider>
      <v-divider class="mx-4"></v-divider>
      <div class="text-left">
        <v-card-subtitle class="my-0 text-h6">Chunk title</v-card-subtitle>
        <v-card-text class="chunkText">
          Chunk text Chunk text Chunk text Chunk text Chunk text Chunk text
          Chunk text
        </v-card-text>
      </div>
      <v-divider class="mx-4"></v-divider>

      <v-card-text>
        <v-chip-group
          v-model="selection"
          active-class="deep-purple accent-4 white--text"
          column
        >
          <v-chip>Keywords</v-chip>

          <v-chip>Keywords</v-chip>

          <v-chip>People</v-chip>

          <v-chip>People</v-chip>
        </v-chip-group>
      </v-card-text>

      <audio ref="recordedAudio" controls>
        Your browser does not support the audio element.
      </audio>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  components: {},
};
</script>
<style scoped>
audio {
  width: 100%;
  background: #f1f3f4;
  border-radius: 20px 20px 0 0;
  margin-bottom: -7px;
}
.theme--light.v-chip:not(.v-chip--active) {
  background: #7172f1;
  color: white;
}
</style>
