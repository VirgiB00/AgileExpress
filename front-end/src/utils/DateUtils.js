// Verilen tarihten saat:dakika gün/ay/yıl formatında string döndürür.
export function dateParserFull(aDate) {
    if (aDate !== undefined && aDate !== null) {
        const temp = new Date(aDate);
        return zeroPadder(temp.getHours()) + ":" + zeroPadder(temp.getMinutes()) + " " + dateParser(aDate);
    }
    return "--/--/----";
}


// Verilen tarihten gün/ay/yıl formatında string döndürür.
export function dateParser(aDate) {
    if (aDate !== undefined && aDate !== null) {
        const temp = new Date(aDate);
        return zeroPadder(temp.getDate()) + "/" + zeroPadder((temp.getMonth() + 1)) + "/" + temp.getFullYear();
    }
    return "--/--/----";
}

// Tek haneli bir sayının başına 0 ekler
function zeroPadder(time) {
    const temp = ("00" + time);
    return temp.substring(temp.length - 2, temp.length);
}

// İki tarih arasındaki gün farkını bulur.
export function daysDifference(date1, date2) {
    let dif = date1.getTime() - date2.getTime();
    if (dif < 0) {
       dif = Math.abs(dif);
    }
    return Math.floor(dif / (1000 * 3600 * 24));
}

// Task'ın tahmini tamamlanma süresinden kalan günü hesaplar
export function remainingDays (task) {
    return task.duration - daysDifference(new Date(), new Date(task.startDate));
}
