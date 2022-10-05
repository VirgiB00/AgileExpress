import React from "react";
import "../../ProjectsScreen/project.css";
import "./memberList.css";
import {ColumnItem, HeadItem, TableList} from "../../../list/tableList";
import {avatarIcons} from "../Task/TaskListItem";
import {computeFullName} from "../../../../utils/TextFunction";
import OverflowedText from "../../../text/OverflowedText";
import {unassignUserFromProject, updateUserRole} from "../../../../utils/Requests";
import {useOutletContext} from "react-router-dom";
import MemberDeleteAction from "./MemberListItem/MemberDeleteAction";
import MemberPromoteAction from "./MemberListItem/MemberPromoteAction";
import MemberPromoteManager from "./MemberListItem/MemberPromoteManager";
import MemberDemoteAction from "./MemberListItem/MemberDemoteAction";

export function MemberList({members, callback}) {
    const context = useOutletContext();

    function deleteUserIcon(user) {
        // Projeden kullanıcıyı çıkarır.
        function unassignUser(userId) {
            unassignUserFromProject(context.currentProject.id, userId)
                .then(body => {
                    if (body === undefined) {
                        callback();
                    }
                })
        }
        return <MemberDeleteAction clickFunction={() => unassignUser(user.id)}/>
    }

    function updateRoleIcon(member) {
        const user = member.assignedUser;

        // Bir kullanıcıyı lead'e yükseltir veya member'a düşürür.
        function updateRole(userId, action) {
            const newRole = (action === "promote") ? "team_lead" : "team_member";
            updateUserRole(context.currentProject.id, userId, newRole)
                .then(body => {
                    if (body === undefined) {
                        callback();
                    }
                })
        }

        if (member.role === "team_member") {
            return <MemberPromoteAction clickFunction={() => updateRole(user.id, "promote")}/>;
        } else if (member.role === "team_lead") {
            return <MemberDemoteAction clickFunction={() => updateRole(user.id, "demote")}/>;
        }
    }

    function changeManagerIcon(user) {
        function changeManager(id) {
            updateUserRole(context.currentProject.id, id, "project_manager")
                .then(body => {
                    if (body === undefined) {
                        callback();
                    }
                });
        }
        return <MemberPromoteManager clickFunction={() => changeManager(user.id)}/>;
    }

    // Kullanıcı için yapılabilecek aksiyon butonlarını döndürür.
    function actionComponents(member) {
        if (member.role === "project_manager") {
            return <div className={"action-container"}>
                {deleteUserIcon(member.assignedUser)}
            </div>
        } else {
            return <div className={"action-container"}>
                {updateRoleIcon(member)}
                {deleteUserIcon(member.assignedUser)}
                {changeManagerIcon(member.assignedUser)}
            </div>
        }
    }

    // Kullanıcı rolünü belirten yazıyı döndürür.
    function roleContainer(role) {
        if (role === "project_manager") {
            return <span className="rounded role-style project-manager-bg">Project Manager</span>
        } else if (role === "team_lead") {
            return <span className="rounded role-style team-lead-bg">Team Lead</span>;
        } else if (role === "team_member") {
            return <span className="rounded role-style member-bg">Member</span>;
        }
    }

    const head = [new HeadItem("Full Name", {width: "35%"}),
        new HeadItem("E-mail", {width: "25%"}),
        new HeadItem("Role", {width: "20%"}),
        new HeadItem("Actions", {width: "20%"})]

    const column = [
        new ColumnItem(
            (member) => (
                <div className={"d-flex flex-row align-items-center"} style={{marginLeft: "10%"}}>
                    {avatarIcons([member.assignedUser])}
                    <div style={{marginLeft: "10px"}}>
                        {computeFullName(member.assignedUser.firstName, member.assignedUser.surname)}
                    </div>
                </div>
            ),
            {width: "35%"}
        ),
        new ColumnItem(
            (member) => (
                <div className={"d-flex justify-content-center"}>
                    <OverflowedText>{member.assignedUser.mail}</OverflowedText>
                </div>
            ),
            {width: "25%"}
        ),
        new ColumnItem(
            (member) => (
                <div className={"d-flex justify-content-center"} style={{maxWidth: "100%"}}>
                    {roleContainer(member.role)}
                </div>
            ),
            {width: "20%"}
        ),
        new ColumnItem(
            (member) => actionComponents(member),
            {width: "20%"}
        )];

    return <TableList head={head} column={column} items={members} headStyle={{backgroundColor: "transparent"}}/>
}

