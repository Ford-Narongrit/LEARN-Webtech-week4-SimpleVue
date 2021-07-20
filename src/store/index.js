import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";

let api_path = "/mock/paymentData.json";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: [],
  },
  getters: {
    paymentData: (state) => state.data,
  },
  mutations: {
    fetch(state, { res }) {
      state.data = res.data.data;
    },
    post(state, { payload }) {
      state.data.push(payload);
    },
  },
  actions: {
    async fetchData({ commit }) {
      let res = await Axios.get(api_path);
      commit("fetch", { res });
    },
    postData({ commit }, payload) {
      commit("post", { payload });
    },
  },
  modules: {},
});
