const module = {
  state: {
    name: '小白',
    age: '-',
    gender: '男'
  },
  actions: {
    // 提交个人信息mutations
    async edit_personal_info({
      commit,
      context
    }) {
      await console.log('actions', context)
      commit('infos.PERSONAL_INFO', context)
    }
  },
  mutations: {
    [infos.PERSONAL_INFO](state, editState) {
      console.log('mutations', stats)
      // 修改个人信息
      state = {
        ...state,
        ...editState
      }
    }
  },
  modules: {}
}
export default module