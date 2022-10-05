import React, { Component } from 'react'
import logo from "../../logo.png";
import { Link } from "react-router-dom";

//Logo ve marka isminden oluşan component döndürür.
export default class BrandName extends Component {
  render() {
    return (
      <Link to={"/dashboard/projects"} style={{textDecoration: "none"}}>
        <div className="navbar-brand d-flex ms-2 align-items-center">
            <img src={logo} alt="" width="35" className="d-inline-block align-text-top me-2"/>
            <span style={{color: "#C9D1D9"}} >Agile Express</span>
        </div>
      </Link>
        
    )
  }
}
