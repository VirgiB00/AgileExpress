import {useParams} from "react-router-dom";
import React, {useState} from "react";
import Loading from "../../../loading/Loading";
import TaskDetail from "./TaskDetail";
import {getTask} from "../../../../utils/Requests";

export default function Task() {
    const [task, setTask] = useState(null);
    const [sendFlag, setSendFlag] = useState(true);

    const params = useParams();

    // Task bilgisini edin.
    if (sendFlag) {
        getTask(params.itemId)
            .then(body => {
                setTask(body);
            })
        setSendFlag(false);
    }

    if (task === null) {
        return <Loading/>;
    } else {
        return (
            <div className={"rounded-top border-start border-top border-end shadow-sm"} style={{height: "100%", overflowY: "hidden"}}>
                <TaskDetail task={task} callback={() => setSendFlag(true)}/>
            </div>
        )
    }
}