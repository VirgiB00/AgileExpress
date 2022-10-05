import React from "react";
import {SlideInContainer} from "../../../slideInContainer/slideInContainer";
import MemberInfo from "../Members/MemberListItem/MemberInfo";
import {AssignUserToTaskModal} from "./AssignUserToTaskModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {TaskEditModal} from "./TaskEditModal";
import {TaskDeleteButton} from "./TaskDeleteButton";
import {computeFullNameAndFirstLetters} from "../../../../utils/TextFunction";
import {dateParserFull} from "../../../../utils/DateUtils";
import {taskStatusMapper} from "../../../../utils/ValueMapper";
import {useOutletContext} from "react-router-dom";

export default function TaskDetail({task, callback}) {
    const context = useOutletContext();

    function statusButton() {
        const maps = taskStatusMapper.map(task.status);
        return (
            <div className={"rounded text-white d-flex align-items-center " + maps.style} style={{height: "30px"}}>
                <span className={"mx-2"} style={{fontSize: "14px"}}>{maps.text}</span>
            </div>
        )
    }

    // Task'a tanmış kullanıcıların listesini döndürür.
    function taskMembers() {
        if (task.assignments.length === 0) {
            return (
                <span className={"text-center my-2"} style={{fontSize: "15px"}}>
                    There is no assigned member to this task
                </span>
            )
        } else {
            return task.assignments?.map(function (member, i) {
                const temp = computeFullNameAndFirstLetters(member.user);
                return (
                    <div className={"mt-2"} key={i}>
                        <MemberInfo  firstLetters={temp.firstLetters} fullName={temp.fullName}
                                    email={member.user.mail} style={{fontSize: "0.9rem"}}/>
                    </div>
                )
            })
        }
    }

    // Detaylarda gösterilecek tarih bilgisini bileşenini döndürür.
    function taskDates() {
        return (
            <div className={"d-flex flex-row"} style={{fontSize: "0.9rem"}}>
                <div className={"d-flex flex-column me-2"}>
                    <span>Created at:</span>
                    <span>Started at:</span>
                    <span>Duration:</span>
                </div>
                <div className={"d-flex flex-column"}>
                    <span>{dateParserFull(task.creationDate)}</span>
                    <span>{dateParserFull(task.startDate)}</span>
                    <span>{task.duration} day(s)</span>
                </div>
            </div>
        )
    }

    // Eğer kullanıcı takım üyesi statüsünden farklı bir statüye sahipse kullanıcı atama ve edit butonlarını döndürür.
    function nonMemberActions() {
        if (context.userRoleOnProject === "team_member") {
            return <></>;
        } else {
            return (
                <>
                    <AssignUserToTaskModal task={task} callback={callback}/>
                    <div className={"ms-2"}><TaskEditModal task={task} callback={callback}/></div>
                    <div className={"ms-2"}><TaskDeleteButton task={task}/></div>
                </>
            )
        }
    }

    return (
        <div className={"d-flex flex-row m-4"}>
            <div className={"d-flex flex-column me-4 mt-3"} style={{height: "300px", width: "100%"}}>
                <div className={"d-flex flex-row border-bottom mb-3"}>
                    <span className={"flex-fill"} style={{fontSize: "30px", marginLeft: "10px"}}>{task.name}</span>
                    {nonMemberActions()}
                </div>
                <SlideInContainer title={"Description"}>
                    <p className="text-break">{task.description}</p>
                </SlideInContainer>
                <SlideInContainer title={"Activity"}>
                    <></>
                </SlideInContainer>
            </div>
            <div className={"border-start ps-2"}>
                <div className={"d-flex flex-row align-items-c mb-3 justify-content-between"}>
                    <div className={"d-flex flex-row"}>
                        <span className={"me-2"} style={{marginLeft: "24px"}}>Status:</span>
                        {statusButton()}
                    </div>
                    <div className={"rounded bg-danger text-white d-flex align-items-center px-2"}>
                        {task.storyPoint}
                        <FontAwesomeIcon icon={faStar} style={{marginLeft: "5px"}}/>
                    </div>
                </div>
                <SlideInContainer title={"People"}>{taskMembers()}</SlideInContainer>
                <div className={"mt-4"}>
                    <SlideInContainer title={"Dates"}>{taskDates()}</SlideInContainer>
                </div>
            </div>
        </div>
    )
}