import "bootstrap/dist/css/bootstrap.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";

export default function Search({size = "medium"}) {
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    let sizeClassName = "";

    if (size === "large") {
        sizeClassName = "input-group-lg"
    } else if (size === "small") {
        sizeClassName = "input-group-sm"
    }

    function search() {
        if (value !== "") {
            console.log("search")
            navigate("/dashboard/search/" + value)
        }
    }

    return (
        <div className={"input-group w-auto " + sizeClassName}>
            <span className="input-group-text bg-light" id="basic-addon1" onClick={search}>
                <label htmlFor="searchButton"><FontAwesomeIcon icon={faMagnifyingGlass}/></label>
            </span>
            <input id="searchButton" type="text" className="form-control form-control-sm shadow-none"
                   style={{outline: "none!important"}} placeholder="Search"
                   onChange={(e) => setValue(e.target.value)}/>
        </div>
    );
}
