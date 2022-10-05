import React, {useState} from 'react';
import AddUserGroup from "../AddUserGroup";
import {requestBodyValues} from "../../../../utils/FetchInit";
import {createProject, inviteUsersToProject} from "../../../../utils/Requests";

export default function ProjectCreateForm({heightValue, callback}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [invitedMembers, setInvite] = useState([]);

    // TODO validation yap
    // Proje oluşturmak için istek at
    function handleCreate() {
        createProject(name, description)
            .then(body => {
                if (body === requestBodyValues.success) {
                    invite(body.id);
                }
            });
    }

    // Kullanıcıları projeye davet et
    function invite(projectId) {
        if (invitedMembers.length > 0) {
            inviteUsersToProject(projectId, invitedMembers)
                .then(body => {
                    if (body === requestBodyValues.success) {
                        callback();
                    }
                });
        } else {
            callback();
        }
    }

    return (
        <div className='border rounded' style={{height: heightValue, marginTop: "50px"}}>
            <div className="m-4 d-flex">
                <div className="w-50">
                    <div className="mb-3 d-flex flex-column">
                        <label className="mb-2 fw-light" htmlFor="name" style={{color: "#343434"}}>Project name:</label>
                        <input id="name" type="text" className="form-control form-control-sm" value={name}
                               onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="mb-3 d-flex flex-column">
                        <label className="mb-2 fw-light" htmlFor="desc" style={{color: "#343434"}}>Project
                            description:</label>
                        <input id="desc" type="text" className="form-control form-control-sm" value={description}
                               onChange={(e) => setDescription(e.target.value)}/>
                    </div>
                    <div className="d-flex justify-content-center" style={{marginTop: "50px"}}>
                        <button className="flex btn btn-success" onClick={handleCreate}>CREATE</button>
                    </div>
                </div>
                <div className="border mx-3 bg-dark" style={{width: "1px"}}></div>
                <div className="ms-3 w-50 d-flex flex-column">
                    <span style={{marginBottom: "15px"}}>You can invite other people to your project. Don't worry you can edit this section later.</span>
                    <AddUserGroup list={invitedMembers} setList={setInvite}/>
                </div>
            </div>
        </div>
    )
}
