import React from "react";
import "./searchResult.css"
import {computeFirstLetters, computeFullName} from "../../../utils/TextFunction";

export default function UserListItem({user}) {

    return (
        <div className={"col-6"}>
            <div className={"d-flex align-items-center border rounded p-2"}>
                <div className={"user-avatar"}>
                    <span>{computeFirstLetters(user.firstName, user.surname)}</span>
                </div>
                <div className={"user-info-container"}>
                    <div className={"d-flex flex-column"}>
                        <div className={"d-block link user-full-name"}>
                            {computeFullName(user.firstName, user.surname)}
                        </div>
                    </div>
                </div>
                <span className={"lh-1 user-role"}>
                    {user.mail}
                </span>
            </div>
        </div>
    )
}