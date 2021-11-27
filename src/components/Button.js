import React from "react";

export default function Button({ onClick = function () {}, img = "", alt = "", className = "", children = "" }) {
    return (
        <button onClick={onClick} className={className}>
            {img && <img src={img} alt={alt}></img>}
            {children}
        </button>
    );
}
