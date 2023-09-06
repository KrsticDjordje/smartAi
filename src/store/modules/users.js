import axios from 'axios';

const state = {
    users: [],
}

const getters = {
    getUsers: (state) => state.users,
}

const mutations = {
    setUsers: (state, users) => {
        state.users = users.result;
    },
}

const actions = {
    async fetchUsers({ commit }) {
        try {
            const response = await axios.post(
                'http://49.12.0.17:8080/api/frontend/getPacketItems',
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
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
