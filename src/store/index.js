import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 列表清单
    list: [],
    // 文本框输入内容
    inputValue: '',
    // 下一个Id
    nextId: 6,
    viewKey: '全部'
  },
  mutations: {
    initList (state, list) {
      state.list = list
    },
    // 为inputValue赋值到state中
    setInputValue (state, val) {
      state.inputValue = val
    },
    addItem (state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        // 未完成状态默认是false
        done: false
      }
      // 将对象追加到list中
      state.list.push(obj)
      // id自动递增，保证不重复
      state.nextId++
      // 清空文本框
      state.inputValue = ''
    },
    // 根据Id删除对应的任务事项
    removeItem (state, id) {
      // 根据Id查找对应项的索引
      const i = state.list.findIndex(x => x.id === id)
      // 根据索引，删除对应的元素
      if (i !== -1) {
        state.list.splice(i, 1)
      }
    },
    // 修改列表项的选中状态
    changeStatus (state, param) {
      const i = state.list.findIndex(x => x.id === param.id)
      if (i !== -1) {
        state.list[i].done = param.status
      }
    },
    // 修改全选后的状态
    changeStatusAll (state) {
      // console.log(params)
      state.list.forEach(row => {
        row.done = true
      })
    },
    // 取消全选后的状态
    cleanStatusAll (state) {
      state.list.forEach(row => {
        row.done = false
      })
    },
    cleanDone (state) {
      state.list = state.list.filter(x => x.done === false)
    },
    // 修改视图的关键字
    changeViewKey (state, key) {
      state.viewKey = key
    }
  },
  actions: {
    getList (context) {
      axios.get('/list.json').then(({ data }) => {
        context.commit('initList', data)
      })
    }
  },
  getters: {
    // 统计未完成的任务数量
    unDoneLength (state) {
      return state.list.filter(x => x.done === false).length
    },
    infolist (state) {
      if (state.viewKey === '全部') {
        return state.list
      }
      if (state.viewKey === '未完成') {
        return state.list.filter(x => !x.done)
      }
      if (state.viewKey === '已完成') {
        return state.list.filter(x => x.done)
      }
      return state.list
    }
  },
  modules: {
  }
})
