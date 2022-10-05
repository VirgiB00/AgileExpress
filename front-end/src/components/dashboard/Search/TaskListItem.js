import React from "react";
import "./searchResult.css"
import {Link, useOutletContext} from "react-router-dom";
import {computeProjectLinkName} from "../../../utils/TextFunction";

export default function TaskListItem({task}) {
    const context = useOutletContext();

    return (
        <div className={"col-12"} onClick={() => context.setCurrentProject(task.project)}>
            <Link to={"/dashboard/project/" + computeProjectLinkName(task.project.name) + "/task/" + task.id}
                  className={"d-flex align-items-center border rounded p-2 task-container"}
                  style={{textDecoration: "none"}}>
                <div>
                <span className={"d-block lh-1 task-name"}>
                    {task.name}
                </span>
                    <span className={"lh-1 task-description"}>
                    {task.description}
                </span>
                </div>
                <small className={"text-muted lh-1 details"}>
                    <span className={"d-block"}>Created At</span>
                    <span className={"d-block fw-normal"}>{task.startDate}</span>
                </small>
                <small className={"text-muted lh-1 details"}>
                    <span className={"d-block"}>Status</span>
                    <span className={"d-block fw-normal"}>{task.status}</span>
                </small>
            </Link>
        </div>
    )
}