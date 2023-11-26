<template>
  <div>
    <!-- Vaša Vue komponenta i sadržaj -->
    <button @click="addToHomeScreen">Add on home screen</button>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      installPrompt: null,
    };
  },
  methods: {
    addToHomeScreen() {
      if (this.installPrompt) {
        // Ako je prompt dostupan, pozovite ga
        this.installPrompt.prompt();

        // Sačekajte da se korisnik odluči
        this.installPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("Korisnik je prihvatio dodavanje na početni ekran");
          } else {
            console.log("Korisnik je odbio dodavanje na početni ekran");
          }

          // Resetujte instalacijski prompt
          this.installPrompt = null;
        });
      }
    },
  },
  mounted() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault(); // Sprečite odmah prikazivanje prompta
      this.installPrompt = e; // Sačuvajte event za kasnije
    });
  },
};
</script>
  