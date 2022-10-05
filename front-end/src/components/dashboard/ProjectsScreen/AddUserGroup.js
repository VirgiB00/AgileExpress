import React, {useState} from 'react';
import {useOutletContext} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {assignUserToProject, isUserExistByEmail} from "../../../utils/Requests";
import {AlertModal} from "../../modal/CustomModal";

export default function AddUserGroup({list, setList}) {
    const context = useOutletContext();
    const [mail, setMail] = useState("");
    const [alert1, setAlert1] = useState(false);
    const [alert2, setAlert2] = useState(false);
    const [alert3, setAlert3] = useState(false);

    // Girdi mail regex'ine uyuyorsa server'a mail'e ait kullanıcı var mı diye sorgu atar.
    function AddMember() {
        if (mail === context.loggedUser.mail) {
            alert("You can't invite yourself.")
            return;
        }
        if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            if (!list.includes(mail)) {
                isUserExistByEmail(mail)
                    .then(body => {
                        // 200 statü koduyla dönmüş ise
                        if (!Array.isArray(body)) {
                            if (context.adminMod) {
                                assignUserToProject()
                                    .then(body => {
                                        if (body === undefined)  alert("Successful!");
                                    })
                            } else {
                                setList(invitedMembers => [...invitedMembers, body]);
                                setMail("");
                            }
                        // 204 kodu ile dönmüşse
                        } else
                            setAlert1(true);
                    });
            } else
                setAlert2(true);
        } else
            setAlert3(true);
    }


    // Listedeki her elemen için liste eşyası oluşturur.
    const mailList = list?.map(function (user) {
        function handle() {
            setList(list => list.filter(item => item !== user))
        }

        return (
            <div key={user.id} className="d-flex flex-row mt-2 ms-2">
                <span>{user.mail}</span>
                <span className="ms-2" onClick={handle}>
                    <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                </span>
            </div>
        )
    });

    return (
        <div>
            <AlertModal modalShow={alert1} setModalShow={setAlert1} header={<span className={"text-center w-100"}>We couldn't find any user by this e-mail address. Make sure you are typing right.</span>}/>
            <AlertModal modalShow={alert2} setModalShow={setAlert2} header={<span className={"text-center w-100"}>You can't invite same people again.</span>}/>
            <AlertModal modalShow={alert3} setModalShow={setAlert3} header={<span className={"text-center w-100"}>This doesn't look like an e-mail address. Make sure you are typing right.</span>}/>
            <div className="mb-3 d-flex flex-column">
                <label className="mb-2 fw-light" htmlFor="mail" style={{color: "#343434"}}>Invite people:</label>
                <input id="mail" type="text" placeholder={"demo@example.com"} className="form-control form-control-sm"
                       value={mail}
                       onChange={(e) => setMail(e.target.value)} onKeyDown={(e) => {
                    if (e.key === "Enter") return AddMember()
                }}/>
                <div className="mt-2" style={{maxHeight: "160px", overflowY: "auto"}}>
                    {mailList}
                </div>
            </div>
        </div>
    )
}