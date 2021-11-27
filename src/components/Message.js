import React, { useState, useEffect, useRef } from "react";
import firebase from "@firebase/app-compat";
import { db } from "../App";

export default function Message({
    name,
    createdAt,
    text,
    photoURL,
    id,
    usersOwnMessage,
    currentlyBeingEdited,
    setMessageBeingEdited,
}) {
    const messageDate = new Date(createdAt.seconds * 1000);
    const displayDate = new Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "numeric" }).format(messageDate);
    const editInputRef = useRef("");

    const deleteButtonHandler = async function () {
        db.collection("messages")
            .doc(`${id}`)
            .delete()
            .catch((err) => console.error(err));
    };

    const editSubmitHandler = async function (e) {
        e.preventDefault();

        const message = document.querySelector(`#message--${id}`);
        const editInput = document.querySelector(".message__edit-input");

        message.style.height = "unset";

        db.collection("messages")
            .doc(id)
            .update({ text: `${editInput.value}` });
        setMessageBeingEdited(null);
    };

    useEffect(function () {
        currentlyBeingEdited && document.querySelector(".message__edit-input").focus();
    });

    return (
        <div className="message" id={`message--${id}`}>
            <div className="message__image-container">
                <img src={photoURL} className="message__image" alt="User's Profile"></img>
            </div>
            <div className="message__top-row">
                <p>
                    <span className="message__username">{name}</span> <span className="message__date">{displayDate}</span>
                </p>
            </div>

            {currentlyBeingEdited ? (
                <form onSubmit={editSubmitHandler}>
                    <input type="text" className="message__edit-input" defaultValue={text}></input>
                </form>
            ) : (
                <p className="message__text">{text}</p>
            )}

            {usersOwnMessage && (
                <div className="message__buttons">
                    <button type="button" className="message__button message__edit">
                        Edit
                    </button>
                    <button type="button" className="message__button message__delete" onClick={deleteButtonHandler}>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
