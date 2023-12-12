import axios from 'axios';

const state = {
    users: [],
}

const getters = {
    getUsers: (state) => state.users,
}

const mutations = {
    setUsers: (state, users) => {
        state.users = users;
    },
}

const actions = {
    async fetchUsers({ commit }) {
        try {
            const response = await axios.post(
                'https://verbumscript.app:8080/api/frontend/getUserOfCompany',
                {
                    "token": "test",
                    "companyId": 1,
                    "page": 0,
                    "limit": 50
                }
            );

            if (response.status === 200) {
                commit('setUsers', response.data.response.users);
                console.log(response.data.response.users)
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
