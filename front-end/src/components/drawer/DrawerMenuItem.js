import React from 'react'
import {useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function DrawerMenuItem({name, icon, link}) {
    let navigate = useNavigate();
    return (
        <div>
            <ul className="list-group list-group-horizontal border-bottom border-top rounded-0 menu-item" onClick={() => {navigate(link)}}>
                <li className="list-group-item d-flex justify-content-center align-items-center bg-transparent border-0 icon-container"><FontAwesomeIcon icon={icon}/></li>
                <li className="list-group-item bg-transparent border-0 flex-fill align-self-center">{name}</li>
            </ul>
        </div>
    );
}