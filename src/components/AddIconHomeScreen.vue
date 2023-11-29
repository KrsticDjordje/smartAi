<template>
  <div>
    <!-- Dugme za Android -->
    <button v-if="!isAppInstalled && !isIOS()" @click="addToHomeScreen">
      Install on your phone (Android)
    </button>

    <!-- Dugme za iOS -->
    <button v-if="!isAppInstalled && isIOS()" @click="showIOSInstructions">
      Install on your phone (iOS)
    </button>

    <!-- Poruka kada je aplikacija instalirana (samo za Android) -->
    <div v-if="isAppInstalled && !isIOS()">Installed</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      installPrompt: null,
      isAppInstalled: false,
    };
  },
  methods: {
    isIOS() {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    },
    checkAppInstalled() {
      // Posebna logika za Android i iOS
      if (this.isIOS()) {
        // iOS ne podržava beforeinstallprompt, pa se oslanjamo na standalone mod
        this.isAppInstalled = window.matchMedia(
          "(display-mode: standalone)"
        ).matches;
      } else {
        // Za Android, proveravamo installPrompt
        this.isAppInstalled = !!this.installPrompt;
      }
    },
    addToHomeScreen() {
      if (this.installPrompt) {
        this.installPrompt.prompt();
        this.installPrompt.userChoice.then((choiceResult) => {
          this.isAppInstalled = choiceResult.outcome === "accepted";
          this.installPrompt = null;
        });
      }
    },
    showIOSInstructions() {
      alert(
        "Da dodate našu aplikaciju na početni ekran: otvorite Safari meni za deljenje i izaberite 'Add to Home Screen'."
      );
    },
  },
  mounted() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.installPrompt = e;
    });

    this.checkAppInstalled();
  },
};
</script>
