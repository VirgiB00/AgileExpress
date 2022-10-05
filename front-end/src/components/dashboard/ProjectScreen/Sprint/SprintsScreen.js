import React, {useState} from 'react';
import "../../ProjectsScreen/project.css";
import PlainList from "../../../list/plainList";
import Loading from "../../../loading/Loading";
import {getSprints} from "../../../../utils/Requests";
import SprintCreateModal from "./SprintCreateModal";
import SprintListItem from "./List/SprintListItem";
import {useOutletContext} from "react-router-dom";
import {compareBySprintStatus} from "../../../../utils/Comparators";

export default function SprintsScreen() {
    const context = useOutletContext();
    const [sprints, setSprints] = useState(null);
    const [sendFlag, setSendFlag] = useState(true);

    if (sendFlag) {
        getSprints(context.currentProject.id)
            .then(body => {
                setSprints(body.sort(compareBySprintStatus));
            })
        setSendFlag(false);
    }

    if (sprints === null) {
        return <Loading/>
    } else {
        return (
            <div>
                <div className={"ms-2"}>
                    <SprintCreateModal callBack={() => setSendFlag(true)}/>
                </div>
                <div className={"d-flex border rounded"} style={{height: "65vh"}}>
                    <div style={{width: "100%"}}>
                        <PlainList listName={""} items={sprints} listItem={(sprint) => <SprintListItem sprint={sprint}/>}/>
                    </div>
                </div>
            </div>
        )
    }
}