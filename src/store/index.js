import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var store = new Vuex.Store({
  state: {//放数据的
    controlData: {//game Control需要的数据
      isStart: false,
      bombCount: 0,
    },
  },
  getters: {//在组建中得到state
    isStart: state => state.controlData.isStart,
    bombCount: state => state.controlData.bombCount,
  },
  mutations: {//同步处理state
    updateIsStart(state, payload) {
      state.controlData.isStart = payload.isStart;
    },
    updateBombCount(state, payload) {
      state.controlData.bombCount = payload.bombCount;
    },
  },
  actions: {//异步处理
    
  }
})

export default store;