import React, {useEffect, useState} from "react";
import OverflowedText from "./OverflowedText";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";

// Çift tıklandığında veya kalem butonuna tıklandığında değiştirilebilen text bileşenidir.
export default function InputToSpanSwitchText({field, setField, textStyles, textArea = false}) {
    const [toInput, setToInput] = useState(false);

    useEffect(() => {
        if (toInput) {
            document.getElementById("inp").focus();
        }
    });

    const inputComponent = () => {
        if (textArea) {
            return <textarea className="bg-white d-flex flex-fill" type="text" id="inp"
                          style={{border: 0, borderWidth: "0px", height: "200px", ...textStyles}}
                          value={field} autoComplete={"off"}
                          onChange={(e) => setField(e.target.value)} onBlur={() => setToInput(false)}/>
        } else {
            return <input className="bg-white d-flex flex-fill" type="text" id="inp"
                          style={{border: 0, borderWidth: "0px", ...textStyles}}
                          value={field} autoComplete={"off"}
                          onChange={(e) => setField(e.target.value)} onBlur={() => setToInput(false)}/>
        }
    }
    if (toInput) {
        return (
            <div className={"d-flex flex-row"} style={{height: "30px"}}>
                <div className={"border-bottom"} style={{color: "#F2F2F2", marginRight: "10px"}}>
                    <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                </div>
                {inputComponent()}
            </div>
        )
    } else {
        return (
            <div className={"d-flex flex-row"} style={{height: "30px"}}
                 onDoubleClick={() => setToInput(true)}>
                <div className={"border-bottom"} style={{color: "#E0E0E0", marginRight: "10px"}} onClick={() => {
                    setToInput(true)
                }}>
                    <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                </div>
                <div className={"d-flex align-self-center flex-fill"} style={{marginLeft: "2px", ...textStyles}}>
                    <OverflowedText customStyle={{width: "100%"}}>
                        {field}
                    </OverflowedText>
                </div>
            </div>
        )
    }
}