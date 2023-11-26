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
  