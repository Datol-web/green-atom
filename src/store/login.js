import firebase from 'firebase/app'

export default {
  actions: { //авторизация
    async login({dispatch, commit}, {email, password}) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email,password);
        console.log(dispatch);
        console.log(commit);
      } catch(e) {
        console.log(e);
        throw e;
      }
    },
    async logout() {
      await firebase.auth().signOut();
    },
  }
}