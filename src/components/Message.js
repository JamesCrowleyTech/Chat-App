import React from "react";
import firebase from "@firebase/app-compat";
import { db } from "../App";

export default function Message({ name, createdAt, text, photoURL, id, usersOwnMessage }) {
    const messageDate = new Date(createdAt.seconds * 1000);
    const displayDate = new Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "numeric" }).format(messageDate);

    const deleteButtonHandler = async function () {
        db.collection("messages")
            .doc(`${id}`)
            .delete()
            .catch((err) => console.error(err));
    };

    return (
        <div className="message" data-id={id}>
            <div className="message__image-container">
                <img src={photoURL} className="message__image" alt="User's Profile"></img>
            </div>
            <div className="message__top-row">
                <p>
                    <span className="message__username">{name}</span> <span className="message__date">{displayDate}</span>
                </p>
            </div>
            <p className="message__text">{text}</p>
            {usersOwnMessage && (
                <div className="message__buttons">
                    <button type="button" className="message__button message__edit">
                        Edit
                    </button>
                    <button type="button" className="message__button message__delete" onClick={deleteButtonHandler.bind(id)}>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
