import "./App.css";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Button from "./components/Button";
import Channel from "./components/Channel";
import SignIn from "./components/SignIn";

const firebaseConfig = {
    apiKey: "AIzaSyCUeYSHKVdAKJLT1ArgWMC2x_48gWZPPNg",
    authDomain: "chat-app-d7a44.firebaseapp.com",
    projectId: "chat-app-d7a44",
    storageBucket: "chat-app-d7a44.appspot.com",
    messagingSenderId: "22109340941",
    appId: "1:22109340941:web:76ecf1e4d17ec19d7a9c44",
    measurementId: "G-277WRTCYQQ",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// db.collection("messages")
//     .get()
//     .then((querySnapshot) => {
//         querySnapshot.docs.forEach((snapshot) => {
//             snapshot.ref.delete();
//         });
//     });

function App() {
    const [user, setUser] = useState(auth.currentUser);
    const [initializing, setInitializing] = useState(true);

    useEffect(
        function () {
            const unsubscribe = auth.onAuthStateChanged(function (user) {
                if (user) {
                    setUser(user);
                } else {
                    setUser(null);
                }
            });

            if (initializing) setInitializing(false);

            return unsubscribe;
        },
        [initializing]
    );

    const signOut = async function () {
        try {
            await auth.signOut();
        } catch (err) {
            console.error(err);
        }
    };

    if (initializing) return <h1>Loading</h1>;

    return (
        <div className="app">
            <Button onClick={signOut} className="button button--sign-out">
                Sign Out
            </Button>
            <div className="page-title-container">
                <h1 className="page-title">Chat App</h1>
            </div>

            {!user && <SignIn></SignIn>}

            {user && <Channel user={user} />}
        </div>
    );
}

export { auth, db };
export default App;
