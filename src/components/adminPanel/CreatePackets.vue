<template>
  <div>
    <div class="content-container box" style="padding: 25px">
      <v-card-title class="textChannel" style="margin: 0; padding: 0"
        >Create packet item</v-card-title
      >
      <v-form ref="form" v-model="valid" @submit.prevent="createPacketItem">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="packetItemName"
              :rules="nameRules"
              :counter="32"
              label="Packet item name"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card class="mt-5">
          <v-btn :disabled="!valid" color="success" class="mr-4" type="submit">
            Create
          </v-btn>
        </v-card>
      </v-form>
    </div>
    <AllPacketItems />
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
import AllPacketItems from "@/components/adminPanel/AllPacketItems.vue";

export default {
  components: { AllPacketItems },
  data: () => ({
    date: null,
    valid: false,
    showAlert: false,
    alertType: "",
    alertMessage: "",
    packetItemName: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 32 || "Name must be less than 32 characters",
    ],
  }),
  mounted() {},
  computed: {
    ...mapGetters(["getGroups"]),
  },
  methods: {
    async createPacketItem() {
      if (!this.$refs.form.validate()) {
        // Provera da li su svi validacijski uslovi ispunjeni
        this.$refs.form.resetValidation(); // Resetovanje validacije
        this.$refs.form.reset(); // Resetovanje forme (prazni polja)
        return; // Zaustavlja se izvršavanje metode kako se ne bi slao zahtev
      }
      const organization_id = JSON.parse(
        localStorage.getItem("user")
      ).organization_id;
      const requestData = {
        name: this.packetItemName,
        token: "test",
      };

      try {
        const response = await axios.post(
          "http://49.12.0.17:8000/api/frontend/createPacketItem",
          requestData
        );

        if (response.status === 200) {
          console.log("Packet item created successfully!");
          this.packetItemName = "";
          this.showAlert = true;
          this.alertType = "success";
          this.alertMessage = "Packet item created successfully!";
          setTimeout(() => {
            this.showAlert = false;
          }, 3000);
          this.$refs.form.resetValidation(); // Resetovanje validacije
        } else {
          console.error("Error creating group:", response.statusText);
        }
      } catch (error) {
        this.showAlert = true;
        this.alertType = "error";
        this.alertMessage = '"Error creating packet item"';
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
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
    