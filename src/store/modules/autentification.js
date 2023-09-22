
import axios from 'axios';

const state = {
    isLoggedIn: false,
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
};

const mutations = {
    login(state, { token, user }) {
        state.isLoggedIn = true;
        state.token = token;
        state.user = user;

        localStorage.setItem('user', JSON.stringify(user));
    },
    logout(state) {
        state.isLoggedIn = false;
        state.token = null;
        state.user = null;

        localStorage.removeItem('user');
    },
};

const actions = {
    async login({ commit }, { email, password }) {
        try {
            const response = await axios.post(
                "https://certoe.de:8080/api/frontend/login",
                {
                    email,
                    password,
                    token: "test",
                }
            );

            commit("login", { token: response.data.token, user: response.data.response.user });
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    },
    logout({ commit }) {
        commit("logout");
    },
};

const getters = {
    isLoggedIn: (state) => state.isLoggedIn,
    getToken: (state) => state.token,
    getUser: (state) => state.user,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
