import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCzZuu3fAeh6x6F24Kd4Dd33Qzt44MoQm4",
    authDomain: "ad-samba.firebaseapp.com",
    databaseURL: "https://ad-samba-default-rtdb.firebaseio.com",
    projectId: "ad-samba",
    storageBucket: "ad-samba.appspot.com",
    messagingSenderId: "274870327628",
    appId: "1:274870327628:web:b288eec13b8067478157e9",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.database().ref();
