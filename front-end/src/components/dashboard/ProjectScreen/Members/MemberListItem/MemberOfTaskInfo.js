import React from "react";
import "../memberList.css";
import OverflowedText from "../../../../text/OverflowedText";

export function MemberOfTaskInfo({fullName = "Agile Express", firstLetters = "AE", email = "demo@example.com", children}) {

    const child = (children) ? <div style={{width: "250px"}}>{children}</div> : <></>;

    return (
        <div className={"d-flex justify-content-around"} style={{borderBottom: "0.05rem solid gray"}}>
            <div className={"d-flex flex-row mb-2"}>
                <span className={"avatar"}>{firstLetters}</span>
                <div className={"textual-info-container"}>
                    <OverflowedText customStyle={{width: "250px"}}><span className={"full-name"}>{fullName}</span></OverflowedText>
                </div>
            </div>
            <div className={"textual-info-container"}>
                <OverflowedText customStyle={{width: "250px"}}>{email}</OverflowedText>
            </div>
            {child}
        </div>
    )
}