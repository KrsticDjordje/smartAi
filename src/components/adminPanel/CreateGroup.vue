<template>
  <div>
    <v-btn class="mx-2 d-flex" fab dark small @click="expand = !expand">
      <v-icon dark> mdi-plus </v-icon>
    </v-btn>
    <v-expand-transition>
      <div class="content-container box" style="padding: 25px" v-show="expand">
        <v-card-title class="textChannel" style="margin: 0; padding: 0"
          >Create group</v-card-title
        >
        <v-form ref="form" v-model="valid" @submit.prevent="create">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="groupName"
                :rules="nameRules"
                :counter="32"
                label="Group name"
                required
              ></v-text-field>
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
    <AllGroups />
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
import AllGroups from "./AllGroups.vue";

export default {
  components: { AllGroups },
  data: () => ({
    expand: false,
    date: null,
    valid: false,
    showAlert: false,
    data: "",
    alertType: "",
    search: null,
    alertMessage: "",
    groupName: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 32 || "Name must be less than 32 characters",
    ],
  }),
  mounted() {},
  computed: {},
  methods: {
    async create() {
      console.log(this.getCompanies);
      if (!this.$refs.form.validate()) {
        // Provera da li su svi validacijski uslovi ispunjeni
        this.$refs.form.resetValidation(); // Resetovanje validacije
        this.$refs.form.reset(); // Resetovanje forme (prazni polja)
        return; // Zaustavlja se izvršavanje metode kako se ne bi slao zahtev
      }

      const company_id = JSON.parse(localStorage.getItem("user")).company_id;
      const requestData = {
        name: this.groupName,
        token: "test",
        company_id: company_id,
      };
      console.log(requestData, "dobijeno");
      try {
        const response = await axios.post(
          "https://verbumscript.app:8080/api/frontend/createGroup",
          requestData
        );

        if (response.status === 200) {
          console.log("Group created successfully!");
          this.groupName = "";
          this.notify("Group created successfully!", "success");
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
        