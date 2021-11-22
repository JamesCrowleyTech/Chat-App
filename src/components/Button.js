import React from "react";

export default function Button({ onClick, className = "", children = "", img = "" }) {
    return (
        <button onClick={onClick} className={className}>
            {img && <img src={img} alt=""></img>}
            {children}
        </button>
    );
}
