import React, {useState} from "react";
import {SprintTaskList} from "../Task/TaskList";
import BurndownChart from "./BurndownChart";
import {dateParser} from "../../../../utils/DateUtils";
import {SlideInContainer} from "../../../slideInContainer/slideInContainer";
import {sprintStatusMapper} from "../../../../utils/ValueMapper";
import {SprintEditModal} from "./SprintEditModal";
import {useOutletContext, useParams} from "react-router-dom";
import {SprintDeleteButton} from "./SprintDeleteButton";
import {getSprintWithTasks} from "../../../../utils/Requests";
import Loading from "../../../loading/Loading";

export default function SprintDetail() {
    const context = useOutletContext();
    const [sprint, setSprint] = useState(null);
    const [sendFlag, setSendFlag] = useState(true);

    const params = useParams();

    // Sprint bilgisini edin.
    if (sendFlag) {
        getSprintWithTasks(params.itemId)
            .then(body => {
                if (!Array.isArray(body)) {
                    setSprint(body);
                }
            });
        setSendFlag(false);
    }

    if (sprint === null) {
        return <Loading/>;
    } else {
        function statusButton() {
            const maps = sprintStatusMapper.map(sprint.status);
            return (
                <div className={"rounded text-white d-flex align-items-center " + maps.style} style={{height: "30px"}}>
                    <span className={"mx-2"} style={{fontSize: "14px"}}>{maps.text}</span>
                </div>
            )
        }

        // Detaylarda gösterilecek tarih bilgisini bileşenini döndürür.
        const sprintDates = (
            <div className={"d-flex flex-row"} style={{fontSize: "0.9rem"}}>
                <div className={"d-flex flex-column me-2"}>
                    <span>Start date:</span>
                    <span>Due date:</span>
                </div>
                <div className={"d-flex flex-column"}>
                    <span>{dateParser(sprint.startDate)}</span>
                    <span>{dateParser(sprint.endDate)}</span>
                </div>
            </div>
        )

        // Eğer kullanıcı takım üyesi statüsünden farklı bir statüye sahipse kullanıcı atama ve edit butonlarını döndürür.
        function nonMemberActions() {
            if (context.userRoleOnProject === "team_member") {
                return <></>;
            } else {
                return (
                    <>
                        <div className={"ms-2 me-3"}><SprintEditModal sprint={sprint} callback={() => setSendFlag(true)}/></div>
                        <SprintDeleteButton sprint={sprint}/>
                    </>
                )
            }
        }

        return (
            <div className={"rounded border"}>
                <div className={"d-flex flex-row m-4"} style={{height: "70vh"}}>
                    <div className={"d-flex flex-column me-4 mt-3"} style={{width: "100%"}}>
                        <div className={"d-flex flex-row border-bottom mb-3"}>
                            <span className={"flex-fill"} style={{fontSize: "30px", marginLeft: "10px"}}>{sprint.name}</span>
                            {nonMemberActions()}
                        </div>
                        <div className={"d-flex flex-row rounded bg-light border mb-4"} style={{height: "600px"}}>
                            <div className={"d-flex flex-fill flex-column mx-4 mt-3"}>
                                <BurndownChart sprint={sprint}/>
                            </div>
                        </div>
                        <SprintTaskList sprint={sprint}/>
                    </div>
                    <div className={"border-start ps-2"} style={{width: "250px"}}>
                        <div className={"d-flex flex-row align-items-c mb-3 justify-content-between"}>
                            <div className={"d-flex flex-row align-items-center"}>
                                <span className={"me-2"} style={{marginLeft: "24px"}}>Status:</span>
                                {statusButton()}
                            </div>
                        </div>
                        <div className={"mt-4"}>
                            <SlideInContainer title={"Dates"}>{sprintDates}</SlideInContainer>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}