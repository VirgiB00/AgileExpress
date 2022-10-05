import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAnglesDown, faUserAstronaut} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import "../memberList.css";

export default function MemberPromoteManager({clickFunction}) {
    return (
        <div className={"actions"}>
            <div className="d-inline-block px-2 py-1 rounded bg-light shadow-sm bg-hover-primary"
                 onClick={clickFunction}>
                <FontAwesomeIcon icon={faUserAstronaut} className="text-success icon"></FontAwesomeIcon>
            </div>
        </div>
    )
}