import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import axios from 'axios';

export default new Vuex.Store({
  state: {
    groups: [],
  },
  getters: {
    getGroups: (state) => state.groups,
  },
  mutations: {
    setGroups: (state, groups) => {
      state.groups = groups;
    },
  },
  actions: {
    async fetchGroups({ commit }) {
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
          commit('setGroups', response.data);
        } else {
          console.error('Error fetching groups:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    },
  },
});

