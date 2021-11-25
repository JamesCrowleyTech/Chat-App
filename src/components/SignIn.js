import React, { useState, useRef } from "react";
import iconGoogle from "../img/icon-google.png";
import firebase from "@firebase/app-compat";
import Button from "./Button";
import { auth } from "../App";

export default function SignIn() {
    const [userHasAccount, setUserHasAccount] = useState(true);
    const emailRef = useRef("");
    const passwordRef = useRef("");

    const createUserEmailPasswordHandler = async function () {
        try {
            await auth.createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value);
        } catch (err) {
            console.error(err);
        }
    };

    const signInEmailPasswordHandler = async function () {
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
                <input
                    type="email"
                    className="sign-in__form-input"
                    ref={emailRef}
                    onChange={() => console.log(emailRef.current.value)}
                    placeholder="Email Address"
                ></input>
                <input
                    type="password"
                    className="sign-in__form-input"
                    ref={passwordRef}
                    onChange={() => console.log(passwordRef.current.value)}
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
