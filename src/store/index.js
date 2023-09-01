import Vue from 'vue'
import Vuex from 'vuex'


import groupsModule from './modules/groups';
import usersModule from './modules/users';
import autentificationModule from './modules/autentification';
import packetItemsModule from './modules/packetItems';
import packetsModule from './modules/packets';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    groups: groupsModule,
    users: usersModule,
    autentification: autentificationModule,
    packetItems: packetItemsModule,
    packets: packetsModule,
  },
});