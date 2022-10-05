import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";

export function SlideInContainer({title, style, children}) {
    const [open, setOpen] = useState(true);

    function handleClick() {
        setOpen(!open);
    }

    return (
        <div className={"d-flex flex-row"}>
            <div className={"d-flex align-items-start"}>
                <button style={{border: "none", background: "transparent"}} onClick={handleClick}>
                    <FontAwesomeIcon icon={faArrowDown}/>
                </button>
            </div>
            <div>
                <button style={{border: "none", background: "transparent", paddingLeft: "0px", fontWeight: "bold", ...style}} onClick={handleClick}>{title}</button>
                <div style={{height: open ? "calc(100% - 0px)" : "0px", transition: "height .4s ease-in-out", overflow: "hidden"}}>
                    {children}
                </div>
            </div>
        </div>
    )
}