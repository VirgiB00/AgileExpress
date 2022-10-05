import React, {useState} from 'react';
import Drawer, {DrawerItem} from '../../drawer/Drawer';
import "../ProjectsScreen/project.css";
import {faSquareCheck, faFileLines, faUsers, faListCheck} from '@fortawesome/free-solid-svg-icons';
import {useNavigate, useParams, useOutletContext} from "react-router-dom";
import SummaryScreen from "./Summary/SummaryScreen";
import SprintsScreen from "./Sprint/SprintsScreen";
import Task from "./Task/Task";
import MembersScreen from "./Members/MembersScreen";
import {BacklogTaskList, SprintTaskList} from "./Task/TaskList";
import {getProject, getProjectWithUserRole} from "../../../utils/Requests";
import SprintDetail from "./Sprint/SprintDetail";

export default function Project() {
    const context = useOutletContext();
    const [sendFlag, setSendFlag] = useState(true);
    const navigate = useNavigate();
    const params = useParams();

    let contentPage;

    // Bu sayfaya dashboard'dan girmemişse geri yolla.
    if (context.currentProject === null) {
        return navigate("/dashboard/projects");
    }

    if (sendFlag) {
        // Kullanıcı admin ise proje bilgisini getir ve rol olarak proje yöneticisi ata
        if (context.adminMod === true) {
            getProject(context.currentProject.id).then(body => {
                context.setUserRoleOnProject("project_manager");
            });
        }
        // Değilse proje bilgisini ve kullanıcının projedeki rolünü getirir
        else {
            getProjectWithUserRole(context.currentProject.id)
                .then(body => {
                    context.setUserRoleOnProject(body.role);
                });
        }
        setSendFlag(false);
    }

    if (params.action === "summary") {
        contentPage = <SummaryScreen callback={() => setSendFlag(true)}/>;
    } else if (params.action === "sprints") {
        contentPage = <SprintsScreen/>;
    } else if (params.action === "sprint") {
        contentPage = <SprintDetail/>;
    } else if (params.action === "tasks") {
        contentPage = <SprintTaskList/>
    } else if (params.action === "backlog") {
        contentPage = <BacklogTaskList/>;
    } else if (params.action === "task") {
        contentPage = <Task/>;
    } else if (params.action === "members") {
        contentPage = <MembersScreen/>;
    } else {
        contentPage = <SummaryScreen/>;
    }

    const drawerItems = [
        new DrawerItem("Summary", faFileLines, params.projectLinkName + "/summary"),
        new DrawerItem("Sprints", faSquareCheck, params.projectLinkName + "/sprints"),
        new DrawerItem("Tasks", faListCheck, params.projectLinkName + "/tasks"),
        new DrawerItem("Backlog", faListCheck, params.projectLinkName + "/backlog"),
        new DrawerItem("Members", faUsers, params.projectLinkName + "/members")
    ];

    return (
        <div>
            <div className='d-flex'>
                <Drawer drawerItems={drawerItems}/>
                <div className="content" style={{maxHeight: "650px"}}>
                    {contentPage}
                </div>
            </div>
        </div>
    )
}