import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import Message from "./Message";

export default function Channel({ user = "" }) {
    const db = firebase.firestore();
    const [messages, setMessages] = useState([]);

    const messagesCollection = db.collection("messages");

    const { uid, displayName, photoURL } = user;

    const [newMessage, setNewMessage] = useState("");

    const handleOnChange = function (e) {
        setNewMessage(e.target.value);
    };

    const handleOnSubmit = function (e) {
        e.preventDefault();

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

    useEffect(
        function () {
            const unsub = messagesCollection
                .orderBy("createdAt")
                .limit(120)
                .onSnapshot(function (querySnapshot) {
                    setMessages(
                        querySnapshot.docs.map(function (doc) {
                            return {
                                ...doc.data(),
                                id: doc.id,
                            };
                        })
                    );

                    console.log(messages);
                });

            return unsub;
        },
        [db]
    );

    return (
        <div className="main-wrapper">
            <div className="channel">
                {messages.map(function (message) {
                    console.log(message);
                    return <Message {...message} key={message.id} />;
                })}
            </div>
            <form className="channel__form" onSubmit={handleOnSubmit}>
                <input onChange={handleOnChange} className="channel__input" placeholder="Write your message here"></input>
            </form>
        </div>
    );
}
