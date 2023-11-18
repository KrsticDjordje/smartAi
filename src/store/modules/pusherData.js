const state = {
    userTranscription: [], // Ovde će se čuvati filtrirane transakcije
};

const mutations = {
    SET_USER_TRANSCRIPTION(state, transcriptions) {
        console.log('Updating user transcriptions:', transcriptions);
        state.userTranscription = transcriptions;
    },
};

const actions = {
    updateDataFromPusher({ commit }, transcriptions) {
        // Preuzimanje user_id iz localStorage-a
        const userId = localStorage.getItem('user').id;

        // Filtriranje transakcija
        const filteredTranscriptions = transcriptions.filter(t => t.user_id === userId);

        // Ažuriranje stanja sa filtriranim transakcijama
        commit('SET_USER_TRANSCRIPTION', filteredTranscriptions);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
