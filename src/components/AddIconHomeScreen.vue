<template>
  <div>
    <!-- Vaša Vue komponenta i sadržaj -->
    <button v-if="!isAppInstalled" @click="addToHomeScreen">
      Add on home screen
    </button>
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
    isIOS() {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    },
    checkAppInstalled() {
      // Provera da li je aplikacija već instalirana
      if (window.matchMedia("(display-mode: standalone)").matches) {
        this.isAppInstalled = true;
      }
    },
    addToHomeScreen() {
      if (this.installPrompt) {
        // Ako je prompt dostupan, pozovite ga
        this.installPrompt.prompt();

        // Sačekajte da se korisnik odluči
        this.installPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("Korisnik je prihvatio dodavanje na početni ekran");
            this.isAppInstalled = true; // Postavite da je aplikacija instalirana
          } else {
            console.log("Korisnik je odbio dodavanje na početni ekran");
          }

          // Resetujte instalacijski prompt
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
      e.preventDefault(); // Sprečite odmah prikazivanje prompta
      this.installPrompt = e; // Sačuvajte event za kasnije
    });

    if (this.isIOS()) {
      this.showIOSInstructions(); // Prikazuje obaveštenje za iOS korisnike
    }

    this.checkAppInstalled(); // Proverava da li je aplikacija već instalirana
  },
};
</script>
  