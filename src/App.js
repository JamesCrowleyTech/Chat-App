import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Button from "./components/Button";
import Channel from "./components/Channel";
import iconGoogle from "./img/icon-google.png";

const firebaseConfig = {
    apiKey: "AIzaSyCUeYSHKVdAKJLT1ArgWMC2x_48gWZPPNg",
    authDomain: "chat-app-d7a44.firebaseapp.com",
    projectId: "chat-app-d7a44",
    storageBucket: "chat-app-d7a44.appspot.com",
    messagingSenderId: "22109340941",
    appId: "1:22109340941:web:76ecf1e4d17ec19d7a9c44",
    measurementId: "G-277WRTCYQQ",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

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
    const [userHasAccount, setUserHasAccount] = useState(true);
    const emailRef = useRef("");
    const passwordRef = useRef("");

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

    const createUserWithEmailPassword = async function () {
        try {
            await auth.createUserWithEmailAndPassword(emailRef.current.value);
        } catch (err) {
            console.error(err);
        }
    };

    const signInWithEmailPassword = async function () {
        try {
            await auth.signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value);
        } catch (err) {
            console.error(err);
        }
    };

    const signInWithGoogle = async function () {
        const provider = new firebase.auth.GoogleAuthProvider();

        auth.useDeviceLanguage();

        try {
            await auth.signInWithPopup(provider);
        } catch (err) {
            console.error(err);
        }
    };

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

            {!user &&
                (userHasAccount ? (
                    <div className="sign-in">
                        <h2 className="sign-in__title">Sign in to chat!</h2>
                        <Button onClick={signInWithGoogle} img={iconGoogle} className="button button--sign-in-google">
                            Sign In With Google
                        </Button>
                        <p className="sign-in-with-email-text">Or Sign In With Email</p>
                        <form
                            className="sign-in__form"
                            onSubmit={function (e) {
                                e.preventDefault();
                                signInWithEmailPassword(emailRef, passwordRef);
                            }}
                        >
                            <input
                                type="email"
                                className="sign-in__form-input"
                                ref={emailRef}
                                onChange={() => console.log(emailRef.current.value)}
                                placeholder="Email Address"
                            ></input>
                            <input
                                className="sign-in__form-input"
                                ref={passwordRef}
                                onChange={() => console.log(passwordRef.current.value)}
                                placeholder="Password"
                            ></input>
                            <button type="submit" className="sign-in__form-button">
                                Submit!
                            </button>
                        </form>
                        <p className="sign-up-link">
                            Don't have an account?&nbsp;
                            <span>
                                <button
                                    type="button"
                                    className="sign-up-link__btn"
                                    onClick={function () {
                                        setUserHasAccount(false);
                                    }}
                                >
                                    Create One!
                                </button>
                            </span>
                        </p>
                    </div>
                ) : (
                    <div className="sign-up">
                        <h2 className="sign-up__title">Create An Account!</h2>
                        <form className="sign-up__form">
                            <input className="sign-up__form-input" placeholder="Email Address"></input>
                            <input className="sign-up__form-input" placeholder="Password"></input>
                            <button type="submit" className="sign-up__form-button">
                                Submit!
                            </button>
                        </form>
                        <p className="sign-up-link">
                            Already have an account? &nbsp;
                            <span>
                                <button
                                    type="button"
                                    className="sign-up-link__btn"
                                    onClick={function () {
                                        setUserHasAccount(true);
                                    }}
                                >
                                    Sign In!
                                </button>
                            </span>
                        </p>
                    </div>
                ))}

            {user && <Channel user={user} />}
        </div>
    );
}

export default App;
