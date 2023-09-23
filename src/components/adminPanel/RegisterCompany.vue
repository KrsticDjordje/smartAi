<template>
  <div>
    <v-btn class="mx-2 d-flex" fab dark small @click="expand = !expand">
      <v-icon dark> mdi-plus </v-icon>
    </v-btn>
    <v-expand-transition>
      <div class="content-container box" style="padding: 25px" v-show="expand">
        <v-card-title class="textChannel" style="margin: 0; padding: 0"
          >Register company</v-card-title
        >
        <v-form ref="form" v-model="valid" @submit.prevent="createPackets">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="companyName"
                :rules="nameRules"
                :counter="32"
                label="Company name"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="companyAdress"
                :rules="nameRules"
                :counter="32"
                label="Adress"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="PIB"
                :rules="nameRules"
                :counter="32"
                label="PIB"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-combobox
                v-model="packetItems"
                :items="itemList"
                label="Add packet"
                :search-input.sync="search"
                hint=""
                dense
                deletable-chips
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
            <v-btn rounded color="error" @click="clear"> Clear </v-btn>
          </v-card>
        </v-form>
      </div>
    </v-expand-transition>
    <AllCompanies />
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
import AllCompanies from "./AllCompanies.vue";

export default {
  components: { AllPackets, AllCompanies },
  data: () => ({
    expand: false,
    date: null,
    valid: false,
    search: null,
    showAlert: false,
    packetItems: "",
    alertType: "",
    alertMessage: "",
    companyAdress: "",
    companyName: "",
    PIB: "",
    nameRules: [
      (v) => !!v || "This field is required",
      (v) => v.length <= 32 || "Name must be less than 32 characters",
    ],
  }),
  mounted() {},
  computed: {
    ...mapGetters("packets", ["getPackets"]),
    itemList() {
      return this.getPackets.map((item) => item.name);
    },
  },
  methods: {
    clear() {
      this.companyName = "";
      this.companyAdress = "";
      this.PIB = "";
      this.$refs.observer.reset();
    },
    async createPackets() {
      if (!this.$refs.form.validate()) {
        // Provera da li su svi validacijski uslovi ispunjeni
        this.$refs.form.resetValidation(); // Resetovanje validacije
        this.$refs.form.reset(); // Resetovanje forme (prazni polja)
        return; // Zaustavlja se izvršavanje metode kako se ne bi slao zahtev
      }

      // Pronalazi odgovarajući objekt paketa na temelju naziva
      const selectedPacket = this.getPackets.find(
        (packet) => packet.name === this.packetItems
      );

      if (!selectedPacket) {
        console.error("Paket nije pronađen.");
        return;
      }
      const requestData = {
        token: "test",
        name: this.companyName,
        pib: this.PIB,
        address: this.companyAdress,
        packet_id: selectedPacket.id,
      };
      console.log(requestData, "dobijeno");
      try {
        const response = await axios.post(
          "https://certoe.de:8080/api/frontend/createCompany",
          requestData
        );

        if (response.status === 200) {
          console.log("Packet item created successfully!");
          this.packetsName = "";
          this.showAlert = true;
          this.alertType = "success";
          this.alertMessage = "Company created successfully!";
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
        this.alertMessage = '"Error creating company"';
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
        