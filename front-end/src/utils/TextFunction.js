export function computeFullNameAndFirstLetters(user) {
    return {
        fullName: computeFullName(user.firstName, user.surname),
        firstLetters: computeFirstLetters(user.firstName, user.surname)
    };
}

export function computeFirstLetters(...names) {
    let result = "";
    names.forEach(name => {result += name.charAt(0)})
    return result.toUpperCase();
}

export function computeFullName(...names) {
    return names.join(" ");
}

export function computeProjectLinkName(projectName) {
    return projectName.toLowerCase().split(" ").join("-");
}