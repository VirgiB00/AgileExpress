import React, {useState} from 'react'
import "./drawer.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import useLocalStorage from "../../utils/UseLocalStorage.js";
import DrawerMenuItem from './DrawerMenuItem.js';

export default function Drawer({drawerItems}) {
    const [drawerOpen, setDrawerOpenLocal] = useLocalStorage("drawerOpen", true);
    const [open, setOpen] = useState(drawerOpen);

    function handleDrawerOpen() {
        setDrawerOpenLocal(!open);
        setOpen(!open);
    }

    const drawerMenuItems =  drawerItems.map(function(item, i) {
        return <DrawerMenuItem key={i} name={item.label} icon={item.icon} link={item.link}/>
    })

    return (
        <div>
            <div className='d-flex flex-row'>
                <div id="drawer" className='d-block d-flex flex-column drawer' style={{width: open ? "250px" : "50px"}}>
                    <button className='bg-transparent align-self-end border-0 menu-button' onClick={handleDrawerOpen}>
                        <FontAwesomeIcon icon={faBars}/>
                    </button>
                    {drawerMenuItems}
                </div>
            </div>
        </div>
    ) 
}

export class DrawerItem{
    constructor(label, icon, link) {
        this.label = label;
        this.icon = icon;
        this.link = link;
    }
}