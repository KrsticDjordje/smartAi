<template>
  <div>
    <div class="content-container box" style="padding: 25px">
      <v-card-title class="textChannel" style="margin: 0; padding: 0"
        >Create a group</v-card-title
      >
      <v-form ref="form" v-model="valid" @submit.prevent="createGroup">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="groupname"
              :rules="nameRules"
              :counter="32"
              label="Group name"
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

    <AllGroups />
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
import AllGroups from "@/components/adminPanel/AllGroups.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    AllGroups,
  },
  data: () => ({
    date: null,
    valid: false,
    showSnackbar: false,
    snackbar: {
      show: false,
      message: "",
      timeout: 3000,
      color: "success",
    },
    groupname: "",
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
    async createGroup() {
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
        name: this.groupname,
        organizationId: organization_id,
      };

      try {
        const response = await axios.post("insertGroup/api", requestData);

        if (response.status === 200) {
          this.snackbar.message = "You have successfully created a group";
          this.snackbar.color = "success";
          this.snackbar.show = true;
          console.log("Group created successfully!");
          this.groupname = "";
          this.$refs.form.resetValidation(); // Resetovanje validacije
        } else {
          this.snackbar.message = "Error, you have not created a group";
          this.snackbar.color = "error";
          console.error("Error creating group:", response.statusText);
        }
      } catch (error) {
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
  