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
        'https://certoe.de:8080/api/frontend/getGroups',
        {
          "token": "test",
          "limit": 10,
          "page": 0
        }
      );

      if (response.status === 200) {
        commit('setGroups', response.data.response.groups);
        console.log(response.data.response.groups)
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
