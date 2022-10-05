import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {DeleteButton} from "../../../button/DeleteButton";
import {deleteSprint} from "../../../../utils/Requests";

export function SprintDeleteButton({sprint}) {
    const navigate = useNavigate();
    const params = useParams();

    function handleDelete() {
        deleteSprint(sprint.id)
            .then(body => {
                if (body === undefined) {
                    navigate("/dashboard/project/" + params.projectLinkName + "/sprints");
                }
            });
    }
    return <DeleteButton handleDelete={handleDelete}/>
}