import axios from 'axios';

const state = {
    packets: [],
};

const getters = {
    getPackets: (state) => state.packets,
};

const mutations = {
    setPackets: (state, packets) => {
        state.packets = packets;
    },
};

const actions = {
    async fetchPackets({ commit }) {
        try {
            const response = await axios.post(
                'http://49.12.0.17:8080/api/frontend/getPackets',
                {
                    "token": "test",
                    "limit": 10,
                    "page": 0
                }
            );

            if (response.data.status) {
                commit('setPackets', response.data.response.packet);
            } else {
                console.error('Error fetching packet items:', response.data);
            }
        } catch (error) {
            console.error('Error fetching packet items:', error);
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
