import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAnglesDown} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import "../memberList.css";

export default function MemberDemoteAction({clickFunction}) {
    return (
        <div className={"actions"}>
            <div className="d-inline-block px-2 py-1 rounded bg-light shadow-sm bg-hover-primary"
                 onClick={clickFunction}>
                <FontAwesomeIcon icon={faAnglesDown} className="text-warning icon"></FontAwesomeIcon>
            </div>
        </div>
    )
}