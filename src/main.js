import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Pusher from 'pusher-js';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import notificationMixin from './mixin/notificationMixin';

const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
};

Vue.mixin(notificationMixin);

Vue.use(Toast, toastOptions);

Vue.prototype.$bus = new Vue();

Vue.prototype.$globalStore = {
  pusherData: null
};

// Inicijalizacija Pusher-a i povezivanje na kanal
Pusher.logToConsole = true;
const pusher = new Pusher('2fa2f431d046daeee56d', {
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
