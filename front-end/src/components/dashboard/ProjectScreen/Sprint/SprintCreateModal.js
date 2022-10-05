import React, {useState} from "react";
import {Button} from "react-bootstrap";
import CustomDatePicker from "../../../DatePicker/CustomDatePicker";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {createSprint} from "../../../../utils/Requests";
import {useOutletContext} from "react-router-dom";
import {VerticalCenteredModal} from "../../../modal/CustomModal";

export default function SprintCreateModal({callBack}) {
    const context = useOutletContext();
    const [sprintName, setSprintName] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handleCreate() {
        createSprint(context.currentProject.id, sprintName, startDate, endDate)
            .then(body => {
                if (body === "success") {
                    handleClose();
                    callBack();
                }
            })
    }

    const body = (
        <>
            <div className="mb-3 d-flex flex-column mb-5">
                <label className="mb-2" htmlFor="name" style={{color: "#343434"}}>Sprint name:</label>
                <input id="name" type="text" className="form-control form-control-sm" value={sprintName}
                       onChange={(e) => setSprintName(e.target.value)} autoComplete={"off"}/>
            </div>
            <div className={"d-flex flex-row justify-content-around"}>
                <div className={"me-5"}>
                    <CustomDatePicker value={startDate} setValue={setStartDate} label={"Start Date"} disabledPast={true}/>
                </div>
                <CustomDatePicker value={endDate} setValue={setEndDate} label={"Finish Date"} disabledPast={true}/>
            </div>
        </>
    )

    const footer = (
        <>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={handleCreate}>Create</Button>
        </>
    )

    return (
        <>
            <button type="button" className="btn btn-dark rounded-4 mb-3" onClick={handleShow}>
                <span className={"me-2"}>New Sprint</span>
                <FontAwesomeIcon icon={faPlus}/>
            </button>
            <VerticalCenteredModal modalShow={show} setModalShow={setShow} body={body} footer={footer}/>
        </>
    );
}