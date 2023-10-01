<template>
  <div id="app">
    <!-- App.vue -->

    <v-app v-if="userStatus === 1">
      <v-navigation-drawer
        app
        v-model="drawer"
        :clipped="$vuetify.breakpoint.lgAndUp"
        disable-resize-watcher
      >
        <v-list-item-group>
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
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
            <v-card-subtitle class="text-left"> Transcriptions</v-card-subtitle>

            <v-list-item class="link" @click="toggleRecording">
              <v-list-item-icon>
                <v-icon style="color: red !important">mdi-microphone</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Audio Recorder</v-list-item-title>
              <!-- Dodajte v-icon za strelicu unutar "Recording Now" reda -->
              <v-icon @click.stop="showSubmenu = !showSubmenu"
                >mdi-chevron-down</v-icon
              >
            </v-list-item>
            <v-expand-transition>
              <v-list v-if="showSubmenu">
                <v-list-item
                  class="link"
                  router
                  :to="{ name: 'audioRecording' }"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-microphone</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Audio Recorder</v-list-item-title>
                </v-list-item>
                <v-list-item
                  class="link"
                  router
                  :to="{ name: 'audioRecordings' }"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-file-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Recordings</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expand-transition>

            <v-list-item class="link" @click="toggleRecording2">
              <v-list-item-icon>
                <v-icon style="color: red !important">mdi-record-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Screen Recorder</v-list-item-title>
              <!-- Dodajte v-icon za strelicu unutar "Recording Now" reda -->
              <v-icon @click.stop="showSubmenu2 = !showSubmenu2"
                >mdi-chevron-down</v-icon
              >
            </v-list-item>
            <v-expand-transition>
              <v-list v-if="showSubmenu2">
                <v-list-item
                  class="link"
                  router
                  :to="{ name: 'screenRecording' }"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-record-circle</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Screen Recorder</v-list-item-title>
                </v-list-item>
                <v-list-item class="link" router :to="{ name: 'myRecordings' }">
                  <v-list-item-icon>
                    <v-icon>mdi-message-video</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Recordings</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expand-transition>

            <v-list-item class="link" router :to="{ name: 'myUploads' }">
              <v-list-item-icon>
                <v-icon>mdi-folder-upload</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Uploads</v-list-item-title>
            </v-list-item>
            <v-list-item class="link" router :to="{ name: 'myTranslations' }">
              <v-list-item-icon>
                <v-icon>mdi-translate-variant</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Translations</v-list-item-title>
            </v-list-item>
            <v-list-item
              class="link"
              router
              :to="{ name: 'groupTranscriptions' }"
            >
              <v-list-item-icon>
                <v-icon>mdi-script-text</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Group Transcriptions</v-list-item-title>
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
          <v-icon>mdi-hand-clap</v-icon> Hello,
          {{ user.name }}!</v-toolbar-title
        >

        <v-spacer></v-spacer>
        <Search />
        <v-spacer></v-spacer>
        <router-link
          v-if="getUserRoleId() === 3"
          router
          :to="{ name: 'adminPanel' }"
        >
          <v-btn
            class="notification mx-2"
            outlined
            fab
            dark
            small
            color="purple"
          >
            <v-icon dark> mdi-file-edit </v-icon>
          </v-btn>
        </router-link>
        <v-btn class="notification mx-2" outlined fab dark small color="orange">
          <v-icon dark> mdi-bell-ring </v-icon>
        </v-btn>

        <UserDropDown />
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
    <Login v-else />
  </div>
</template>
<script>
import Search from "./components/layout/Search.vue";
import Login from "./components/auth/Login.vue";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import UserDropDown from "./components/auth/UserDropDown.vue";

export default {
  components: {
    Search,
    Login,
    UserDropDown,
  },
  data() {
    return {
      drawer: true,
      user: null,
      showSubmenu: false,
      showSubmenu2: false,
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    this.user = user;
  },
  methods: {
    toggleRecording() {
      this.showSubmenu = !this.showSubmenu;
    },
    toggleRecording2() {
      this.showSubmenu2 = !this.showSubmenu2;
    },
    getUserRoleId() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role_id) {
        return user.role_id;
      }
      return null;
    },
    logout() {
      this.$store.commit("autentification/logout"); // Poziv mutacije za odjavu
      window.location.reload();
    },
  },
  computed: {
    ...mapGetters("autentification", ["isLoggedIn", "getUser"]),
    userStatus() {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      return storedUser ? storedUser.status : null;
    },
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
  