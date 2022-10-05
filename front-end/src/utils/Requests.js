import {fetchTemplate} from "./FetchInit";

export const loginRequest = (endpoint, authorizationValue) => {
    return fetch(endpoint, {
        headers: {"Authorization": authorizationValue},
        method: "get",
    });
}

// ---------- ProjectController ile ilgili istekler ----------
export const createProject = (projectName, projectDescription) => {
    const obj = {name: projectName, description: projectDescription};
    return fetchTemplate("/api/project/create", "post", obj);
}

export const getProject = (projectId) => {
    return fetchTemplate("/api/project/get?projectId=" + projectId, "get");
}

export const updateProject = (projectId, newName, newDescription, newStatus) => {
    const obj = {
        id: projectId,
        name: newName,
        description: newDescription,
        status: newStatus
    };
    return fetchTemplate("/api/project/update", "put", obj);
}

export const deleteProject = (projectId) => {
    return fetchTemplate("/api/project/delete?projectId=" + projectId, "delete");
}

export const getProjectWithUserRole = (projectId) => {
    return fetchTemplate("/api/project/getProjectAndUserRole?projectId=" + projectId, "get");
}

export const getAllProjects = () => {
    return fetchTemplate("/api/project/all", "get");
}

export const getAssignedProjects = () => {
    return fetchTemplate("/api/project/assigned", "get");
}

export const getAssignedUsersOfProject = (projectId) => {
    return fetchTemplate("/api/project/assignedUsers?projectId=" + projectId, "get");
}

export const assignUserToProject = (projectId, userId) => {
    return fetchTemplate("/api/project/assignUser?projectId=" + projectId + "&userId=" + userId, "get");
}

export const unassignUserFromProject = (projectId, userId) => {
    return fetchTemplate("/api/project/unassignUser?projectId=" + projectId + "&userId=" + userId, "get");
}

export const inviteUsersToProject = (projectId, users) => {
    return fetchTemplate("/api/project/inviteUsers?projectId=" + projectId, "post", users);
}

export const updateUserRole = (projectId, userId, role) => {
    const obj = {userId: userId, role: role};
    return fetchTemplate("/api/project/updateUserRole?projectId=" + projectId, "put", obj);
}

export const searchProject = (value, page) => {
    return fetchTemplate("/api/project/search?value=" + value + "&page=" + page, "get");
}
// **********

// ---------- UserController ile ilgili istekler ----------
export const isUserExistByEmail = (email) => {
    return fetchTemplate("/api/user/getByEmail?email=" + email, "get")
}

export const getUserDetailByUsername = (username) => {
    return fetchTemplate("/api/user/getByUsername?username=" + username, "get");
}

export const searchUser = (value, page) => {
    return fetchTemplate("/api/user/search?value=" + value + "&page=" + page, "get");
}
// **********

// ---------- TaskController ile ilgili istekler ----------
export const createTask = (projectId, newName, newDescription, newStoryPoint, newDuration) => {
    const obj = {
        name: newName,
        description: newDescription,
        storyPoint: newStoryPoint,
        duration: newDuration
    };
    return fetchTemplate("/api/project/task/create?projectId=" + projectId, "post", obj);
}

export const getTask = (taskId) => {
    return fetchTemplate("/api/project/task/getTask?taskId=" + taskId, "get");
}


export const updateTask = (taskId, name, description, status, storyPoint, duration) => {
    const obj = {
        id: taskId,
        name: name,
        description: description,
        status: status,
        storyPoint: storyPoint,
        duration: duration
    };
    return fetchTemplate("/api/project/task/update", "put", obj);
}

export const deleteTask = (taskId) => {
    return fetchTemplate("/api/project/task/delete?taskId=" + taskId, "delete");
}

export const getBacklogTasks = (projectId) => {
    return fetchTemplate("/api/project/task/getBacklogTasks?projectId=" + projectId, "get");
}

export const getActiveSprintTasks = (projectId) => {
    return fetchTemplate("/api/project/task/activeSprintTasks?projectId=" + projectId, "get");
}

export const getSprintTasks = (sprintId) => {
    return fetchTemplate("/api/project/task/getSprintTasks?sprintId=" + sprintId, "get");
}

export const assignUserToTask = (taskId, userId) => {
    return fetchTemplate("/api/project/task/assignUser?taskId=" + taskId + "&userId=" + userId, "put");
}

export const unassignUserFromTask = (taskId, userId) => {
    return fetchTemplate("/api/project/task/unassignUser?taskId=" + taskId + "&userId=" + userId, "put");
}

export const searchTask = (value, page) => {
    return fetchTemplate("/api/project/task/search?value=" + value + "&page=" + page, "get");
}
// **********

// ---------- SprintController ile ilgili istekler ----------
export const createSprint = (projectId, sprintName, startDate, endDate) => {
    const body = {
        name: sprintName,
        startDate: startDate,
        endDate: endDate
    };
    return fetchTemplate("/api/project/sprint/create?projectId=" + projectId, "post", body);
}

export const deleteSprint = (sprintId) => {
    return fetchTemplate("/api/project/sprint/delete?sprintId=" + sprintId, "delete");
}

export const getSprints = (projectId) => {
    return fetchTemplate("/api/project/sprint/sprints?projectId=" + projectId, "get");
}

export const getSprintWithTasks = (sprintId) => {
    return fetchTemplate("/api/project/sprint/tasks?sprintId=" + sprintId, "get");
}

export const updateSprint = (sprintId, name, startDate, endDate, status) => {
    const obj = {
        id: sprintId,
        name: name,
        startDate: startDate,
        endDate: endDate,
        status: status
    };
    return fetchTemplate("/api/project/sprint/update", "put", obj);
}
