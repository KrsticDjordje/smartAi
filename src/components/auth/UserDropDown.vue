<template>
  <v-menu bottom min-width="200px" rounded offset-y>
    <template v-slot:activator="{ on }">
      <v-btn class="mx-2 accountIcon" fab dark small color="" v-on="on">
        <v-icon dark> mdi-account-circle </v-icon>
      </v-btn>
    </template>
    <v-card class="userMenu">
      <v-list-item-content class="justify-center">
        <div class="mx-auto text-center">
          <v-avatar color="purple" class="my-2">
            <span class="white--text text-h5">{{ user.initials }}</span>
          </v-avatar>
          <h5>{{ user.fullName }}</h5>
          <p class="text-caption mt-1">
            {{ user.email }}
          </p>
          <v-divider class="my-3"></v-divider>
          <!-- <v-btn rounded text>
            <v-icon class="mx-2" dark> mdi-pencil</v-icon> Edit Account
          </v-btn> -->
          <v-divider class="my-3"></v-divider>
          <v-btn rounded text @click="logout">
            <v-icon class="mx-2" dark> mdi-logout</v-icon> LogOut
          </v-btn>
        </div>
      </v-list-item-content>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      user: {
        initials: "NR",
        fullName: name,
        email: "john.doe@doe.com",
      },
    };
  },
  created() {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData) {
      this.user.fullName = userData.surname || this.user.fullName;
      this.user.email = userData.email || this.user.email;
      this.user.fullName = `${userData.name} ${userData.surname}`;
    }
  },
  methods: {
    logout() {
      this.$store.commit("autentification/logout"); // Poziv mutacije za odjavu
      window.location.reload();
    },
  },
};
</script>

<style>
</style>