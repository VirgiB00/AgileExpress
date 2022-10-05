import React from 'react'
import "./plainList.css";

// Kaydırılabilir liste oluşturur.
export default function PlainList({listName, items, listItem, headStyle = {}, bodyStyle = {}}) {

    function setItems() {
        if (items.length === 0) {
            return <></>;
        }
        return items?.map(item => {
            return listItem(item);
        });
    }

    return (
        <div className={"main"} style={{height: "100%"}}>
            <span className={"head"} style={headStyle}>{listName}</span>
            <div className={"container d-flex flex-column"} style={{height: "100%", overflowY: "auto", ...bodyStyle}}>
                {setItems()}
            </div>
        </div>
    )
}
