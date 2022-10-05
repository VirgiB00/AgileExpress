import React, {useState} from "react";
import {ConfirmModal} from "../modal/CustomModal";

export function DeleteButton({handleDelete}) {
    const [show, setShow] = useState(false);

    const body = (
        <div className={"text-center"}>
            You can not revoke this action. Do you wish to continue?
        </div>
    )

    const footer = (
        <div className={"d-flex flex-row justify-content-around w-100"}>
            <button className={"btn btn-secondary"} onClick={() => setShow(false)}>No</button>
            <button className={"btn btn-danger"} onClick={handleDelete}>Yes</button>
        </div>
    )

    return (
        <>
            <ConfirmModal modalShow={show} setModalShow={setShow} body={body} footer={footer}/>
            <button className={"bg-danger rounded text-white border-danger"} style={{height: "38px"}}
                    onClick={() => setShow(true)}>Discard
            </button>
        </>
    )
}