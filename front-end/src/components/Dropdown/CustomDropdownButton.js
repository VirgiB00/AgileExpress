import React from "react";
import {ButtonGroup, Dropdown} from "react-bootstrap";

export default function CustomDropdownButton({value, setValue, mapper, style}) {
    const menuItems = [];
    const result = mapper.map(value);

    mapper.items.forEach(function (item, i) {
        menuItems.push(
            <div key={i}>
                <Dropdown.Item onClick={() => setValue(item[0])} active={(item[0] === value)}>
                    <span>{item[1]}</span>
                </Dropdown.Item>
            </div>
        );
    })

    // TODO butonun border'ı sıfırlanamıyor düzelt
    return (
        <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle id="dropdown-custom-1" className={result.style} style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                boxShadow: "none",
                ...style
            }}>{result.text}</Dropdown.Toggle>
            <Dropdown.Menu style={{minWidth: "100%"}}>
                {menuItems}
            </Dropdown.Menu>
        </Dropdown>
    )
}