import {useOutletContext} from "react-router-dom";
import React, {useState} from "react";
import {assignUserToTask, getAssignedUsersOfProject} from "../../../../utils/Requests";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {AlertModal, VerticalCenteredModal} from "../../../modal/CustomModal";
import MemberSelectDropDown from "../../../Dropdown/MemberSelectDropDown";
import {TaskMembersList} from "./TaskMembersList";

export function AssignUserToTaskModal({task, callback}) {
    const context = useOutletContext();
    const [formIsOpen, setFormIsOpen] = useState(false);
    const [sendFlag, setSendFlag] = useState(true);
    const [projectMembers, setProjectMembers] = useState(null);
    const [alert, setAlert] = useState(false);

    if (sendFlag) {
        getAssignedUsersOfProject(context.currentProject.id)
            .then(body => {
                setProjectMembers(filterAssignedMembers(body, task.assignments));
            });
        setSendFlag(false);
    }

    // Proje üyesi listesinden task'a atanmış olan üyeleri çıkarır.
    function filterAssignedMembers(projectMembers, taskMembers) {
        const availableProjectMembers = [];
        projectMembers.forEach(projectMember => {
            let flag = true;
            for (const taskMember of taskMembers) {
                if (projectMember.mail === taskMember.mail) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                availableProjectMembers.push(projectMember);
            }
        })
        return availableProjectMembers;
    }

    function assignUser(userId) {
        if (userId === "choose") {
           setAlert(true)
        } else {
            assignUserToTask(task.id, userId)
                .then(body => {
                    if (body === undefined) {
                        callback();
                        setFormIsOpen(false);
                    }
                });
        }
    }

    // Modal body'sini döndürür.
    const body = (
        <>
            <div className={"d-flex flex-row-reverse"}>
                <FontAwesomeIcon icon={faXmark} onClick={() => setFormIsOpen(false)} style={{height: "25px"}}/>
            </div>
            <div className={"d-flex flex-column mx-4"}>
                <MemberSelectDropDown assignments={projectMembers} btnClick={assignUser}/>
                <span>Available Members</span>
                <TaskMembersList members={projectMembers}/>
            </div>
        </>
    );

    return (
        <>
            <AlertModal modalShow={alert} setModalShow={setAlert} header={<span className={"text-center w-100"}>Please select a member from the list.</span>}/>
            <VerticalCenteredModal modalShow={formIsOpen} setModalShow={setFormIsOpen} body={body}/>
            <button className={"rounded bg-dark text-white"} style={{width: "100px", height: "38px", borderWidth: "0px"}} onClick={() => setFormIsOpen(true)}>
                <span style={{fontSize: "14px"}}>Assign</span>
            </button>
        </>
    )
}