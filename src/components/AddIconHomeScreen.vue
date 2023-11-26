<!-- U vašoj Vue komponenti -->
<template>
  <div>
    <!-- Vaša Vue komponenta i sadržaj -->
    <button @click="addToHomeScreen">Add on home screen</button>
  </div>
</template>
  
  <script>
export default {
  methods: {
    addToHomeScreen() {
      if ("installPrompt" in window) {
        // Ako je prompt dostupan, pozovite ga
        window.installPrompt.prompt();

        // Sačekajte da se korisnik odluči pre nego što se sakrije prompt
        window.installPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("Korisnik je prihvatio dodavanje na početni ekran");
          } else {
            console.log("Korisnik je odbio dodavanje na početni ekran");
          }

          // Postavite instalacijski prompt na null da biste mogli ponovo zatražiti instalaciju
          window.installPrompt = null;
        });
      }
    },
  },
  mounted() {
    // Pratite install prompt događaj
    window.addEventListener("beforeinstallprompt", (event) => {
      // Spremite prompt da biste ga kasnije pozvali
      window.installPrompt = event;
    });
  },
};
</script>
  