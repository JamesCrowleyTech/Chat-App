import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import Message from "./Message";

export default function Channel({ user = "" }) {
    const db = firebase.firestore();
    const [messages, setMessages] = useState([]);
    const [rerender, causeRerender] = useState(0);

    const messagesCollection = db.collection("messages");

    const { uid, displayName, photoURL } = user;

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

        causeRerender(rerender + 1);
    };

    useEffect(function () {
        const unsub = messagesCollection
            .orderBy("createdAt", "desc")
            .limit(120)
            .onSnapshot(function (querySnapshot) {
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
                causeRerender(rerender + 1);
            });
        return unsub;
    }, []);

    useEffect(
        function () {
            const lastMessage = document.querySelector(".channel").lastChild;
            if (!lastMessage) return;
            lastMessage.scrollIntoView({ behaviour: "smooth" });
        },
        [rerender]
    );

    return (
        <div className="main-wrapper">
            <div className="channel">
                {messages.map(function (message) {
                    return <Message {...message} key={message.id} />;
                })}
            </div>
            <form className="channel__form" onSubmit={handleOnSubmit}>
                <input className="channel__input" placeholder="Write your message here"></input>
            </form>
        </div>
    );
}
