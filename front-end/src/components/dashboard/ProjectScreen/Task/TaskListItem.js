import React from 'react'
import "../Sprint/List/sprintListItem.css";
import OverflowedText from "../../../text/OverflowedText.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTriangleExclamation, faUser} from "@fortawesome/free-solid-svg-icons";
import {computeFirstLetters} from "../../../../utils/TextFunction";
import {CustomTooltip} from "../../../tooltip/tooltip";
import {dateParserFull, remainingDays} from "../../../../utils/DateUtils";
import {useNavigate, useParams} from "react-router-dom";

function TaskItem({task, childrenRight = <></>, childrenBottom = <></>}) {
    const navigate = useNavigate();
    const params = useParams();

    function navigateTo() {
        navigate("/dashboard/project/" + params.projectLinkName + "/task/" + task.id);
    }

    return (
        <div key={task.id} className={"rounded bg-white my-1 d-flex flex-column"} style={{maxWidth: "100%"}}
             onClick={navigateTo}>
            <div className={"d-flex flex-row justify-content-between"}>
                <div className={"d-flex flex-column ps-2"}>
                    <OverflowedText customStyle={{fontWeight: 600, fontSize: "20px"}}>{task.name}</OverflowedText>
                    <OverflowedText customStyle={{fontWeight: 400}}>{task.description}</OverflowedText>
                </div>
                {childrenRight}
            </div>
            {childrenBottom}
        </div>
    )
}

export function TaskPassiveListItem({task}) {
    return <TaskItem task={task}/>

}

export function TaskInProgressListItem({task}) {
    const leftDays = remainingDays(task);
    // Eğer kalan günler 2 den azsa uyarı ikonu gösterir
    const hideWarningIcon = (leftDays < 2) ? {} : {display: "none"};
    const textColor = (leftDays < 2) ? "red" : "black";

    const rightSideContent = (
        <div style={{color: textColor}}>
            <FontAwesomeIcon icon={faTriangleExclamation} style={{marginRight: "5px", ...hideWarningIcon}}/>
            <span style={{width: "100%", whiteSpace: "nowrap", marginRight: "5px"}}>
                        {leftDays} day(s) left
                    </span>
        </div>
    )

    return <TaskItem task={task} childrenRight={rightSideContent}/>

}

export function TaskCompletedListItem({task}) {
    const content = (
        <div className={"align-self-end"}>
            <span style={{width: "100%", whiteSpace: "nowrap", marginRight: "5px", fontSize: "12px"}}>
                Completion date: {dateParserFull(task.completionDate)}
            </span>
        </div>
    )
    return <TaskItem task={task} childrenBottom={content}/>
}

export function avatarIcons(members) {
    if (members.length !== 0) {
        return members.map(function (member, i) {
            return (
                <div key={i} className={"dot d-flex justify-content-center align-items-center"}>
                    {computeFirstLetters(member.firstName, member.surname)}
                </div>
            )
        })
    } else {
        return (
            <div className={"dot d-flex justify-content-center align-items-center bg-secondary"}
                 style={{cursor: "pointer"}}>
                <CustomTooltip text={"No member assigned"}>
                    <FontAwesomeIcon icon={faUser}/>
                </CustomTooltip>
            </div>
        )
    }
}
