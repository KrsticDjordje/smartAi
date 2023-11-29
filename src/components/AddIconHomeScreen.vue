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

    <!-- Poruka kada je aplikacija instalirana -->
    <div v-else>Installed</div>
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
    // Proverava da li je uređaj iOS
    isIOS() {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    },
    // Proverava da li je aplikacija već instalirana
    checkAppInstalled() {
      this.isAppInstalled = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
    },
    // Funkcija za dodavanje aplikacije na početni ekran na Androidu
    addToHomeScreen() {
      if (this.installPrompt) {
        this.installPrompt.prompt();
        this.installPrompt.userChoice.then((choiceResult) => {
          this.isAppInstalled = choiceResult.outcome === "accepted";
          this.installPrompt = null;
        });
      }
    },
    // Prikazuje instrukcije za iOS
    showIOSInstructions() {
      alert(
        "To add our app to your home screen: open Safari's sharing menu and select 'Add to Home Screen'."
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
