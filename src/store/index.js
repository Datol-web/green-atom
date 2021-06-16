import Vue from 'vue'
import Vuex from 'vuex'
import login from './login'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/auth'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: [] //стейт всех опросов
  },
  mutations:{//изменение состояния хранилища
    setLoadTask(state, value) {
      state.tasks = value;
    },
    createTask(state, {task, otherinfo}) { //логика создания опроса и запись в базу
      state.tasks.push(task,otherinfo)
      const db = firebase.firestore();

      db.collection('surveys').add({ //добавление в базу
        data: task,
        otherinfo: otherinfo
      });
    },
  },
  actions:{
    createTask({commit}, task) { //экшн создания
      commit('createTask', task)
    },
  },
  getters: { //получение id опроса через геттеры
    tasks: s => s.tasks,
    taskById: s => id => s.tasks.find(t => t.id === id),
    allTasks(state) {
      return state.tasks
    }
  },
  modules: {
    login
  }
})