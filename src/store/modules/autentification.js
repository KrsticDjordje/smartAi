
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import groupsModule from './modules/groups';
import usersModule from './modules/users';
import autentificationModule from './modules/autentification';

export default new Vuex.Store({
    modules: {
        groups: groupsModule,
        users: usersModule,
        autentification: autentificationModule,
    },
});
