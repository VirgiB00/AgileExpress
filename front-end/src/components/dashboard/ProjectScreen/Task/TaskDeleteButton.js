import {deleteTask} from "../../../../utils/Requests";
import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {DeleteButton} from "../../../button/DeleteButton";

export function TaskDeleteButton({task}) {
    const navigate = useNavigate();
    const params = useParams();

    function handleDelete() {
        deleteTask(task.id)
            .then(body => {
                if (body === undefined) {
                    // TODO buraya sprint sayfasından ulaştıysa sprint'e, tasklar sayfasından ulaştıysa tasklar sayfasına yönlendir.
                    navigate("/dashboard/project/" + params.projectLinkName + "/tasks");
                }
            });
    }
    return <DeleteButton handleDelete={handleDelete}/>
}