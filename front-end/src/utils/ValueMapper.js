// Story point değerleri
const storyPointItemList = [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"],
    ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"]];

// Story point butonunda yazacak yazıyı ve buton stilini döndürür.
function storyPointMap(status) {
    return {text: buttonText(status, storyPointItemList), style: "bg-secondary border-secondary"};
}

// Task statü değerleri
const statusButtonItemList = [["backlog", "BACKLOG"], ["passive", "TO-DO"], ["wip", "IN-PROGRESS"], ["done", "COMPLETED"]];

// Statü butonunda yazacak yazıyı ve buton stilini döndürür.
function statusButtonMap(status) {
    return {text: buttonText(status, statusButtonItemList), style: buttonColor(status)};
}

// Proje statü değerleri
const projectStatusItemList = [["wip", "IN-PROGRESS"], ["done", "COMPLETED"]];

function projectStatusMap(status) {
    const statusText = (status === "wip") ? projectStatusItemList[0][1] : projectStatusItemList[1][1];
    const style = (status === "wip") ? "border-warning bg-warning rounded-pill" : "border-success bg-success rounded-pill";
    return {text: statusText, style: style};
}

// Sprint statü değerleri
const sprintStatusItemList = [["passive", "PASSIVE"], ["wip", "ACTIVE"], ["done", "COMPLETED"]];

function sprintStatusMap(status) {
    return {text: buttonText(status, sprintStatusItemList), style: buttonColor(status)};
}

// ***** Yardımcı metotlar *****

// Verilen item dizisinin elemanlarından verilen statü ile ilk elemanı uyuşan dizinin ikinci elemanını döndürür.
function buttonText(status, itemList) {
    for (const item of itemList) {
        if (status === item[0]) {
            return item[1];
        }
    }
}

// Verilen statüye göre arka plan ve border rengi döndürür.
function buttonColor(status) {
    if (status === "done") {
        return "border-success bg-success";
    } else if (status === "wip") {
        return "border-warning bg-warning";
    } else if (status === "passive") {
        return "border-info bg-info"
    } else if (status === "backlog") {
        return "border-secondary bg-secondary";
    }
}
// *****

export const storyPointMapper = {items: storyPointItemList, map: storyPointMap}
export const taskStatusMapper = {items: statusButtonItemList, map: statusButtonMap}
export const projectStatusMapper = {items: projectStatusItemList, map: projectStatusMap}
export const sprintStatusMapper = {items: sprintStatusItemList, map: sprintStatusMap}
