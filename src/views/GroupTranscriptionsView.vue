<template>
  <div>
    <div class="box mt-0 mb-3">
      <v-card class="channelsBox" style="background: transparent !important">
        <v-card class="btnMain">
          <v-btn
            rounded
            class="btn-style"
            :class="{ active: selectedButton === 'upload' }"
            @click="selectedButton = 'upload'"
          >
            Group upload recordings
          </v-btn>
        </v-card>
        <v-card class="btnMain">
          <v-btn
            rounded
            class="btn-style"
            :class="{ active: selectedButton === 'screen' }"
            @click="selectedButton = 'screen'"
          >
            Group screen recordings
          </v-btn>
        </v-card>
        <v-card class="btnMain">
          <v-btn
            rounded
            class="btn-style"
            :class="{ active: selectedButton === 'audio' }"
            @click="selectedButton = 'audio'"
          >
            Group audio recordings
          </v-btn>
        </v-card>
      </v-card>
    </div>

    <group-audios v-if="selectedButton === 'audio'" />
    <group-screens v-if="selectedButton === 'screen'" />
    <group-uploads v-if="selectedButton === 'upload'" />
  </div>
</template>

<script>
import GroupAudios from "@/components/groupTranscription/groupAudios.vue";
import GroupScreens from "@/components/groupTranscription/groupScreens.vue";
import GroupUploads from "@/components/groupTranscription/groupUploads.vue";

export default {
  name: "EditPanel",
  components: {
    GroupAudios,
    GroupScreens,
    GroupUploads,
  },
  data() {
    return {
      selectedButton: "upload",
    };
  },
  methods: {},
};
</script>

<style scoped>
</style>
