import axios from 'axios';

const state = {
    companies: [],
};

const getters = {
    getCompanies: (state) => state.companies,
};

const mutations = {
    setCompanies: (state, companies) => {
        state.companies = companies;
    },
};

const actions = {
    async fetchCompanies({ commit }) {
        try {
            const response = await axios.post(
                'http://49.12.0.17:8000/api/frontend/getCompanies',
                {
                    "token": "test",
                    "limit": 1,
                    "page": 1
                }
            );

            if (response.data.status) {
                commit('setCompanies', response.data.response.companies);
            } else {
                console.error('Error fetching companies:', response.data);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
