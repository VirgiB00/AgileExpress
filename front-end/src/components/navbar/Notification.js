import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faXmark} from "@fortawesome/free-solid-svg-icons";
import FetchInit from "../../utils/FetchInit";
import {useNavigate} from "react-router-dom";

export default function Notification({invitation}) {
    const navigate = useNavigate();

    // Kullanıcı kabul butonuna tıkaldığında projeye dahil edilir.
    function accept() {
        fetch("/api/project/invitation/accept?projectId="+invitation.project.id+"&userId="+invitation.invitedUser.id, FetchInit("post"))
            .then((response) => {
                if (response.status === 201) {
                    window.location.reload();
                } else if (response.status === 406) {
                  alert("An error occurred, please try again later.");
                } else {
                    navigate("/login");
                }
            });
    }

    // Davetlerden bu daveti siler.
    function reject() {
        fetch("/api/project/invitation/reject?projectId="+invitation.project.id+"&userId="+invitation.invitedUser.id, FetchInit("delete"))
            .then((response) => {
                if (response.status === 200) {
                    window.location.reload();
                } else if (response.status === 406) {
                    alert("An error occurred, please try again later.");
                } else {
                    navigate("/login");
                }
            });
    }

    return (
        <div className={"rounded border mx-2 mt-2"} style={{width: "200px"}}>
            <span>You are invited to {invitation.project.name}. Do you accept invitation?</span>
            <div className={"d-flex flex-row justify-content-between"}>
                <button className={"bg-white border rounded-pill text-danger  ms-4"} onClick={reject}>
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
                <button className={"bg-white border rounded-pill text-success me-5"} onClick={accept}>
                    <FontAwesomeIcon icon={faCheck}/>
                </button>
            </div>
        </div>
    )
}