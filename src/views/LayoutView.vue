<template>
  <div id="app">
    <!-- App.vue -->

    <v-app>
      <v-navigation-drawer
        app
        v-model="drawer"
        :clipped="$vuetify.breakpoint.lgAndUp"
        disable-resize-watcher
      >
        <v-list-item-group>
          <!-- Logo -->
          <v-list-item>
            <v-img
              :src="require('@/assets/AILogo.png')"
              max-height="150"
              class="my-8"
              contain
            ></v-img>
          </v-list-item>
        </v-list-item-group>

        <v-list>
          <v-list-item-group>
            <!-- Navigacija -->
            <v-list-item class="link" router :to="{ name: 'home' }">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Dashnoard</v-list-item-title>
            </v-list-item>
            <v-card-subtitle class="text-left"> Transcriptions</v-card-subtitle>
            <v-list-item class="link" router :to="{ name: 'about' }">
              <v-list-item-icon>
                <v-icon>mdi-message-video</v-icon>
              </v-list-item-icon>
              <v-list-item-title>My Recordings</v-list-item-title>
            </v-list-item>
            <v-list-item class="link">
              <v-list-item-icon>
                <v-icon>mdi-folder-upload</v-icon>
              </v-list-item-icon>
              <v-list-item-title>My Uploads</v-list-item-title>
            </v-list-item>
            <v-list-item class="link">
              <v-list-item-icon>
                <v-icon>mdi-translate-variant</v-icon>
              </v-list-item-icon>
              <v-list-item-title>My Translations</v-list-item-title>
            </v-list-item>
            <v-list-item class="link">
              <v-list-item-icon>
                <v-icon>mdi-script-text</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Group Transcriptions</v-list-item-title>
            </v-list-item>
            <v-list-item class="link">
              <v-list-item-icon>
                <v-icon>mdi-subtitles-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Subtitles</v-list-item-title>
            </v-list-item>
            <v-card-subtitle class="text-left"> Content</v-card-subtitle>
            <v-list-item class="link">
              <v-list-item-icon>
                <v-icon>mdi-text-box-edit</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Create Content</v-list-item-title>
            </v-list-item>
            <v-list-item class="link">
              <v-list-item-icon>
                <v-icon>mdi-text-box-multiple</v-icon>
              </v-list-item-icon>
              <v-list-item-title>My Contents</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="app-bar-title hello">
          <v-icon>mdi-hand-clap</v-icon> Hello, Stranger!</v-toolbar-title
        >

        <v-spacer></v-spacer>
        <Search />
        <v-spacer></v-spacer>
        <v-btn class="notification mx-2" outlined fab dark small color="orange">
          <v-icon dark> mdi-bell-ring </v-icon>
        </v-btn>

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
                <h3>{{ user.fullName }}</h3>
                <p class="text-caption mt-1">
                  {{ user.email }}
                </p>
                <v-divider class="my-3"></v-divider>
                <v-btn rounded text>
                  <v-icon class="mx-2" dark> mdi-pencil</v-icon> Edit Account
                </v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn rounded text>
                  <v-icon class="mx-2" dark> mdi-logout</v-icon> LogOut
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
      </v-app-bar>

      <!-- Sizes your content based upon application components -->
      <v-main>
        <!-- Provides the application the proper gutter -->
        <v-container fluid>
          <!-- If using vue-router -->
          <router-view></router-view>
        </v-container>
      </v-main>

      <v-footer app>
        <!-- -->
      </v-footer>
    </v-app>
  </div>
</template>
  <script>
export default {
  components: {},
  data() {
    return {
      drawer: true,
      user: {
        initials: "JD",
        fullName: "John Doe",
        email: "john.doe@doe.com",
      },
    };
  },
};
</script>
  
  <style>
@import "@/assets/css/style.css";
#app {
  font-family: "Poppins", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
  