import React from 'react'
import "./sprintListItem.css";
import OverflowedText from "../../../../text/OverflowedText.js";
import {dateParser} from "../../../../../utils/DateUtils";
import {sprintStatusMapper} from "../../../../../utils/ValueMapper";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck, faCircleExclamation, faCirclePause} from "@fortawesome/free-solid-svg-icons";
import {CustomTooltip} from "../../../../tooltip/tooltip";
import {useNavigate, useParams} from "react-router-dom";

export default function SprintListItem({sprint}) {
    const navigate = useNavigate();
    const params = useParams();
    const statusValues = sprintStatusMapper.map(sprint.status);
    const taskNumbers = countTasks(sprint.tasks);

    // Hangi statüye ait kaç task olduğunu hesaplar
    function countTasks(tasks) {
        let passive = 0;
        let wip = 0;
        let done = 0;
        tasks.forEach(task => {
            if (task.status === "passive")
                passive += 1;
            else if (task.status === "wip")
                wip += 1;
            else if (task.status === "done")
                done += 1;
        })
        return {passive: passive, wip: wip, done: done};
    }

    function navigateToSprintDetail(sprintId) {
        navigate("/dashboard/project/" + params.projectLinkName + "/sprint/" + sprintId);
    }

    // Task sayısını belirten bileşeni döndürür.
    function taskNumber(text, icon, color, number) {
        return (
            <CustomTooltip text={text}>
                <div className={"me-3"}>
                    <FontAwesomeIcon icon={icon} style={{color: color, marginRight: "5px"}}/>
                    {number}
                </div>
            </CustomTooltip>
        )
    }

    return (
        <div key={sprint.id} className={"rounded bg-white my-1 d-flex flex-row p-2 align-items-center"}
             style={{width: "100%", cursor: "pointer"}} onClick={() => navigateToSprintDetail(sprint.id)}>
            <OverflowedText customStyle={{fontWeight: 600, marginLeft: "10px"}}>{sprint.name}</OverflowedText>
            <div className={"d-flex flex-row me-5 ms-auto"}>
                {taskNumber("To-do task", faCirclePause, "gray", taskNumbers.passive)}
                {taskNumber("In-progress task", faCircleExclamation, "yellow", taskNumbers.wip)}
                {taskNumber("Completed task", faCircleCheck, "green", taskNumbers.done)}
            </div>
            <div className={"d-flex flex-row"}>
                <div className={"d-flex flex-column me-2"}>
                    <div>Start date:</div>
                    <div>Due date:</div>
                </div>
                <div className={"d-flex flex-column me-5"}>
                    <div>{dateParser(sprint.startDate)}</div>
                    <div>{dateParser(sprint.endDate)}</div>
                </div>
                <div
                    className={"d-flex rounded text-white py-1 justify-content-center align-items-center align-self-center me-3 " + statusValues.style}
                    style={{width: "110px", height: "38px"}}>{statusValues.text}</div>
            </div>
        </div>
    )
}
