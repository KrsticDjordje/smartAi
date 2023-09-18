<template>
  <div class="content-container box" style="padding: 25px">
    <v-card-title class="textChannel" style="margin: 0; padding: 0"
      >All companies <v-spacer></v-spacer> ({{
        getCompanies.length
      }})</v-card-title
    >

    <v-card
      class="mx-auto mt-5 items rounded-lg"
      outlined
      v-for="oneCompany in getCompanies"
      :key="oneCompany.id"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-p">{{
            oneCompany.name
          }}</v-list-item-title>
        </v-list-item-content>
        <v-card-actions>
          <v-dialog v-model="oneCompany.openDialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-2"
                text
                rounded
                v-bind="attrs"
                v-on="on"
                color="blue"
                @click="edit(oneCompany.id)"
              >
                <span class="mdi mdi-text-box-edit"></span> Edit
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Edit Company</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Change name"
                        v-model="oneCompany.name"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="selectedPackets"
                        :items="groupsList"
                        deletable-chips
                        dense
                        chips
                        small-chips
                        label="Select groups to add users to"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="oneCompany.openDialog = false"
                  >Close</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  text
                  @click="saveChanges(oneCompany, oneCompany.id)"
                  >Save</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="oneCompany.openDialogDelete" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" text rounded color="red">
                <span class="mdi mdi-trash-can"></span>
                <v-icon end icon="mdi-cancel"></v-icon> Delete
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Delete company</span>
              </v-card-title>
              <v-card-text class="text-left"
                >Are you sure you want to delete this company?</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="oneCompany.openDialogDelete = false"
                  >No</v-btn
                >
                <v-btn
                  color="red darken-1"
                  text
                  @click="deleteUser(oneCompany.id)"
                  >Yes</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-list-item>
    </v-card>
    <transition name="fade" mode="out-in">
      <v-alert v-if="showAlert" :type="alertType" key="alert">
        {{ alertMessage }}
      </v-alert>
    </transition>
  </div>
</template>
    
        
        <script>
import { mapGetters, mapActions } from "vuex";

import axios from "axios";

export default {
  name: "Company",
  data: () => ({
    selectedPackets: [],
    showAlert: false,
    alertType: "",
    alertMessage: "",
  }),
  async mounted() {
    try {
      await this.fetchCompanies();
      await this.fetchPackets();
    } catch (error) {
      console.error('Greška pri dohvatanju "companies":', error);
    }
  },
  computed: {
    ...mapGetters("companies", ["getCompanies"]),
    ...mapGetters("packets", ["getPackets"]),
    groupsList() {
      return this.getPackets.map((oneCompany) => oneCompany.name);
    },
  },
  methods: {
    ...mapActions("companies", ["fetchCompanies"]),
    ...mapActions("packets", ["fetchPackets"]),
    async edit(companyId) {
      console.log(companyId, "radi");
      try {
        const response = await axios.post(
          "http://49.12.0.17:8080/api/frontend/getOneCompany",
          {
            token: "test",
            companyId: companyId,
          }
        );

        this.selectedPackets = response.data.response.company.packet.name;
        console.log(this.selectedPackets);
      } catch (error) {
        console.error("Error:", error);
        this.getOneUser = null;
      }
    },
    async deleteUser(id) {
      console.log(id, "radiii");
      try {
        const response = await axios.post(
          "http://49.12.0.17:8080/api/frontend/deleteCompany",
          {
            packetsId: id,
            token: "test",
          }
        );
        console.log("Korisnik uspešno obrisan:", response.data);
        this.showAlert = true;
        this.alertType = "success";
        this.alertMessage = "Company deleted successfully!";
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
      } catch (error) {
        this.showAlert = true;
        this.alertType = "error";
        this.alertMessage = "Failed!";
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
        console.error("Greška pri brisanju korisnika:", error);
      }
    },
    async saveChanges(oneCompany, id) {
      const selectedPacket = this.getPackets.find(
        (packet) => packet.name === this.selectedPackets
      );
      try {
        const data = {
          token: "test",
          companyId: id,
          packetId: selectedPacket.id,
          name: oneCompany.name,
        };
        console.log(data, "saveChanges companies");
        await axios.post(
          "http://49.12.0.17:8080/api/frontend/editCompany",
          data
        );
        oneCompany.openDialog = false;
        console.log("Promene uspešno sačuvane");
        this.showAlert = true;
        this.alertType = "success";
        this.alertMessage = "Company edit successfully!";
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
      } catch (error) {
        console.error("Greška pri čuvanju promena:", error);
        this.showAlert = true;
        this.alertType = "error";
        this.alertMessage = "Failed!";
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
      }
    },
  },
};
</script>
        