import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import axios from 'axios';

export default new Vuex.Store({
    state: {
        users: [],
    },
    getters: {
        getUsers: (state) => state.users,
    },
    mutations: {
        setUsers: (state, users) => {
            state.users = users.result.users;
        },
    },
    actions: {
        async fetchUsers({ commit }) {
            try {
                const response = await axios.post(
                    'http://49.12.0.17:8000/api/frontend/getPacketItems',
                    {
                        "token": "test",
                        "limit": 10,
                        "page": 0
                    }
                );

                if (response.status === 200) {
                    commit('setUsers', response.data);
                } else {
                    console.error('Error fetching users:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
    },
});

