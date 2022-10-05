import React from "react";

// Tabloya benzer liste oluşturur. Head sabit kalırken liste scrollanabilir.
// items dışındaki parametreler liste tasarımını oluştururken, items API sorgu sonucudur.
export function TableList({head, column, headStyle = {}, bodyStyle = {}, columnStyle = {}, items}) {
    // Liste head'ini oluşturur.
    let index = 0;
    const header = head?.map(item => {
        index += 1;
        return <div key={index} className={((index !== 1) ? "border-start" : "")} style={item.style}>{item.label}</div>
    });

    // Listenin satırlarını oluşturur.
    function rows(rowItems) {
        return rowItems?.map(function (item, i) {
            return (
                <div key={i} className={"my-1 d-flex flex-row px-3 py-1 align-items-center border-bottom border-dark"}
                     style={columnStyle}>
                    {columns(item)}
                </div>
            )
        });
    }

    // Verilen itemin sutünlarını oluşturur.
    function columns(item) {
        let index = 0;
        return column?.map(function (col, i) {
            index += 1;
            return (
                <div key={i} className={"text-center " + ((index !== 1) ? "border-start" : "")} style={col.style}>
                    {col.content(item)}
                </div>
            );
        });
    }

    return (
        <div style={{width: "100%", overflowY: "auto", position: "relative"}}>
            <div className={"d-flex flex-row px-3 py-1 text-center border-bottom border-dark shadow-sm"}
                 style={{position: "sticky", top: "0", backgroundColor: "white", ...headStyle}}>
                {header}
            </div>
            <div style={bodyStyle}>
                {rows(items)}
            </div>
        </div>
    )
}

export class HeadItem {
    constructor(label = "New Label", style = {}) {
        this.label = label;
        this.style = style;
    }
}

export class ColumnItem {
    constructor(content = <div>New Column</div>, style = {}) {
        this.content = content;
        this.style = style;
    }
}