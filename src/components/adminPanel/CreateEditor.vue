<template>
  <div>
    <v-btn class="mx-2 d-flex" fab dark small @click="expand = !expand">
      <v-icon dark> mdi-plus </v-icon>
    </v-btn>
    <v-expand-transition>
      <div class="content-container box" style="padding: 25px" v-show="expand">
        <v-card-title class="textChannel" style="margin: 0; padding: 0"
          >Create editor</v-card-title
        >
        <v-form ref="form" v-model="valid" @submit.prevent="create">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                :rules="nameRules"
                :counter="32"
                label="Name"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="surname"
                :rules="nameRules"
                :counter="32"
                label="Surname"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="userName"
                :rules="nameRules"
                :counter="32"
                label="Username"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="password"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="showPass ? 'text' : 'password'"
                name="input-10-1"
                autocomplete="new-password"
                label="Password"
                hint="At least 8 characters"
                counter
                @click:append="showPass = !showPass"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                :counter="32"
                label="Email"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="phoneNumber"
                :rules="nameRules"
                :counter="32"
                label="Phone number"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="address"
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
                v-model="groupsIds"
                :items="listItems"
                label="Add in group"
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
            <v-btn color="error" rounded class="mr-4" @click="reset">
              Clear Form
            </v-btn>
          </v-card>
        </v-form>
      </div>
    </v-expand-transition>
    <AllEditors />
    <transition name="fade" mode="out-in">
      <v-alert v-if="showAlert" :type="alertType" key="alert">
        {{ alertMessage }}
      </v-alert>
    </transition>
  </div>
</template>
            
        <script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import AllEditors from "./AllEditors.vue";

export default {
  components: { AllEditors },
  data: () => ({
    showPass: false,
    expand: false,
    date: null,
    valid: false,
    showAlert: false,
    data: "",
    alertType: "",
    search: null,
    alertMessage: "",
    name: "",
    surname: "",
    email: "",
    userName: "",
    password: "",
    phoneNumber: "",
    address: "",
    PIB: "",
    groupsIds: [],
    rules: {
      required: (value) => !!value || "Required.",
      emailMatch: () => `The email and password you entered don't match`,
      min: (value) => (value && value.length >= 8) || "At least 8 characters",
    },
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 20) || "Name must be less than 20 characters",
    ],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
  }),
  mounted() {},
  computed: {
    ...mapGetters("groups", ["getGroups"]),
    listItems() {
      return this.getGroups.map((oneItem) => oneItem.name);
    },
  },
  methods: {
    reset() {
      this.$refs.form.reset();
    },
    async create() {
      console.log(this.getCompanies);
      if (!this.$refs.form.validate()) {
        // Provera da li su svi validacijski uslovi ispunjeni
        this.$refs.form.resetValidation(); // Resetovanje validacije
        this.$refs.form.reset(); // Resetovanje forme (prazni polja)
        return; // Zaustavlja se izvršavanje metode kako se ne bi slao zahtev
      }

      const company_id = JSON.parse(localStorage.getItem("user")).company_id;
      const user_id = JSON.parse(localStorage.getItem("user")).id;
      const requestData = {
        userId: user_id,
        name: this.name,
        surname: this.surname,
        company_id: company_id,
        email: this.email,
        username: this.userName,
        password: this.password,
        phone_number: this.phoneNumber,
        address: this.address,
        unique_user_number: this.PIB,
        token_of_user: "10000",
        token: "test",
        groupIds: [],
      };
      console.log(requestData, "dobijeno");
      try {
        const response = await axios.post(
          "https://verbumscript.app:8080/api/frontend/registrationForEditor",
          requestData
        );

        if (response.status === 200) {
          console.log("User created successfully!");
          this.name = "";
          this.showAlert = true;
          this.alertType = "success";
          this.alertMessage = "User created successfully!";
          setTimeout(() => {
            this.showAlert = false;
          }, 3000);

          this.$refs.form.resetValidation(); // Resetovanje validacije
        } else {
          console.error("Error creating user:", response.statusText);
        }
      } catch (error) {
        this.showAlert = true;
        this.alertType = "error";
        this.alertMessage = '"Error creating packet item"';
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
        console.error("Error creating user:", error);
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
            