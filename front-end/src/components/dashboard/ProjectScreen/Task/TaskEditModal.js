import React, {useState} from "react";
import {updateTask} from "../../../../utils/Requests";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import CustomDropdownButton from "../../../Dropdown/CustomDropdownButton";
import {VerticalCenteredModal} from "../../../modal/CustomModal";
import {storyPointMapper, taskStatusMapper} from "../../../../utils/ValueMapper";

// Task'ın editlenebildiği modal bileşenidir.
export function TaskEditModal({task, callback}) {
    const [formIsOpen, setFromIsOpen] = useState(false);
    const [name, setName] = useState(task.name);
    const [description, setDescription] = useState(task.description);
    const [status, setStatus] = useState(task.status);
    const [storyPoint, setStoryPoint] = useState(task.storyPoint);
    const [duration, setDuration] = useState(task.duration);

    function update() {
        // TODO validation yap
        updateTask(task.id, name, description, status, storyPoint, duration)
            .then(body => {
                if (body === undefined) {
                    callback();
                    setFromIsOpen(false);
                }
            });
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
                    <label className="mb-2" htmlFor="desc" style={{color: "#343434"}}>Task description:</label>
                    <textarea id="desc" className="form-control form-control-sm" value={description}
                              style={{height: "150px"}} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <div className={"d-flex flex-row mb-5 align-items-center justify-content-around"}
                     style={{height: "30px"}}>
                    <div>
                        <span className={"me-2"}>Duration:</span>
                        <input type={"number"} value={duration} onChange={(e) => setDuration(e.target.value)}
                               min={"1"}/>
                    </div>
                    <div>
                        <span className={"me-2"}>Story Point: </span>
                        <CustomDropdownButton value={storyPoint} setValue={setStoryPoint} mapper={storyPointMapper}
                                              style={{width: "50px", height: "30px"}}/>
                    </div>
                    <CustomDropdownButton value={status} setValue={setStatus} mapper={taskStatusMapper}
                                          style={{width: "150px", height: "30px"}}/>
                </div>
                <button className={"btn btn-success align-self-center"} style={{width: "150px"}} onClick={update}>
                    UPDATE
                </button>
            </div>
        </>
    );

    return (
        <>
            <VerticalCenteredModal modalShow={formIsOpen} setModalShow={setFromIsOpen} body={body}/>
            <button className={"rounded bg-warning border-warning text-white"} style={{height: "38px"}}
                    onClick={() => setFromIsOpen(true)}>Edit
            </button>
        </>
    )
}