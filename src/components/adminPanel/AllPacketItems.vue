<template>
  <div class="content-container box" style="padding: 25px">
    <v-card-title class="textChannel" style="margin: 0; padding: 0"
      >All packet items <v-spacer></v-spacer> ({{
        getPacketItems.length
      }})</v-card-title
    >

    <v-card
      class="mx-auto mt-5 items rounded-lg"
      outlined
      v-for="onePacketItem in getPacketItems"
      :key="onePacketItem.id"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-p">{{
            onePacketItem.name
          }}</v-list-item-title>
        </v-list-item-content>
        <v-card-actions>
          <v-dialog v-model="onePacketItem.openDialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-2"
                text
                rounded
                v-bind="attrs"
                v-on="on"
                color="blue"
              >
                <span class="mdi mdi-text-box-edit"></span> Edit
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Edit Packet Item</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Change name"
                        v-model="onePacketItem.name"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="onePacketItem.openDialog = false"
                  >Close</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  text
                  @click="saveChanges(onePacketItem)"
                  >Save</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="onePacketItem.openDialogDelete" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" text rounded color="red">
                <span class="mdi mdi-trash-can"></span>
                <v-icon end icon="mdi-cancel"></v-icon> Delete
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Delete pacekt item</span>
              </v-card-title>
              <v-card-text class="text-left"
                >Are you sure you want to delete this packet item?</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="onePacketItem.openDialogDelete = false"
                  >No</v-btn
                >
                <v-btn
                  color="red darken-1"
                  text
                  @click="deleteUser(onePacketItem.id, onePacketItem)"
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
  name: "PacetItems",
  data: () => ({}),
  async mounted() {
    try {
      await this.fetchPacketItems();
      console.log(this.getPacketItems);
    } catch (error) {
      console.error('Greška pri dohvatanju "packet items":', error);
    }
  },
  computed: {
    ...mapGetters("packetItems", ["getPacketItems"]),
  },
  methods: {
    ...mapActions("packetItems", ["fetchPacketItems"]),
    async deleteUser(id, onePacketItem) {
      const index = this.getPacketItems.findIndex(
        (u) => u.id === onePacketItem.id
      );
      if (index !== -1) {
        this.getPacketItems.splice(index, 1);
      }
      console.log(id, "radiii");
      try {
        const response = await axios.post(
          "https://certoe.de:8080/api/frontend/deletePacketItems",
          {
            packetItemId: id,
            token: "test",
          }
        );
        console.log("Packet items uspešno obrisan:", response.data);
        onePacketItem.openDialogDelete = false;
      } catch (error) {
        console.error("Greška pri brisanju packet items:", error);
      }
    },
    async saveChanges(onePacketItem) {
      try {
        const data = {
          packetItemId: onePacketItem.id,
          name: onePacketItem.name,
          token: "test",
        };
        console.log(data);
        await axios.post(
          "https://certoe.de:8080/api/frontend/editPacketItem",
          data
        );
        onePacketItem.openDialog = false;
        console.log("Promene uspešno sačuvane");
      } catch (error) {
        console.error("Greška pri čuvanju promena:", error);
      }
    },
  },
};
</script>
    