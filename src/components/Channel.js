import React, { useState, useEffect } from "react";
import Message from "./Message";
import { db } from "../App";

export default function Channel({ user = "" }) {
    const [messages, setMessages] = useState([]);
    const [photoURL, setPhotoURL] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const causeRerender = useState()[1];
    const [messageBeingEdited, setMessageBeingEdited] = useState(null);

    const providerId = user.providerData[0].providerId;
    const messagesCollection = db.collection("messages");
    const emailPasswordDataCollection = db.collection("emailPasswordUserData");

    const { uid } = user;

    useEffect(function () {
        if (providerId !== "password") {
            setPhotoURL(user.photoURL);
            setDisplayName(user.displayName);
        }
        if (providerId === "password") {
            emailPasswordDataCollection
                .doc(`user-${uid}`)
                .get()
                .then((doc) => doc.data())
                .then(function (data) {
                    setPhotoURL(data.photoURL);
                    setDisplayName(data.displayName);
                });
        }
    }, []);

    const handleOnSubmit = function (e) {
        e.preventDefault();

        const inputField = document.querySelector(".channel__input");

        const newMessage = inputField.value;

        inputField.value = null;

        const trimmedMessage = newMessage.trim();

        if (!trimmedMessage) return;

        messagesCollection.add({
            text: trimmedMessage,
            createdAt: new Date(),
            uid,
            name: displayName,
            photoURL,
        });
    };

    useEffect(function () {
        const unsub = messagesCollection.orderBy("createdAt", "desc").onSnapshot(function (querySnapshot) {
            setMessages(
                querySnapshot.docs
                    .map(function (doc) {
                        return {
                            ...doc.data(),
                            id: doc.id,
                        };
                    })
                    .slice(0)
                    .reverse()
            );
            causeRerender();
        });
        return unsub;
    }, []);

    useEffect(function () {
        const lastMessage = document.querySelector(".channel").lastChild;
        if (!lastMessage) return;
        lastMessage.scrollIntoView({ behaviour: "smooth" });
    });

    useEffect(function () {
        const editSelectHandler = function (e) {
            e.preventDefault();

            const closestMessage = e.target.closest(".message");

            if (
                !closestMessage ||
                (!e.target.closest(".message__edit") && !e.target.closest(".message__edit-input")) ||
                (e.target.closest(".message__edit") && messageBeingEdited === closestMessage.id)
            ) {
                if (messageBeingEdited) {
                    document.querySelector(`#${messageBeingEdited}`).style.height = "unset";
                }
                setMessageBeingEdited(null);
                return;
            }

            if (closestMessage) {
                closestMessage.style.height = "8.3rem";
                if (messageBeingEdited && !e.target.closest(".message__edit-input"))
                    document.querySelector(`#${messageBeingEdited}`).style.height = "unset";
                setMessageBeingEdited(closestMessage.id);
            }
            if (!closestMessage) {
                if (messageBeingEdited) document.querySelector(`#${messageBeingEdited}`).style.height = "unset";
                setMessageBeingEdited(null);
            }
        };

        window.addEventListener("click", editSelectHandler);

        return function () {
            window.removeEventListener("click", editSelectHandler);
        };
    });

    return (
        <>
            {user && <h2 className="signed-in-as">User: {displayName}</h2>}
            <div className="main-wrapper">
                <div className="channel">
                    {messages.map(function (message) {
                        return (
                            <Message
                                {...message}
                                currentlyBeingEdited={messageBeingEdited === `message--${message.id}`}
                                setMessageBeingEdited={setMessageBeingEdited}
                                usersOwnMessage={message.uid === uid}
                                key={message.id}
                            />
                        );
                    })}
                </div>
                <form className="channel__form" onSubmit={handleOnSubmit}>
                    <input className="channel__input" placeholder="Your messages will be publicly visible"></input>
                </form>
            </div>
        </>
    );
}
