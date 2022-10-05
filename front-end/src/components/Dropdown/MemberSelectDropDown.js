import React from "react";

export default function MemberSelectDropDown({assignments, btnClick}) {

    const listItems = assignments?.map(function(val, i) {
        return <option key={i} value={val.id}>{val.assignedUser.mail}</option>
    })

    function getValue() {
        const selectComponent = document.getElementById("inputGroupSelect");
        btnClick(selectComponent.value);
    }

    return (
        <div className="input-group mb-3">
            <select className="form-select" id="inputGroupSelect">
                <option value={"choose"}>Choose...</option>
                {listItems}
            </select>
            <button className="btn btn-outline-secondary" type="button" onClick={getValue}>Assign Member</button>
        </div>
    )
}