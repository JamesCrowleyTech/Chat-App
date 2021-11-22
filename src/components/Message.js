import React from "react";

export default function Message({ name, createdAt, text, photoURL }) {
    const messageDate = new Date(createdAt.seconds * 1000);
    const displayDate = new Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "numeric" }).format(messageDate);

    return (
        <div className="message">
            <div className="message__image-container">
                <img src={photoURL} className="message__image" alt="User's Profile"></img>
            </div>
            <div className="message__top-row">
                <p>
                    <span className="message__username">{name}</span> <span className="message__date">{displayDate}</span>
                </p>
            </div>
            <p className="message__text">{text}</p>
        </div>
    );
}
