import React, { useState, useRef } from "react";
import iconGoogle from "../img/icon-google.png";
import firebase from "@firebase/app-compat";
import Button from "./Button";
import { auth } from "../App";

const randomColor = function () {
    let chars = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        color += chars[Math.floor(Math.random() * 16)];
    }

    return color;
};

const makeImageFromInitials = function (sizePx = 256, color, text = "") {
    if (!text) return;

    if (!color) color = randomColor();

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = canvas.height = sizePx;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, sizePx, sizePx);

    context.fillStyle = `${color}50`;
    context.fillRect(0, 0, sizePx, sizePx);

    context.fillStyle = color;
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.font = `${sizePx / 2}px arial`;
    context.fillText(text, sizePx / 2, sizePx / 2);
    return canvas.toDataURL();
};

export default function SignIn({ emailPasswordDataCollection }) {
    const [userHasAccount, setUserHasAccount] = useState(true);
    const usernameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");

    const createUserEmailPasswordHandler = async function () {
        try {
            const username = usernameRef.current.value;
            await auth.createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value);

            const user = auth.currentUser;

            const initials = username
                .split(" ")
                .map((n) => n[0].toUpperCase())
                .join("");

            const photoURL = makeImageFromInitials(256, "", initials);

            emailPasswordDataCollection.doc(`user-${user.uid}`).set({
                displayName: username,
                photoURL: photoURL,
            });
        } catch (err) {
            console.error(err);
        }
    };

    const signInEmailPasswordHandler = async function () {
        try {
            await auth.signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value);
        } catch (err) {
            console.error(err.code);
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

    return userHasAccount ? (
        <div className="sign-in">
            <h2 className="sign-in__title">Sign in to chat!</h2>
            <Button onClick={signInWithGoogle} img={iconGoogle} className="button button--sign-in-google">
                Sign In With Google
            </Button>
            <p className="sign-in-with-email-text">Or Sign In With Email</p>
            <form
                className="sign-in__form"
                onSubmit={(e) => {
                    e.preventDefault();
                    signInEmailPasswordHandler();
                }}
            >
                <input type="email" className="sign-in__form-input" ref={emailRef} placeholder="Email Address"></input>
                <input
                    type="password"
                    className="sign-in__form-input"
                    ref={passwordRef}
                    placeholder="Password"
                    minLength="6"
                    maxLength="24"
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
            <form
                className="sign-up__form"
                onSubmit={(e) => {
                    e.preventDefault();
                    createUserEmailPasswordHandler();
                }}
            >
                <input
                    type="text"
                    className="sign-in__form-input"
                    ref={usernameRef}
                    placeholder="Username"
                    minLength="4"
                    maxLength="20"
                    required
                ></input>
                <input type="email" className="sign-up__form-input" placeholder="Email Address" ref={emailRef} required></input>
                <input
                    minLength="6"
                    maxLength="24"
                    type="password"
                    className="sign-up__form-input"
                    placeholder="Password"
                    required
                    ref={passwordRef}
                ></input>
                <button type="submit" className="sign-up__form-button">
                    Submit!
                </button>
            </form>
            <p className="sign-up-link">
                Already have an account?&nbsp;
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
    );
}
