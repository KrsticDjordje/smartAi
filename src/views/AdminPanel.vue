<template>
  <div>
    <div class="box mt-0 mb-3">
      <v-card class="channelsBox" style="background: transparent !important">
        <v-card class="btnMain">
          <v-btn
            rounded
            class="btn-style"
            :class="{ active: selectedButton === 'group' }"
            @click="selectedButton = 'group'"
          >
            Create New Group
          </v-btn>
        </v-card>
        <v-card class="btnMain">
          <v-btn
            rounded
            class="btn-style"
            :class="{ active: selectedButton === 'user' }"
            @click="selectedButton = 'user'"
          >
            Create New User
          </v-btn>
        </v-card>
        <v-card class="btnMain">
          <v-btn
            rounded
            class="btn-style"
            :class="{ active: selectedButton === 'editor' }"
            @click="selectedButton = 'editor'"
          >
            Create Editor
          </v-btn>
        </v-card>
        <v-card class="btnMain">
          <v-btn
            rounded
            class="btn-style"
            :class="{ active: selectedButton === 'packetItems' }"
            @click="selectedButton = 'packetItems'"
          >
            Create Packet Items
          </v-btn>
        </v-card>
        <v-card class="btnMain">
          <v-btn
            rounded
            class="btn-style"
            :class="{ active: selectedButton === 'packets' }"
            @click="selectedButton = 'packets'"
          >
            Create Packets
          </v-btn>
        </v-card>
        <v-card class="btnMain">
          <v-btn
            rounded
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
    <RegisterCompany v-if="selectedButton === 'company'" />
    <CreateGroup v-if="selectedButton === 'group'" />
    <CreateUser v-if="selectedButton === 'user'" />
    <CreateEditor v-if="selectedButton === 'editor'" />
  </div>
</template>

<script>
import CreatePacketItem from "@/components/adminPanel/CreatePacketItem.vue";
import CreatePackets from "@/components/adminPanel/CreatePackets.vue";
import RegisterCompany from "@/components/adminPanel/RegisterCompany.vue";
import CreateGroup from "@/components/adminPanel/CreateGroup.vue";
import CreateUser from "@/components/adminPanel/CreateUser.vue";
import CreateEditor from "@/components/adminPanel/CreateEditor.vue";

export default {
  name: "EditPanel",
  components: {
    CreatePacketItem,
    CreatePackets,
    RegisterCompany,
    CreateGroup,
    CreateUser,
    CreateEditor,
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
