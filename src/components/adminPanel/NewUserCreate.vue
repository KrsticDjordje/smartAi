<template>
  <div>
    <div class="content-container box" style="padding: 25px">
      <v-card-title class="textChannel" style="margin: 0; padding: 0"
        >Create new user</v-card-title
      >
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="name"
              :counter="10"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>
          </v-col>
        </v-row>

        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          autocomplete="new-email"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="show1 ? 'text' : 'password'"
          name="input-10-1"
          label="Password"
          hint="At least 8 characters"
          autocomplete="new-password"
          counter
          @click:append="show1 = !show1"
        ></v-text-field>

        <v-combobox
          v-model="model"
          :items="groupsList"
          :search-input.sync="search"
          hide-selected
          hint=""
          label="Add user to the group"
          multiple
          persistent-hint
          small-chips
        >
        </v-combobox>

        <v-card class="mt-5">
          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="submitForm"
          >
            Submit
          </v-btn>

          <v-btn color="error" class="mr-4" @click="resetForm">
            Reset Form
          </v-btn>
        </v-card>
      </v-form>
    </div>

    <AllUsers />
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
    >
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="showSnackbar" bottom color="success" :timeout="2000">
      Text copied!
    </v-snackbar>
  </div>
</template>
  
  <script>
import axios from "axios";
import AllUsers from "@/components/adminPanel/AllUsers.vue";
import { mapGetters } from "vuex";

export default {
  name: "NewUserCreate",
  components: {
    AllUsers,
  },
  data: () => ({
    snackbar: {
      show: false,
      message: "",
      timeout: 3000,
      color: "success",
    },
    showSnackbar: false,
    groupIds: [],
    model: [],
    search: null,
    show1: false,
    password: "",
    rules: {
      required: (value) => !!value || "Required.",
      emailMatch: () => `The email and password you entered don't match`,
      min: (value) => (value && value.length >= 8) || "At least 8 characters",
    },
    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 15) || "Name must be less than 15 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    checkbox: false,
  }),

  watch: {
    model(val) {
      if (val.length > 5) {
        this.$nextTick(() => this.model.pop());
      }
    },
  },
  mounted() {},
  created() {
    this.openDialogs = new Array(this.getUsers.length).fill(false);
  },
  computed: {
    ...mapGetters(["getGroups"]),
    groupsList() {
      return this.getGroups.map((group) => group.name);
    },
  },
  methods: {
    closeDialog(index) {
      this.openDialogs[index] = false;
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    submitForm() {
      if (this.$refs.form.validate()) {
        const organization_id = JSON.parse(
          localStorage.getItem("user")
        ).organization_id;
        const role_id = JSON.parse(localStorage.getItem("user")).role_id;
        const requestData = {
          organization_id: organization_id,
          role_id: role_id,
          name: this.name,
          email: this.email,
          password: this.password,
          groupIds: this.model.map((groupName) => {
            const group = this.getGroups.find((g) => g.name === groupName);
            return group.id;
          }),
        };
        const requestDataJSON = JSON.stringify(requestData);
        console.log(requestDataJSON);

        axios
          .post("registration/api", requestData)
          .then((response) => {
            console.log(response.data);
            this.snackbar.message =
              "You have successfully created a user, please check your email";
            this.snackbar.color = "success";
            this.snackbar.show = true;
            this.resetForm();
          })
          .catch((error) => {
            console.log(error);
            this.snackbar.message = "Failed";
            this.snackbar.color = "error";
          });
      }
    },
    resetForm() {
      this.$refs.form.reset();
      this.resetValidation();
    },
  },
};
</script>
  
  