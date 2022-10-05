import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import useLocalStorage from "../utils/UseLocalStorage.js";
import logo from "../logo.png";
import {loginRequest} from "../utils/Requests";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [jwt, setJwt] = useLocalStorage("jwt", "");

    let navigate = useNavigate();

    function fetchRequest(endpoint, requestHeaderValue) {
        loginRequest(endpoint, requestHeaderValue)
            .then(response => {
                if (response.status === 200) {
                    const token = response.headers.get("authorization");
                    if (token !== undefined) {
                        setJwt(token.split(" ")[1]);
                        navigate("/dashboard/projects")
                    } else
                        alert("An unexpected error has occured.")
                } else
                    alert("Invalid credentials.");
            });
    }

    // Token'i local'de sakla, httpOnly cookie araştır
    function handleLDAPLogin() {
        const requestHeaderValue = "Basic " + window.btoa(username + ":" + password);
        fetchRequest("/auth/ldap/token", requestHeaderValue);

    }

    function handleGoogleAuthLogin(response) {
        fetchRequest("/auth/oauth/token", "Bearer " + response.credential)
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: "158077648147-q1unofqbukt91ncmnb2bemi7jeb849g8.apps.googleusercontent.com",
            callback: handleGoogleAuthLogin
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {
                theme: "filled_black", size: "medium", width: 288, text: "continue_with", locale: "en-US",
                logo_alignment: "left"
            }
        )
    });

    return (
        <div>
            <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center"
                 style={{backgroundColor: "#0D1117"}}>
                <img className="img-fluid mb-4" style={{height: "70px"}} src={logo} alt=''/>
                <h1 className="fs-4 mb-4 fw-light" style={{color: "#C9D1D9"}}>Sign in to Agile Express</h1>
                <div className="border rounded-4 p-3" style={{backgroundColor: "#161B22", width: "325px"}}>
                    <div className="mb-3 d-flex flex-column">
                        <label className="text-white mb-2 fw-lighter" htmlFor="username">Username or email
                            address</label>
                        <input id="username" type="text" className="form-control form-control-sm" value={username}
                               onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="d-flex flex-column mb-4">
                        <div className="d-flex justify-content-between align-items-end mb-2">
                            <label className="text-white fw-lighter" htmlFor="pw">Password</label>
                            <a href="https://google.com" style={{fontSize: "0.9rem"}}>Forgot password?</a>
                        </div>
                        <input id="pw" type="password" className="form-control form-control-sm" value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type="button" className="btn btn-success btn-sm w-100 mb-3"
                            onClick={() => handleLDAPLogin()}>Sign in
                    </button>
                    <span className="d-flex justify-content-center text-white fw-light text-uppercase mb-3"
                          style={{fontSize: "0.9rem"}}>
                        Or
                </span>
                    <div className='border border-white rounded' style={{height: "35px"}}>

                        <div id='signInDiv'></div>
                    </div>
                    <button className="btn btn-outline-light btn-sm w-100 my-3 text-white fw-semibold"
                            style={{height: "35px", backgroundColor: "#202124"}} type="button" id="toRegister">
                        Create a new Agile Express account
                    </button>
                </div>
            </div>
        </div>
    );
}
