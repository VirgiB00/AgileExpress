import React, {useEffect, useState} from 'react'
import ProjectList from './ProjectList'
import Summary from './Summary';
import Search from "../../navbar/Search.js"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faArrowDownWideShort} from '@fortawesome/free-solid-svg-icons'
import "./projectScreen.css";
import ProjectCreateForm from './ProjectCreateForm/ProjectCreateForm.js';
import Loading from "../../loading/Loading";
import {getAllProjects, getAssignedProjects} from "../../../utils/Requests";
import {useOutletContext} from "react-router-dom";

export default function ProjectScreen() {
    const context = useOutletContext();
    const [project, setProject] = useState(null);
    const [createProjectFormIsOpen, setOpen] = useState(false);
    const [sendFlag, setSendFlag] = useState(true);

    function handle() {
        setOpen(!createProjectFormIsOpen);
    }

    useEffect(() => {
        if (sendFlag) {
            if (context.adminMod) {
                getAllProjects()
                    .then(body => {
                        setProject(body);
                    })
            } else {
                getAssignedProjects()
                    .then(body => {
                        setProject(body);
                    })
            }
            setSendFlag(false);
        }
    }, [sendFlag, context.adminMod]);

    // Başlangıç durumunda spinner göster
    if (project === null) {
        return (
            <Loading/>
        )
        // Kullanıcının atanmış olduğu projesi yoksa karşılama proje oluştur karşılama ekranı gösterir.
    } else if (project.length === 0) {
        return (
            <div className='content d-flex flex-column'>
                <span style={{
                    fontSize: "1.5em",
                    marginLeft: "20px",
                    marginRight: "20px",
                    marginBottom: "40px",
                    marginTop: "20px"
                }}>
                    Welcome, it seems you are not involved in any project! You can create a new project or ask your manager to send an invitation.
                </span>
                <div className="mb-3">
                    <ProjectCreateForm heightValue={"300px"} callback={() => setSendFlag(true)}/>
                </div>

            </div>
        );
        // Kullanıcının atanmış olduğu projeleri varsa projelerin listesinin olduğu ekranı döndürür.
    } else {
        // TODO proje oluşturunca oluştruma sayfasını kapat
        return (
            <div className='content'>
                <div className="mb-3" style={{
                    transition: "all .4s ease-in-out",
                    height: createProjectFormIsOpen ? "350px" : "0",
                    overflow: "hidden"
                }}>
                    <ProjectCreateForm heightValue={"300px"} callback={() => setSendFlag(true)}/>
                </div>
                <div style={{color: "#343434", fontWeight: "bolder", fontSize: "1.5em", marginLeft: "10px"}}>
                    PROJECTS
                </div>
                <div className='input-group' style={{height: "500px"}}>
                    <div className='input-group-text align-items-start px-0 py-0 d-flex flex-column bg-white'>
                        <div className="d-flex w-100 mt-1 mb-1 bg-white">
                            <div className='flex-grow-1 ms-1 me-5'><Search size={"small"}/></div>
                            <button className='rounded bg-white border-light me-2' onClick={handle}><FontAwesomeIcon
                                icon={faPlus}/></button>
                            <button className='rounded bg-white border-light me-2'><FontAwesomeIcon
                                icon={faArrowDownWideShort}/></button>
                        </div>
                        <div className='d-flex' style={{
                            width: "500px",
                            opacity: createProjectFormIsOpen ? 0 : 1,
                            transition: "opacity .4s"
                        }}>
                            <ProjectList projects={project}/>
                        </div>
                    </div>
                    <div className='form-control'>
                        <Summary/>
                    </div>
                </div>
            </div>
        );
    }
}
