import React, {useState} from "react";
import {updateSprint} from "../../../../utils/Requests";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import CustomDropdownButton from "../../../Dropdown/CustomDropdownButton";
import {VerticalCenteredModal} from "../../../modal/CustomModal";
import {sprintStatusMapper} from "../../../../utils/ValueMapper";
import CustomDatePicker from "../../../DatePicker/CustomDatePicker";

// Sprint'in editlenebildiği modal bileşenidir.
export function SprintEditModal({sprint, callback}) {
    const [formIsOpen, setFromIsOpen] = useState(false);
    const [name, setName] = useState(sprint.name);
    const [status, setStatus] = useState(sprint.status);
    const [startDate, setStartDate] = useState(sprint.startDate);
    const [endDate, setEndDate] = useState(sprint.endDate);

    function update() {
        // TODO validation yap
        updateSprint(sprint.id, name, startDate, endDate,status)
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
                <div className="mb-5 d-flex flex-column">
                    <label className="mb-2" htmlFor="name" style={{color: "#343434"}}>Sprint name:</label>
                    <input id="name" type="text" className="form-control form-control-sm" value={name}
                           onChange={(e) => setName(e.target.value)} autoComplete={"off"}/>
                </div>
                <div className={"d-flex flex-row mb-5 align-items-center justify-content-between"}
                     style={{height: "30px"}}>
                    <CustomDatePicker label={"Start Date"} value={startDate} setValue={setStartDate}/>
                    <CustomDatePicker label={"Finish Date"} value={endDate} setValue={setEndDate}/>
                    <CustomDropdownButton value={status} setValue={setStatus} mapper={sprintStatusMapper}
                                          style={{width: "150px", height: "38px"}}/>
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