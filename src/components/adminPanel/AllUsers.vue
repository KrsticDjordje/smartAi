<template>
  <div class="content-container box" style="padding: 25px">
    <v-card-title class="textChannel" style="margin: 0; padding: 0"
      >All users <v-spacer></v-spacer> ({{ getUsers.length }})</v-card-title
    >

    <v-card
      class="mx-auto mt-5 items rounded-lg"
      outlined
      v-for="oneItem in getUsers"
      :key="oneItem.id"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-p">{{
            oneItem.name
          }}</v-list-item-title>
        </v-list-item-content>
        <v-card-actions>
          <v-dialog v-model="oneItem.openDialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-2"
                text
                rounded
                v-bind="attrs"
                v-on="on"
                color="blue"
                @click="edit(oneItem.id)"
              >
                <span class="mdi mdi-text-box-edit"></span> Edit
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Edit group</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Change name"
                        v-model="oneItem.name"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="existItem"
                        :items="listItems"
                        deletable-chips
                        multiple
                        chips
                        small-chips
                        label="Select user"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn color="red darken-1" text>LogOut</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="oneItem.openDialog = false"
                  >Close</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  text
                  @click="saveChanges(oneItem, oneItem.id, existItem)"
                  >Save</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="oneItem.openDialogDelete" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" text rounded color="red">
                <span class="mdi mdi-trash-can"></span>
                <v-icon end icon="mdi-cancel"></v-icon> Delete
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Delete user</span>
              </v-card-title>
              <v-card-text class="text-left"
                >Are you sure you want to delete this user?</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="oneItem.openDialogDelete = false"
                  >No</v-btn
                >
                <v-btn
                  color="red darken-1"
                  text
                  @click="deleteItem(oneItem.id, oneItem)"
                  >Yes</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-list-item>
    </v-card>
  </div>
</template>
        
<script>
import { mapGetters, mapActions } from "vuex";

import axios from "axios";

export default {
  name: "Company",
  data: () => ({
    selectedData: [],
    existItem: [],
    showAlert: false,
    alertType: "",
    alertMessage: "",
  }),
  async mounted() {
    try {
      await this.fetchUsers();
      await this.fetchGroups();
    } catch (error) {
      console.error("Greška pri dohvatanju:", error);
    }
  },
  computed: {
    ...mapGetters("groups", ["getGroups"]),
    ...mapGetters("users", ["getUsers"]),
    listItems() {
      return this.getGroups.map((oneItem) => oneItem.name);
    },
  },
  methods: {
    ...mapActions("groups", ["fetchGroups"]),
    ...mapActions("users", ["fetchUsers"]),
    async edit(dataId) {
      console.log(dataId, "radi");
      try {
        const response = await axios.post(
          "https://verbumscript.app:8080/api/frontend/getOneUser",
          {
            token: "test",
            userId: dataId,
          }
        );

        this.selectedData = response.data.response.user.groups;
        this.existItem = this.selectedData.map((groups) => groups.name);
        console.log(this.selectedData);
      } catch (error) {
        console.error("Error:", error);
        this.getOneUser = null;
      }
    },
    async deleteItem(id, item) {
      console.log(id, item);
      const index = this.getUsers.findIndex((u) => u.id === item.id);
      if (index !== -1) {
        this.getUsers.splice(index, 1);
      }
      try {
        const user_id = JSON.parse(localStorage.getItem("user")).id;
        const response = await axios.post(
          "https://verbumscript.app:8080/api/frontend/deleteUser",
          {
            userIdForAction: user_id,
            userIdForDelete: id,
            token: "test",
          }
        );
        console.log("Uspešno obrisano:", response.data);
        this.notify("User deleted successfully!", "success");
      } catch (error) {
        this.notify("Failed!", "error");
        console.error("Greška pri brisanju korisnika:", error);
      }
    },
    async saveChanges(oneItem, id, existItem) {
      try {
        const data = {
          userId: id,
          groupIds: existItem.map((groupName) => {
            const group = this.getGroups.find(
              (group) => group.name === groupName
            );
            return group.id;
          }),
          token: "test",
        };
        console.log(data, "saveChanges");
        await axios.post(
          "https://verbumscript.app:8080/api/frontend/editForEveryUser",
          data
        );
        oneItem.openDialog = false;
        console.log("Promene uspešno sačuvane");
        this.notify("Company edit successfully!", "success");
      } catch (error) {
        console.error("Greška pri čuvanju promena:", error);
        this.notify("Failed!", "error");
      }
    },
  },
};
</script>
            