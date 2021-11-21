import React from "react";

export default function Message({ name, createdAt, text, photoURL }) {
    return (
        <div className="message">
            <div className="message__top-row">
                <div className="message__image-container">
                    <img src={photoURL} className="message__image"></img>
                </div>
                <h3 className="message__title">{name}</h3>
                <h5 className="message__timestamp">{createdAt.seconds}</h5>
            </div>
            <p className="message__text">{text}</p>
        </div>
    );
}
