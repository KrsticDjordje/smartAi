<template>
  <div>
    <!-- Dugme za Android -->
    <button v-if="!isAppInstalled && !isIOS()" @click="addToHomeScreen">
      Install on your phone
    </button>

    <!-- Dugme za iOS -->
    <button v-if="!isAppInstalled && isIOS()" @click="showIOSInstructions">
      How to install on your phone
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
      hasSeenInstallPopup: false, // Dodato da prati da li je korisnik već video iOS poruku
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
      if (window.matchMedia("(display-mode: standalone)").matches) {
        this.isAppInstalled = true;
      }
    },
    // Funkcija za dodavanje aplikacije na početni ekran na Androidu
    addToHomeScreen() {
      if (this.installPrompt) {
        this.installPrompt.prompt();
        this.installPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("Korisnik je prihvatio dodavanje na početni ekran");
            this.isAppInstalled = true;
          } else {
            console.log("Korisnik je odbio dodavanje na početni ekran");
          }
          this.installPrompt = null;
        });
      }
    },
    // Prikazuje instrukcije za iOS
    showIOSInstructions() {
      if (
        !this.hasSeenInstallPopup &&
        this.isIOS() &&
        !this.isInStandaloneMode()
      ) {
        alert(
          "To add our app to your home screen: open Safari's sharing menu and select 'Add to Home Screen'."
        );
        this.hasSeenInstallPopup = true;
        localStorage.setItem("hasSeenInstallPopup", "true");
      }
    },
    // Proverava da li je uređaj u "standalone" modu
    isInStandaloneMode() {
      return "standalone" in window.navigator && window.navigator.standalone;
    },
  },
  mounted() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.installPrompt = e;
    });

    this.hasSeenInstallPopup =
      localStorage.getItem("hasSeenInstallPopup") === "true";

    if (this.isIOS() && !this.hasSeenInstallPopup) {
      this.showIOSInstructions();
    }

    this.checkAppInstalled();
  },
};
</script>
