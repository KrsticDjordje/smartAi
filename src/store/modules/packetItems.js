import axios from 'axios';

const state = {
    packetItems: [],
};

const getters = {
    getPacketItems: (state) => state.packetItems,
};

const mutations = {
    setPacketItems: (state, packetItems) => {
        state.packetItems = packetItems;
    },
};

const actions = {
    async fetchPacketItems({ commit }) {
        try {
            const response = await axios.post(
                'https://certoe.de:8080/api/frontend/getPacketItems',
                {
                    "token": "test",
                    "limit": 50,
                    "page": 0
                }
            );

            if (response.data.status) {
                commit('setPacketItems', response.data.response.packetItems);
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
