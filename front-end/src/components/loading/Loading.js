import React from "react";

export default function Loading() {
    return (
        <div className="d-flex w-100 justify-content-center"
             style={{position: "absolute", marginTop: "20%", fontSize: "30px"}}>
            <div className="spinner-border text-danger" role="status">
                <span className="sr-only"></span>
            </div>
        </div>
    )
}