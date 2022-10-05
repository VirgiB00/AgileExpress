export default function FetchInit(methodType, bodyContent = {body: null}) {
    const token = localStorage.getItem("jwt");
    let tokenRaw = token.split('"')[1];
    if (methodType === "post" || methodType === "put") {
        return {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + tokenRaw
            },
            method: methodType,
            body: JSON.stringify(bodyContent)
        }
    } else {
        return {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + tokenRaw
            },
            method: methodType,
        }
    }
}

export function fetchTemplate(url, method, body) {
    return fetch(url, FetchInit(method, body))
        .then(response => {
            switch (response.status) {
                case 200:
                    return response.json();
                case 201:
                    return requestBodyValues.success;
                case 204:
                    return requestBodyValues.noContent;
                case 401:
                    break;
                case 406:
                    return requestBodyValues.unacceptable;
                case 500:
                    break;
                default:
                    break;
            }
        })
        .catch(error => {
            // return {response: null, error: error};
        });
}

export const requestBodyValues = {
    success: "success",
    unacceptable: "unacceptable",
    noContent: []
}
