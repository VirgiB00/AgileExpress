import {MemberList} from "./MemberList";
import React, {useState} from "react";
import Loading from "../../../loading/Loading";
import {requestBodyValues} from "../../../../utils/FetchInit";
import AddUserGroup from "../../ProjectsScreen/AddUserGroup";
import {getAssignedUsersOfProject, inviteUsersToProject} from "../../../../utils/Requests";
import {useOutletContext} from "react-router-dom";
import {AlertModal} from "../../../modal/CustomModal";
import {compareByMemberStatus} from "../../../../utils/Comparators";

export default function MembersScreen() {
    const context = useOutletContext();
    const [projectMembers, setProjectMembers] = useState(null);
    const [invitedMembers, setInvitedMembers] = useState([]);
    const [sendFlag, setSendFlag] = useState(true);
    const [alert, setAlert] = useState(false);

    // Projeye bulunan üyeleri döndürür.
    if (context.currentProject !== null && sendFlag) {
        getAssignedUsersOfProject(context.currentProject.id)
            .then(body => {
                setProjectMembers(body.sort(compareByMemberStatus));
            });
        setSendFlag(false);
    }

    // Listedeki kullanıcıları projeye davet eder.
    function invite() {
        if (invitedMembers.length > 0) {
            inviteUsersToProject(context.currentProject.id, invitedMembers)
                .then(body => {
                    if (body === requestBodyValues.success) {
                        setInvitedMembers([]);
                    }
                })
        } else {
            setAlert(true);
        }
    }

    if (projectMembers === null) {
        return <Loading/>
    } else {
        return (
            <div className={"d-flex flex-column border rounded bg-light mb-5"}>
                <AlertModal modalShow={alert} setModalShow={setAlert} header={<span className={"text-center w-100"}>There is no invited user on the list.</span>}/>
                <div className={"d-flex flex-row justify-content-between"}>
                    <div style={{
                        marginLeft: "30px",
                        fontWeight: 600,
                        fontSize: "20px",
                        marginBottom: "40px",
                    }}>
                        Assigned Members
                    </div>
                    <div>
                        <div className="input-group mx-4 my-3">
                            <AddUserGroup list={invitedMembers} setList={setInvitedMembers}/>
                            <button className="btn btn-outline-secondary bg-warning"
                                    style={{height: "31px", marginTop: "32px", lineHeight: "1"}}
                                    type="button" id="button-addon2" onClick={invite}>INVITE
                            </button>
                        </div>
                    </div>
                </div>
                <div className={"px-5"} style={{height: "65vh"}}>
                    <MemberList members={projectMembers} callback={() => setSendFlag(true)}/>
                </div>
            </div>
        )
    }
}