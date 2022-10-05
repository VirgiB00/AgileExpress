import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {requestBodyValues} from "../../../../utils/FetchInit";
import {useOutletContext} from "react-router-dom";
import CustomDropdownButton from "../../../Dropdown/CustomDropdownButton";
import {createTask} from "../../../../utils/Requests";
import {VerticalCenteredModal} from "../../../modal/CustomModal";
import {storyPointMapper} from "../../../../utils/ValueMapper";

export default function TaskCreateModal({callback}) {
    const context = useOutletContext();
    const [formIsOpen, setFromIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [storyPoint, setStoryPoint] = useState("1");
    const [duration, setDuration] = useState("1");

    // Yeni task oluşturur.
    function createNewTask() {
        //TODO validation yap
        if (name !== "" && description !== "") {
            createTask(context.currentProject.id, name, description, storyPoint, duration)
                .then(body => {
                    if (body === requestBodyValues.success) {
                        callback();
                        setFromIsOpen(false);
                    }
                });
        }
    }

    // Modal body'sini döndürür.
    const body = (
        <>
            <div className={"d-flex flex-row-reverse"}>
                <FontAwesomeIcon icon={faXmark} onClick={() => setFromIsOpen(false)} style={{height: "25px"}}/>
            </div>
            <div className={"d-flex flex-column mx-4"}>

                <div className="mb-3 d-flex flex-column">
                    <label className="mb-2" htmlFor="name" style={{color: "#343434"}}>Task name:</label>
                    <input id="name" type="text" className="form-control form-control-sm" value={name}
                           onChange={(e) => setName(e.target.value)} autoComplete={"off"}/>
                </div>
                <div className="mb-3 d-flex flex-column">
                    <label className="mb-2" htmlFor="desc" style={{color: "#343434"}}>Task
                        description:</label>
                    <textarea id="desc" className="form-control form-control-sm" value={description}
                              style={{height: "150px"}} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <div className={"d-flex flex-row mb-5"}>
                    <div className={"me-5"}>
                        <span className={"me-3"}>Duration:</span>
                        <input type={"number"} value={duration} onChange={(e) => setDuration(e.target.value)}
                               min={"1"}/>
                    </div>
                    <div className={"d-flex flex-row"} style={{height: "30px"}}>
                        <div className={"d-flex align-self-center me-3"}>
                            <span>Story Point: </span>
                        </div>
                        <CustomDropdownButton value={storyPoint} setValue={setStoryPoint} mapper={storyPointMapper}
                                              style={{height: "30px"}}/>
                    </div>
                </div>
                <button type="button" className="btn btn-success align-self-center"
                        style={{width: "150px"}} onClick={createNewTask}>
                    CREATE
                </button>
            </div>
        </>
    );

    return (
        <>
            <VerticalCenteredModal modalShow={formIsOpen} setModalShow={setFromIsOpen} body={body}/>
            <button type="button" className="btn btn-dark rounded-4 mb-3" onClick={() => setFromIsOpen(true)}>
                <span className={"me-2"}>NEW TASK</span>
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
            </button>
        </>
    )
}