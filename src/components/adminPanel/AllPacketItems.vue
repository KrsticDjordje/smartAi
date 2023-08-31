<template>
  <div>
    <div class="content-container box" style="padding: 25px">
      <v-card-title class="textChannel" style="margin: 0; padding: 0"
        >All packet items</v-card-title
      >
      <v-card
        class="mx-auto mt-5"
        outlined
        v-for="user in getGroups"
        :key="user.id"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="text-p">{{
              user.name
            }}</v-list-item-title>
            <div class="text-overline mb-4">{{ user.email }}</div>
          </v-list-item-content>

          <v-card-actions>
            <v-dialog v-model="user.openDialog" max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mr-2"
                  outlined
                  rounded
                  text
                  v-bind="attrs"
                  v-on="on"
                  color="purple"
                  @click="editUser(user.id)"
                >
                  <span class="mdi mdi-file-edit"></span> Edit</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Change Group</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="Change name"
                          v-model="user.name"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                          v-model="selectedGroup"
                          :items="groupsList"
                          outlined
                          dense
                          chips
                          small-chips
                          label="Select the user you want to add to the group"
                          multiple
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
                    @click="user.openDialog = false"
                    >Close</v-btn
                  >
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="saveChanges(user, selectedGroup)"
                    >Save</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="user.openDialogDelete" max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  rounded
                  text
                  color="red"
                >
                  <span class="mdi mdi-trash-can"></span>
                  <v-icon end icon="mdi-cancel"></v-icon> Delete</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Delete group</span>
                </v-card-title>
                <v-card-text
                  >Are you sure you want to delete this group?</v-card-text
                >

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="user.openDialogDelete = false"
                    >No</v-btn
                  >
                  <v-btn color="red darken-1" text @click="deleteUser(user)"
                    >Yes</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-actions>
        </v-list-item>
      </v-card>
    </div>
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
import { mapGetters, mapActions } from "vuex";

import axios from "axios";

export default {
  name: "NewUserCreate",
  data: () => ({
    snackbar: {
      show: false,
      message: "",
      timeout: 3000,
      color: "success",
    },
    showSnackbar: false,
    selectedGroup: [],
  }),
  mounted() {
    this.fetchUsers();
  },
  computed: {
    ...mapGetters(["getUsers"]),
    ...mapGetters(["getGroups"]),
    groupsList() {
      return this.getUsers.map((user) => user.name);
    },
  },
  methods: {
    ...mapActions(["fetchUsers"]),
    async editUser(userId) {
      console.log(userId, "radi");
      try {
        const response = await axios.get(`api/edit`);
        this.getOneUser = response.data.result.groups;

        // Podesi izabrane grupe na osnovu korisnika koji se trenutno menja
        this.selectedGroup = this.getOneUser.users.map((users) => users.name);
      } catch (error) {
        console.error("Error:", error);
        this.getOneUser = null;
      }
    },
    async deleteUser(user) {
      const index = this.getGroups.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        this.getGroups.splice(index, 1);
      }

      try {
        const response = await axios.post("api/delete", {
          groupId: user.id,
        });
        this.snackbar.message = "You have successfully delete group";
        this.snackbar.color = "success";
        this.snackbar.show = true;
        user.openDialog = false;
        console.log("Korisnik uspešno obrisan:", response.data);
      } catch (error) {
        this.snackbar.message = "Failed";
        this.snackbar.color = "error";
        console.error("Greška pri brisanju korisnika:", error);
      }
    },
    async saveChanges(user, selectedGroup) {
      try {
        const data = {
          groupId: user.id,
          name: user.name,
          userIds: selectedGroup.map((groupName) => {
            const group = this.getUsers.find(
              (group) => group.name === groupName
            );
            return group.id;
          }),
        };
        console.log(data);
        await axios.post("editgroup/api", data);
        this.snackbar.message = "You have successfully saved your changes";
        this.snackbar.color = "success";
        this.snackbar.show = true;
        user.openDialog = false;
        console.log("Promene uspešno sačuvane");
      } catch (error) {
        this.snackbar.message = "Failed";
        this.snackbar.color = "error";
        console.error("Greška pri čuvanju promena:", error);
      }
    },
  },
};
</script>
    