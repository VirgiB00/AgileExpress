import React, {useState} from 'react'
import "bootstrap/dist/css/bootstrap.css";
import Search from './Search.js';
import BrandName from './BrandName.js';
import NavBarMenuItem from './NavBarMenuItem.js';
import Notification from "./Notification";
import {useNavigate} from "react-router-dom";
import FetchInit from "../../utils/FetchInit";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamation} from "@fortawesome/free-solid-svg-icons";
import "./navbar.css";


export default function NavBar({loggedUser, adminMod = false}) {
    const [invitation, setInvitation] = useState([]);
    const [sendFlag, setSendFlag] = useState(true);
    const navigate = useNavigate();

    function logOut() {
        localStorage.clear();
        navigate("/login");
    }

    // Kullanıcıya gönderilmiş davetleri edinir.
    if (loggedUser !== null && sendFlag && !adminMod) {
        fetch("/api/project/invitation/get?userId=" + loggedUser.id, FetchInit("get"))
            .then((response) => {
                if (response.status === 200) {
                    response.json()
                        .then((body) => {
                            setInvitation(body);
                        })
                } else if (response.status === 204) {
                    return;
                } else {
                    navigate("/login");
                }
            });
        setSendFlag(false);
    }

    // Davetler listesindeki itemleri hazırlar.
    const invitationListItems = invitation?.map(function (item, i) {
        return <div key={i}><Notification invitation={item}/></div>
    })

    // Eğer davet varsa bildirim rozeti görünür.
    const showBadge = () => {
        if (invitation.length !== 0) {
            return "badge-custom d-flex";
        } else {
            return "d-none";
        }
    }

    return (
        <nav className="navbar shadow" style={{backgroundColor: "#161B22"}}>
            <div className="container-fluid justify-content-start">
                <div className="d-flex flex-fill">
                    <BrandName/>
                    <ul className="mb-0 d-flex align-items-center ps-3" style={{listStyleType: "none"}}>
                        <li>
                            <NavBarMenuItem itemName="Dashboard" link="/dashboard/projects"/>
                        </li>
                    </ul>
                </div>
                <div className='d-flex'>
                    <Search/>
                    <div className='ms-4 me-2 dropdown-container'>
                        <div className="d-flex text-white" data-bs-toggle="dropdown" aria-expanded="false">
                            <span className={"avatar-custom"}>
                                {loggedUser.firstName.charAt(0) + loggedUser.surname.charAt(0)}
                            </span>
                        </div>
                        <span className={"bg-danger " + showBadge()}>
                            <FontAwesomeIcon icon={faExclamation} style={{color: "#FFFFFF", fontSize: "11px"}}/>
                        </span>
                        <ul className="dropdown-menu dropdown-custom">
                            <li>
                                <button className="dropdown-item" onClick={logOut}>Log out</button>
                            </li>
                            <ul className={"p-0"} style={{maxHeight: "400px", overflowY: "auto"}}>
                                {invitationListItems}
                            </ul>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}