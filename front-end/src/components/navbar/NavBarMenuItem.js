import React, { Component } from 'react'
import {Link} from "react-router-dom";

export default class NavBarMenuItem extends Component {
  constructor (props) {
    super(props);
    this.link = props.link;
    this.itemName = props.itemName;
  }

  render() {
    return (
        <Link to={this.link} style={{textDecoration: "none"}}>
          <div className="nav-item nav-link align-self-center mt-1" style={{color: "#C9D1D9"}}>{this.itemName}</div>
        </Link>
    )
  }
}
