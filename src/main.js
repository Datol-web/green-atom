import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import Vuelidate from 'vuelidate'
import  'materialize-css/dist/js/materialize.min'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'

import moment from 'moment'

Vue.prototype.moment = moment

Vue.config.productionTip = false

Vue.use(Vuelidate);
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyD7qzmSUUMSoK89f9GfEbK1Ura2BP2teSU",
    authDomain: "green-atom-c1000.firebaseapp.com",
    databaseURL: "https://green-atom-c1000.firebaseio.com",
    projectId: "green-atom-c1000",
    storageBucket: "green-atom-c1000.appspot.com",
    messagingSenderId: "1015710903916",
    appId: "1:1015710903916:web:d167ca0b9801858dd97249"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
let app


//защита роутов, до авторизации другие роуты не доступны
firebase.auth().onAuthStateChanged(()=> {
  if(!app) {
    app = new Vue({
      render: h => h(App),
      router,
      store
    }).$mount('#app')
  }
});