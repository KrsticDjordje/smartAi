import axios from 'axios';

const state = {
  groups: [],
}

const getters = {
  getGroups: (state) => state.groups,
}

const mutations = {
  setGroups: (state, groups) => {
    state.groups = groups;
  },
}

const actions = {
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
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
