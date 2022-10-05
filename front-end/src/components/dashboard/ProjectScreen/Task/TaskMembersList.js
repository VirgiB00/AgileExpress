import {MemberList} from "../Members/MemberList";
import {MemberOfTaskInfo} from "../Members/MemberListItem/MemberOfTaskInfo";
import MemberDeleteAction from "../Members/MemberListItem/MemberDeleteAction";
import {computeFullNameAndFirstLetters} from "../../../../utils/TextFunction";

// Task'a atanmış kullanıcı gösteren listeyi döndürür.
export function TaskMembersList({members}) {
    const labels = ["Full Name", "E-mail"];

    function item(member) {
        const computed = computeFullNameAndFirstLetters(member.assignedUser);
        return <MemberOfTaskInfo fullName={computed.fullName} email={member.assignedUser.mail} firstLetters={computed.firstLetters}/>
    }

    return (
        <div style={{borderBottom: "0.05rem solid gray"}}>
            <MemberList column={labels} items={members} listItem={item}/>
        </div>
    )
}

// Task'a atanmış kullanıcıları editleyebilen liste döndürür.
export function TaskMembersEditList({members, unassignFunction}) {
    const labels = ["Full Name", "E-mail", "Action"];

    function listItem(member) {
        const computed = computeFullNameAndFirstLetters(member);
        return (
            <MemberOfTaskInfo fullName={computed.fullName} email={member.mail} firstLetters={computed.firstLetters}>
                <MemberDeleteAction clickFunction={() => unassignFunction(member.id)}/>
            </MemberOfTaskInfo>
        )
    }

    return (
        <MemberList column={labels} items={members} listItem={listItem}/>
    )
}