import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

export function CustomTooltip({text, children}) {
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {text}
        </Tooltip>
    );

    return (
        <OverlayTrigger placement="top" overlay={renderTooltip}>
            {children}
        </OverlayTrigger>
    )
}