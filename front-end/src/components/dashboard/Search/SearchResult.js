import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faListCheck,
    faUserGroup,
    faDiagramProject,
    faAnglesLeft,
    faAnglesRight
} from "@fortawesome/free-solid-svg-icons";
import '../ProjectsScreen/project.css';
import "./searchResult.css";
import {useParams} from "react-router-dom";
import ProjectListItem from "./ProjectListItem";
import Loading from "../../loading/Loading";
import TaskListItem from "./TaskListItem";
import UserListItem from "./UserListItem";
import {searchProject, searchTask, searchUser} from "../../../utils/Requests";

export default function SearchResult() {
    const [activeTab, setActiveTab] = useState("projects");
    const [sendFlag, setSendFlag] = useState(true);
    const [projectResult, setProjectResult] = useState([]);
    const [projectPage, setProjectPage] = useState(0);
    const [taskResult, setTaskResult] = useState([]);
    const [taskPage, setTaskPage] = useState(0);
    const [userResult, setUserResult] = useState([]);
    const [userPage, setUserPage] = useState(0);
    const params = useParams();
    let projectListItems;
    let taskListItems;
    let userListItems;

    if (sendFlag) {
        searchNewProjectPage(projectPage);
        searchNewTaskPage(taskPage);
        searchNewUserPage(userPage);
        setSendFlag(false);
    }

    function searchNewProjectPage(page) {
        searchProject(params.value, page)
            .then(body => setProjectResult(projectResult => [...projectResult, body]))
    }

    function searchNewTaskPage(page) {
        searchTask(params.value, page)
            .then(body => setTaskResult(taskResult => [...taskResult, body]))
    }

    function searchNewUserPage(page) {
        searchUser(params.value, page)
            .then(body => setUserResult(userResult => [...userResult, body]))
    }

    if (projectResult === null || taskResult === null || userResult === null) {
        return <Loading/>
    } else {
        // Back butonunun gösterilmesini kontrol et
        function returnButton(contentType) {
            if (contentType === "project") {
                if (projectPage === 0) {
                    return <div style={{width: "25px"}}/>;
                } else {
                    return <div onClick={() => setProjectPage(projectPage - 1)}><FontAwesomeIcon icon={faAnglesLeft}/></div>;
                }
            } else if (contentType === "task") {
                if (taskPage === 0) {
                    return <div style={{width: "25px"}}/>;
                } else {
                    return <div onClick={() => setTaskPage(taskPage - 1)}><FontAwesomeIcon icon={faAnglesLeft}/></div>;
                }
            } else if (contentType === "user") {
                if (taskPage === 0) {
                    return <div style={{width: "25px"}}/>;
                } else {
                    return <div onClick={() => setUserPage(userPage - 1)}><FontAwesomeIcon icon={faAnglesLeft}/></div>;
                }
            }
        }

        // Next butonunun gösterilmesini kontrol et
        function nextButton(contentType) {
            if (contentType === "project" && projectResult[projectPage]) {
                if (projectResult[projectPage].length !== 10) {
                    return <div style={{width: "25px"}}></div>
                } else {
                    return <div onClick={() => {
                        setProjectPage(projectPage + 1);
                        if (!projectResult[projectPage + 1]) {
                            searchNewProjectPage(projectPage + 1)
                        }
                    }}><FontAwesomeIcon icon={faAnglesRight}/></div>;
                }
            } else if (contentType === "task" && taskResult[taskPage]) {
                if (taskResult[taskPage].length !== 10) {
                    return <div style={{width: "25px"}}></div>
                } else {
                    return <div onClick={() => {
                        setTaskPage(taskPage + 1);
                        if (!taskResult[taskPage + 1]) {
                            searchNewTaskPage(taskPage + 1)
                        }
                    }}><FontAwesomeIcon icon={faAnglesRight}/></div>;
                }
            } else if (contentType === "user" && userResult[userPage]) {
                if (userResult[userPage].length !== 10) {
                    return <div style={{width: "25px"}}></div>
                } else {
                    return <div onClick={() => {
                        setUserPage(userPage + 1);
                        if (!userResult[userPage + 1]) {
                            searchNewTaskPage(userPage + 1)
                        }
                    }}><FontAwesomeIcon icon={faAnglesRight}/></div>;
                }
            }
        }

        // Listede gösterilcek itemleri hazırlar
        if (projectResult && projectResult[projectPage]) {
            projectListItems = projectResult[projectPage].map((project) => {
                return <ProjectListItem project={project} key={project.id}/>;
            });
        }

        if (taskResult && taskResult[taskPage]) {
            taskListItems = taskResult[taskPage].map((task) => {
                return <TaskListItem task={task} key={task.id}/>;
            });
        }

        if (userResult && userResult[userPage]) {
            userListItems = userResult[userPage].map((user) => {
                return <UserListItem user={user} key={user.id}/>;
            });
        }

        return (
            <div>
                <div className={"content"} style={{maxHeight: "650px"}}>
                    <h1 className={"heading"}>Search Results</h1>
                    <div className={"container border rounded px-0 container-custom"}>
                        <div className={"tabs-container"}>
                            <ul className={"tabs-list"}>
                                <li className={"tabs-list-item"}>
                                    <div
                                        className={"tabs-list-item-container " + ((activeTab === "projects") ? "tabs-list-item-container-active" : "")}
                                        onClick={() => setActiveTab('projects')}>
                                        <FontAwesomeIcon icon={faDiagramProject}
                                                         className={"icon"}></FontAwesomeIcon> Projects
                                    </div>
                                </li>
                                <li className={"tabs-list-item"}>
                                    <div
                                        className={"tabs-list-item-container " + ((activeTab === "users") ? "tabs-list-item-container-active" : "")}
                                        onClick={() => setActiveTab('users')}>
                                        <FontAwesomeIcon icon={faUserGroup}
                                                         className={"icon"}></FontAwesomeIcon> Users
                                    </div>
                                </li>
                                <li className={"tabs-list-item"}>
                                    <div
                                        className={"tabs-list-item-container " + ((activeTab === "tasks") ? "tabs-list-item-container-active" : "")}
                                        onClick={() => setActiveTab('tasks')}>
                                        <FontAwesomeIcon icon={faListCheck}
                                                         className={"icon"}></FontAwesomeIcon> Tasks
                                    </div>
                                </li>
                            </ul>
                            <div className={"tabs-content" + ((activeTab === "projects") ? "tabs-content-active" : "")}>
                                <div className={"row gy-3"}>
                                    {projectListItems}
                                </div>
                                <div className={"d-flex flex-row justify-content-center"}>
                                    {returnButton("project")}
                                    <span style={{width: "50px", textAlign: "center"}}>{projectPage + 1}</span>
                                    {nextButton("project")}
                                </div>
                            </div>
                            <div className={"tabs-content" + ((activeTab === "users") ? "tabs-content-active" : "")}>
                                <div className={"row gy-3"}>
                                    {userListItems}
                                </div>
                                <div className={"d-flex flex-row justify-content-center"}>
                                    {returnButton("user")}
                                    <span style={{width: "50px", textAlign: "center"}}>{userPage + 1}</span>
                                    {nextButton("user")}
                                </div>
                            </div>
                            <div className={"tabs-content" + ((activeTab === "tasks") ? "tabs-content-active" : "")}>
                                <div className={"row gy-3"}>
                                    {taskListItems}
                                </div>
                                <div className={"d-flex flex-row justify-content-center"}>
                                    {returnButton("task")}
                                    <span style={{width: "50px", textAlign: "center"}}>{taskPage + 1}</span>
                                    {nextButton("task")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
