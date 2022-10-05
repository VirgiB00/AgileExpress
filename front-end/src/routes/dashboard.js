import React from 'react'
import NavBar from '../components/navbar/NavBar'
import {Outlet} from "react-router-dom";
import getUserFromJwt from "../utils/GetUserFromJwt";
import {useState} from "react";
import Loading from "../components/loading/Loading";
import {getUserDetailByUsername} from "../utils/Requests";

export default function Dashboard() {
    const [sendFlag, setSendFlag] = useState(true);
    const [loggedUser, setLoggedUser] = useState(null);
    const [adminMod, setAdminMod] = useState(false);
    // Kullanıcının sayfada görüntülediği projeyi tutar.
    const [currentProject, setCurrentProject] = useState(null);
    const [currentSprint, setCurrentSprint] = useState(null);
    const [userRoleOnProject, setUserRoleOnProject] = useState(null);


    if (sendFlag) {
        const user = getUserFromJwt();
        getUserDetailByUsername(user.sub)
            .then(body => {
                setLoggedUser(body);
                if (body.userName === "admin") {
                    setAdminMod(true);
                }
            });
        setSendFlag(false);
    }

    if (loggedUser === null) {
        return <Loading/>
    } else {
        return (
            <>
                <NavBar loggedUser={loggedUser} adminMod={loggedUser.name === "admin"}/>
                <Outlet context={{
                    loggedUser: loggedUser,
                    currentProject: currentProject,
                    setCurrentProject: setCurrentProject,
                    adminMod: adminMod,
                    currentSprint: currentSprint,
                    setCurrentSprint: setCurrentSprint,
                    userRoleOnProject: userRoleOnProject,
                    setUserRoleOnProject: setUserRoleOnProject
                }}/>
            </>
        );
    }
}
