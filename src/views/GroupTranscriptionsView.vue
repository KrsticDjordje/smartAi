<template>
  <div>
    <div class="box mt-0 mb-3">
      <v-select
        :items="groupItems"
        v-model="selectedGroupId"
        dense
        filled
        label="Select a group"
      ></v-select>
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

    <group-audios
      v-if="selectedButton === 'audio'"
      :groupId="selectedGroupId"
    />
    <group-screens
      v-if="selectedButton === 'screen'"
      :groupId="selectedGroupId"
    />
    <group-uploads
      v-if="selectedButton === 'upload'"
      :groupId="selectedGroupId"
    />
  </div>
</template>

<script>
import GroupAudios from "@/components/groupTranscription/groupAudios.vue";
import GroupScreens from "@/components/groupTranscription/groupScreens.vue";
import GroupUploads from "@/components/groupTranscription/groupUploads.vue";

export default {
  name: "GroupTranscription",
  components: {
    GroupAudios,
    GroupScreens,
    GroupUploads,
  },
  data() {
    return {
      selectedButton: "upload",
      groupItems: [],
      selectedGroupId: null,
    };
  },
  created() {
    this.getGroups();
  },
  methods: {
    getGroups() {
      const user = JSON.parse(localStorage.getItem("user"));
      const groupIds = user.groups.map((group) => ({
        text: group.name,
        value: group.id,
      }));
      this.groupItems = groupIds;

      if (this.groupItems.length > 0) {
        this.selectedGroupId = this.groupItems[0].value;
      }
    },
  },
};
</script>

<style scoped>
</style>
