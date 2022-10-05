import React from 'react'
import "bootstrap/dist/css/bootstrap.css";
import ListItem from '../../list/ListItem';
import {Link, useOutletContext} from "react-router-dom";

export default function ProjectList({projects}) {
    const context = useOutletContext();

    // project/{projectName}/summary sayfasına yönlendiren liste itemleri oluştur
    const projectList = projects?.map((projectObj) => {
        const link = projectObj.name.toLowerCase().split(" ").join("-");
        return (
            <div key={projectObj.id} onClick={() => context.setCurrentProject(projectObj)}>
                <Link to={"/dashboard/project/" + link + "/summary"} style={{textDecoration: "none"}}>
                    <ListItem maxW={"300px"} projectName={projectObj.name} projectDesc={projectObj.desc}
                              notificationNumber={0}/>
                </Link>
            </div>
        )
    })

    return (
        <ul className="list-group flex-fill" style={{maxHeight: "450px", overflowY: "auto"}}>
            {projectList}
        </ul>
    )
}

