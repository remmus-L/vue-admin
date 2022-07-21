import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {}
    // activePath: {}
  },
  getters: {
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    }
    // activePath (state, payload) {
    //   state.activePath = payload
    // }
  },
  actions: {
  },
  modules: {
  },
  plugins: [vuexLocal.plugin]
})
