import { initializeApp } from "firebase/app";
import * as firebase from "firebase/messaging";
import { runFbOrNot } from './firebaseToken';

const config = {
  apiKey: "AIzaSyC2-YScPwefjYPWp99UBkvzaB27weWKhCc",
  authDomain: "novatoons-6c6b7.firebaseapp.com",
  projectId: "novatoons-6c6b7",
  storageBucket: "novatoons-6c6b7.appspot.com",
  messagingSenderId: "917674942665",
  appId: "1:917674942665:web:2bcf9bbd2778ccee1cad18",
  measurementId: "G-QD9JRYHLC9"
};

// Initialize Firebase
let firebaseApp, messaging;
if (runFbOrNot) {
    firebaseApp = initializeApp(config)
    messaging = firebase.getMessaging(firebaseApp)
}

// Gets the token and sets it to a state variable
export const getMyToken = (setDevice_id) => {
  firebase
    .getToken(messaging)
    .then((token) => {
      setDevice_id(token);
    })
    .catch((err) => {
      // console.log(err);
    });
};



// Runs in foreground
export const onMessageListener = () => {
  if (runFbOrNot) {
    return new Promise((resolve) => {
        firebase.onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
}
}