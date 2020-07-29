import Vue from 'vue'
import Vuex from 'vuex'
import VueNativeSock from 'vue-native-websocket'
// import example from './module-example'

Vue.use(Vuex)
Vue.use(VueNativeSock, 'ws://localhost:3000', {
  reconnection: true
})

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const settings = {
  namespaced: true,
  state: () => ({
    debug: false
  }),
  mutations: {
    debug (state, value) {
      state.debug = value
    }
  },
  getters: {
    debug (state) {
      return state.debug
    }
  }
}

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
      settings
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
