import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Pusher from 'pusher-js';

Vue.prototype.$bus = new Vue();

Vue.prototype.$globalStore = {
  pusherData: null
};

// Inicijalizacija Pusher-a i povezivanje na kanal
Pusher.logToConsole = true;
const pusher = new Pusher('527e5f64e5fd092e6b5e', {
  cluster: 'eu',
  encrypted: true
});
const channel = pusher.subscribe('my-channel');

// Povezivanje na događaj koji prima podatke
channel.bind('my-event', function (newTranscription) {
  console.log('Podaci primljeni sa Pusher-a:', newTranscription);
  Vue.prototype.$bus.$emit('pusher-data-received', newTranscription);
});


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
