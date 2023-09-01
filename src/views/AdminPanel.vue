<template>
  <div>
    <div class="content-container box">
      <v-card class="channelsBox">
        <v-card class="btnMain">
          <v-btn
            class="btn-style"
            :class="{ active: selectedButton === 'group' }"
            @click="selectedButton = 'group'"
          >
            Create New Group
          </v-btn>
        </v-card>
        <v-card class="btnMain">
          <v-btn
            class="btn-style"
            :class="{ active: selectedButton === 'user' }"
            @click="selectedButton = 'user'"
          >
            Create New User
          </v-btn>
        </v-card>
        <v-card class="btnMain">
          <v-btn
            class="btn-style"
            :class="{ active: selectedButton === 'packetItems' }"
            @click="selectedButton = 'packetItems'"
          >
            Create Packet Items
          </v-btn>
        </v-card>
        <v-card class="btnMain">
          <v-btn
            class="btn-style"
            :class="{ active: selectedButton === 'packets' }"
            @click="selectedButton = 'packets'"
          >
            Create Packets
          </v-btn>
        </v-card>
        <v-card class="btnMain">
          <v-btn
            class="btn-style"
            :class="{ active: selectedButton === 'company' }"
            @click="selectedButton = 'company'"
          >
            Register Company
          </v-btn>
        </v-card>
      </v-card>
    </div>
    <CreatePacketItem v-if="selectedButton === 'packetItems'" />
    <CreatePackets v-if="selectedButton === 'packets'" />
  </div>
</template>

<script>
import CreatePacketItem from "@/components/adminPanel/CreatePacketItem.vue";
import CreatePackets from "@/components/adminPanel/CreatePackets.vue";

export default {
  name: "EditPanel",
  components: {
    CreatePacketItem,
    CreatePackets,
  },
  data() {
    return {
      selectedButton: "group",
    };
  },
  methods: {},
};
</script>

<style scoped>
</style>
