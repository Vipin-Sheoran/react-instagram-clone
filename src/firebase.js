import firebase from 'firebase'

const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyDdmik3sfO7uKHgkMMQ1mWldujqde4JvPI",
    authDomain: "instagram-clone-4d598.firebaseapp.com",
    databaseURL: "https://instagram-clone-4d598.firebaseio.com",
    projectId: "instagram-clone-4d598",
    storageBucket: "instagram-clone-4d598.appspot.com",
    messagingSenderId: "478276430145",
    appId: "1:478276430145:web:42389e187f2bfba85219c0",
    measurementId: "G-6QSNM5R3DN"
  })

  const db=firebaseApp.firestore()
  const auth=firebase.auth()
  const storage=firebase.storage()

  export {db,auth,storage}