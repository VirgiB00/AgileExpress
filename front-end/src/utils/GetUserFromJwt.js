import jwtDecode from "jwt-decode";

export default function getUserFromJwt() {
    const token = localStorage.getItem("jwt");
    try {
        const data = jwtDecode(token);
        if (data && data.sub && data.exp) {
            const expDate = new Date(data.exp);
            const now = new Date();
            if (now.getTime()/1000 < expDate.getTime()) {
                return data;}
        }
        return null;
    } catch {
        return null;
    }
}
