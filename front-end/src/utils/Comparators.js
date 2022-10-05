import {remainingDays} from "./DateUtils";

export const compareByTaskName = (item1, item2) => {
    return item1.name.localeCompare(item2.name);
}

export const compareByRemainingDuration = (item1, item2) => {
    const item1RemainingDays = remainingDays(item1);
    const item2RemainingDays = remainingDays(item2);

    if (item1RemainingDays === item2RemainingDays)
        return 0;
    else if (item1RemainingDays < item2RemainingDays)
        return -1;
    else return 1;
}

export const compareByCompletionDate = (item1, item2) => {
    const date1 = (new Date(item1.completionDate)).getTime();
    const date2 = (new Date(item2.completionDate)).getTime();

    if (date1 === date2)
        return 0;
    else if (date1 < date2)
        return 1;
    else return -1;
}

export const compareBySprintStatus = (item1, item2) => {
    if (item1.status === "wip" && item2.status !== "wip")
        return -1;
    else if (item1.status === "passive") {
        if (item2.status === "passive") return 0;
        else if (item2.status === "done") return -1;
        else return 1;
    } else if (item1.status === "done") {
        if (item2.status === "done") return 0;
        else return 1;
    }
}

export const compareByMemberStatus = (item1, item2) => {
    if (item1.status === "project_manager") {
        if (item2.status === "project_manager")
            return 0;
        else if (item2.status !== "project_manager")
            return -1;
    } else if (item1.status === "team_lead") {
        if (item2.status === "team_lead")
            return 0;
        else if (item2.status === "project_manager")
            return 1;
        else return -1;
    } else
        return 1;
}