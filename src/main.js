import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Pusher from 'pusher-js';


// Inicijalizacija Pusher-a
Pusher.logToConsole = true; // Ovo omogućava logovanje za Pusher, koristiti samo u razvoju

const pusher = new Pusher('527e5f64e5fd092e6b5e', {
  cluster: 'eu',
  encrypted: true
});

const channel = pusher.subscribe('my-channel');

// Povezivanje na događaj koji prima transkripcije
channel.bind('transcription-event', function (transcriptions) {
  // Kada se primi podatak preko Pusher-a, ažurira se Vuex stanje sa filtriranim transkripcijama
  store.dispatch('pusherData/updateDataFromPusher', transcriptions);
});
Vue.config.productionTip = false
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
