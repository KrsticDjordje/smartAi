<template>
  <div>
    <v-btn class="mx-2 d-flex" fab dark small @click="expand = !expand">
      <v-icon dark> mdi-plus </v-icon>
    </v-btn>
    <v-expand-transition>
      <div class="content-container box" style="padding: 25px" v-show="expand">
        <v-card-title class="textChannel" style="margin: 0; padding: 0"
          >Create packets</v-card-title
        >
        <v-form ref="form" v-model="valid" @submit.prevent="createPackets">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="packetsName"
                :rules="nameRules"
                :counter="32"
                label="Packets name"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-combobox
                v-model="packetItems"
                :items="itemList"
                label="Add packet items"
                hide-selected
                :search-input.sync="search"
                hint=""
                multiple
                persistent-hint
                small-chips
              ></v-combobox>
            </v-col>
          </v-row>
          <v-card class="mt-5">
            <v-btn
              rounded
              :disabled="!valid"
              color="success"
              class="mr-4"
              type="submit"
            >
              Create
            </v-btn>
          </v-card>
        </v-form>
      </div>
    </v-expand-transition>
    <AllPackets />
    <transition name="fade" mode="out-in">
      <v-alert v-if="showAlert" :type="alertType" key="alert">
        {{ alertMessage }}
      </v-alert>
    </transition>
  </div>
</template>
      
  <script>
import axios from "axios";

import { mapGetters } from "vuex";
import AllPackets from "@/components/adminPanel/AllPackets.vue";

export default {
  components: { AllPackets },
  data: () => ({
    expand: false,
    date: null,
    valid: false,
    showAlert: false,
    packetItems: [],
    alertType: "",
    search: null,
    alertMessage: "",
    packetsName: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 32 || "Name must be less than 32 characters",
    ],
  }),
  mounted() {},
  computed: {
    ...mapGetters("packetItems", ["getPacketItems"]),
    itemList() {
      return this.getPacketItems.map((item) => item.name);
    },
  },
  methods: {
    async createPackets() {
      if (!this.$refs.form.validate()) {
        // Provera da li su svi validacijski uslovi ispunjeni
        this.$refs.form.resetValidation(); // Resetovanje validacije
        this.$refs.form.reset(); // Resetovanje forme (prazni polja)
        return; // Zaustavlja se izvršavanje metode kako se ne bi slao zahtev
      }
      const requestData = {
        name: this.packetsName,
        token: "test",
        packetItemIds: this.packetItems.map((groupName) => {
          const group = this.getPacketItems.find((g) => g.name === groupName);
          return group.id;
        }),
      };
      console.log(requestData, "dobijeno");
      try {
        const response = await axios.post(
          "https://verbumscript.app:8080/api/frontend/createPacket",
          requestData
        );

        if (response.status === 200) {
          console.log("Packet item created successfully!");
          this.packetsName = "";
          this.notify("Packet item created successfully!", "success");
          this.$refs.form.resetValidation(); // Resetovanje validacije
        } else {
          console.error("Error creating group:", response.statusText);
        }
      } catch (error) {
        this.notify("Failed!", "error");
        console.error("Error creating group:", error);
      }
    },
    validate() {
      this.$refs.form.validate();
    },
  },
};
</script>
      <style scoped>
.colorGroup {
  background: #554ba9;
}
.v-card__actions {
  padding: 8px !important;
}
</style>
      