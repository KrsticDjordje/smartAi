import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  },
  mutations: {
    login(state, { token, user }) {
      state.isLoggedIn = true;
      state.token = token;
      state.user = user;

      // Sačuvaj podatke u Local Storage
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;

      // Ukloni podatke iz Local Storage-a
      localStorage.removeItem('user');
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const response = await axios.post(
          "http://49.12.0.17:8000/api/frontend/login",
          {
            email,
            password,
            token: "test",
          }
        );

        console.log("Login API", response.data);
        commit("login", { token: response.data.token, user: response.data.response.user });
        window.location.reload();

      } catch (error) {
        console.log(error);
      }
    },
    logout({ commit }) {
      commit("logout");
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    getToken: (state) => state.token,
    getUser: (state) => state.user,
  },
});
