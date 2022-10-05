import React from "react";
import "../memberList.css";

export default function MemberInfo({fullName = "Agile Express", firstLetters = "AA", email = "demo@example.com", style}) {
    return (
        <div className={"member-info-container"} style={{...style}}>
            <span className={"avatar"}>{firstLetters}</span>
            <div className={"textual-info-container"}>
                <span className={"full-name"}>{fullName}</span>
                <span className="text-muted email">{email}</span>
            </div>
        </div>
    )
}