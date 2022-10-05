import React from "react";
import "./searchResult.css"
import {Link, useOutletContext} from "react-router-dom";
import {dateParserFull} from "../../../utils/DateUtils";

export default function ProjectListItem({project}) {
    const context = useOutletContext();
    const link = project.name.toLowerCase().split(" ").join("-");

    return (
        <div className={"col-6"} onClick={() => context.setCurrentProject(project)}>
            <Link to={"/dashboard/project/" + link + "/summary"} className={"border rounded p-2"} style={{textDecoration: "none"}}>
                <div className={"ms-4"}>
                    <div className={"d-block mb-1 link"}>
                        {project.name}
                    </div>
                    <p className={"text-muted mb-0 paragraph"}>
                        {project.description}
                    </p>
                    <small className={"text-muted details"}>
                        {dateParserFull(project.creationDate)}
                    </small>
                </div>
            </Link>
        </div>
    )
}