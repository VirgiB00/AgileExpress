import React, {useState} from 'react';
import InputToSpanSwitchText from "../../../text/InputToSpanSwitchText";
import Loading from "../../../loading/Loading";
import OverflowedText from "../../../text/OverflowedText";
import "bootstrap";
import {useNavigate, useOutletContext} from "react-router-dom";
import {deleteProject, updateProject} from "../../../../utils/Requests";
import CustomDropdownButton from "../../../Dropdown/CustomDropdownButton";
import {projectStatusMapper} from "../../../../utils/ValueMapper";

export default function SummaryScreen({callback}) {
    const context = useOutletContext();
    const [valueAssigned, setVA] = useState(false);
    const [newName, setNewName] = useState(null);
    const [newDescription, setNewDescription] = useState(null);
    const [newStatus, setNewStatus] = useState(null);
    const navigate = useNavigate();

    const project = context.currentProject;
    const role = context.userRoleOnProject;

    if (!valueAssigned) {
        setNewName(project.name);
        setNewDescription(project.description);
        setNewStatus(project.status);
        setVA(true);
    }

    // TODO güncelleme olduğunda görsel bir belirteç kullan
    // Save tuşuna basıldığında bilgiler eğer değiştiyse günceller.
    function update() {
        // TODO validation yap
        if (newName !== project.name || newDescription !== project.desc || project.status !== newStatus) {
            updateProject(project.id, newName, newDescription, newStatus)
                .then(body => {
                    if (body === undefined) {
                        callback();
                    }
                });
        }
    }

    // Projeyi silmek için istek atar
    function handleDelete() {
        const answer = window.confirm("Are you sure?")
        if (answer) {
            deleteProject(project.id)
                .then(body => {
                    if (body === undefined) {
                        navigate("/dashboard/projects");
                    }
                });
        }
    }

    // Proje adı için değiştirlebilir veya değiştirilemez şekilde bileşen döndürür.
    const nameField = () => {
        if (role === "project_manager") {
            return <InputToSpanSwitchText field={newName} setField={setNewName}
                                          textStyles={{fontSize: "30px"}}/>
        } else {
            return (
                <div className={"d-flex align-self-center flex-fill"} style={{marginLeft: "10px", fontSize: "30px"}}>
                    <OverflowedText customStyle={{width: "100%"}}>
                        {project.name}
                    </OverflowedText>
                </div>
            )
        }
    }


    // Proje açıklaması için değiştirilebilir veya değiştirilemez şekilde bileşen döndürür.
    const descField = () => {
        if (role === "project_manager") {
            return <InputToSpanSwitchText field={newDescription} setField={setNewDescription}/>
        } else {
            return (
                <div className={"d-flex align-self-center flex-fill"} style={{marginLeft: "10px"}}>
                    <OverflowedText customStyle={{width: "100%"}}>
                        {project.desc}
                    </OverflowedText>
                </div>
            )
        }
    }

    const saveBtn = () => {
        if (role === "project_manager") {
            return (
                <button style={{width: "150px", marginBottom: "10px"}} type="button"
                        className={"btn btn-primary rounded-pill"} onClick={update}>
                    SAVE
                </button>
            )
        }
    }

    const deleteButton = () => {
        if (role === "project_manager") {
            return (
                <button style={{width: "150px"}} type="button" className="btn btn-danger rounded-pill" onClick={handleDelete}>
                    DELETE
                </button>
            )
        }
    }

    if (project === null) {
        return <Loading/>
    } else {
        return (
            <div className="rounded-4 border"
                 style={{height: "500px", marginLeft: "10px", marginRight: "10px", marginTop: "30px"}}>
                <div className="m-3">
                    <div className="d-flex flex-row" style={{width: "auto"}}>
                        <div style={{width: "100%"}}>
                            <div style={{marginBottom: "10px"}}>
                                {nameField()}
                            </div>
                            {descField()}
                        </div>
                        <div className={"d-flex flex-column align-items-center"} style={{marginLeft: "50px"}}>
                            {saveBtn()}
                            <CustomDropdownButton value={newStatus} setValue={setNewStatus} mapper={projectStatusMapper}/>
                            {deleteButton()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}