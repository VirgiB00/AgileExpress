import React from 'react'
import OverflowedText from "../text/OverflowedText.js";

// Dashboard'da listelenen projelerin liste itemi
export default function ListItem({maxW, projectName, projectDesc, notificationNumber}) {
  return (
    <div>
        <li className="list-group-item d-flex justify-content-between align-items-center">
        <div style={{width: maxW}}>
            <OverflowedText>{projectName}</OverflowedText>
            <OverflowedText>{projectDesc}</OverflowedText>
        </div>
        <span className="badge bg-primary rounded-pill align-self-start">{notificationNumber}</span>
        </li>
    </div>
  )
}
