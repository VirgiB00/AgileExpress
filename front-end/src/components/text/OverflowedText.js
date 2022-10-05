import React from 'react'

export default function OverflowedText({customStyle, children}) {
    return (
        <div className='text-start' style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            ...customStyle
        }}>{children}</div>
    )
}