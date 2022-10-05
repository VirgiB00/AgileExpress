import React, {useState} from 'react';
import "../../ProjectsScreen/project.css";
import TaskCreateModal from "./TaskCreateModal";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import Loading from "../../../loading/Loading";
import {getActiveSprintTasks, getBacklogTasks, getSprintTasks} from "../../../../utils/Requests";
import {avatarIcons, TaskCompletedListItem, TaskInProgressListItem, TaskPassiveListItem} from "./TaskListItem";
import {ColumnItem, HeadItem, TableList} from "../../../list/tableList";
import OverflowedText from "../../../text/OverflowedText";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import PlainList from "../../../list/plainList";
import {compareByCompletionDate, compareByRemainingDuration, compareByTaskName} from "../../../../utils/Comparators";

export function BacklogTaskList() {
    const context = useOutletContext();
    const [tasks, setTasks] = useState(null);
    const [sendFlag, setSendFlag] = useState(true);
    const navigate = useNavigate();
    const params = useParams();

    if (sendFlag && context.currentProject !== null) {
        // Backlog tasklarını setle
        getBacklogTasks(context.currentProject.id)
            .then(body => {
                setTasks(body);
            });
        setSendFlag(false);
    }

    // Tıklandığında yönlendiren fonksiyondur.
    function navigateToTaskDetail(id) {
        navigate("/dashboard/project/" + params.projectLinkName + "/task/"+id);
    }

    // Listenin başlığında yer alacak sütunları belirtir.
    const head = [
        new HeadItem("Name", {width: "20%"}),
        new HeadItem("Description", {width: "40%"}),
        new HeadItem("Duration", {width: "10%"}),
        new HeadItem("Story Point", {width: "10%"}),
        new HeadItem("Assigned Members", {width: "20%"})
    ]

    // Listenin satırlarında yer sutünları belirtir.
    const column = [
        new ColumnItem(
            (task) =>   <div onClick={() => navigateToTaskDetail(task.id)}><OverflowedText>{task.name}</OverflowedText></div>,
            {width: "20%", cursor: "pointer"}
        ),
        new ColumnItem(
            (task) => <div onClick={() => navigateToTaskDetail(task.id)}><OverflowedText>{task.description}</OverflowedText></div>,
            {width: "40%", cursor: "pointer", paddingLeft: "8px"}
        ),
        new ColumnItem(
            (task) => task.duration,
            {width: "10%"}
        ),
        new ColumnItem(
            (task) => (
                <div className={"rounded bg-danger text-white px-2 py-1"}>
                    {task.storyPoint}
                    <FontAwesomeIcon icon={faStar} style={{marginLeft: "5px"}}/>
                </div>
            ),
            {width: "10%", display: "flex", justifyContent: "center"}
        ),
        new ColumnItem(
            (task) => {
                const members = [];
                task.assignments.forEach(assignment => members.push(assignment.user));
                return avatarIcons(members);
            },
            {width: "20%", display: "flex", flexDirection: "row !important", justifyContent: "center"}
        )
    ];

    if (tasks === null) {
        return <></>
    } else {
        return (
            <div className={"rounded shadow-sm p-3 w-100"}>
                <TaskCreateModal heightValue={"400px"} callback={() => setSendFlag(true)}/>
                <div className={"d-flex bg-light"} style={{height: "65vh"}}>
                    <TableList items={tasks} head={head} column={column} headStyle={{fontWeight: "600"}}/>
                </div>
            </div>
        )
    }
}

export function SprintTaskList({sprint = null}) {
    const context = useOutletContext();
    const [activeTasks, setActiveTasks] = useState(null);
    const [sendFlag, setSendFlag] = useState(true);

    const defaultActiveTasks = {
        done: [],
        wip : [],
        passive: []
    };

    if (sendFlag && context.currentProject !== null) {
        // Sprint verilmemişse aktif sprintteki taskları döndürür.
        if (sprint === null) {
            getActiveSprintTasks(context.currentProject.id)
                .then(body => {
                    console.log(body)
                    setActiveTasks(filterTasks(body));
                });
        }
        // Verilen sprint'in tasklarını döndürür.
        else {
            getSprintTasks(sprint.id)
                .then(body => {
                    setActiveTasks(filterTasks(body));
                })
        }
        setSendFlag(false);
    }

    // Backlog'a ait olmayan taskları statülerine göre gruplandırır.
    function filterTasks(tasks) {
        const obj = defaultActiveTasks;

        tasks.forEach((task) => {
            if (task.status === "done") {
                obj.done.push(task);
            } else if (task.status === "wip") {
                obj.wip.push(task);
            } else if (task.status === "passive") {
                obj.passive.push(task);
            }
        });

        obj.passive.sort(compareByTaskName);
        obj.wip.sort(compareByRemainingDuration);
        obj.done.sort(compareByCompletionDate);
        return obj;
    }

    if (activeTasks === null) {
        return <Loading/>
    }  else {
        return (
            <div className={"d-flex border rounded pb-5"} style={{height: "95%"}}>
                <div style={{width: "33%"}}>
                    <PlainList listName={"TO-DO"} items={activeTasks.passive} listItem={(task) => <TaskPassiveListItem task={task}/>}/>
                </div>
                <div style={{width: "33%"}}>
                    <PlainList listName={"IN-PROGRESS"} items={activeTasks.wip} listItem={(task) => <TaskInProgressListItem task={task}/>}/>
                </div>
                <div style={{width: "33%"}}>
                    <PlainList listName={"COMPLETED"} items={activeTasks.done} listItem={(task) => <TaskCompletedListItem task={task}/>}/>
                </div>
            </div>
        )
    }
}