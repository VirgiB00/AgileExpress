import {Modal} from "react-bootstrap";

function CustomModal(props) {
    const headerSection = (props.header !== null) ? <Modal.Header style={props.headerstyle} closeButton>{props.header}</Modal.Header> : <></>;
    const bodySection = (props.body !== null) ? <Modal.Body>{props.body}</Modal.Body> : <></>;
    const footerSection = (props.footer !== null) ? <Modal.Footer>{props.footer}</Modal.Footer> : <></>;

    return (
        <Modal {...props}>
            {headerSection}
            {bodySection}
            {footerSection}
        </Modal>
    );
}

// Dikey olarak ortalanmış modal döndürür.
export function VerticalCenteredModal({modalShow, setModalShow, header = null, body = null, footer = null}) {
    return (
        <CustomModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            size={"lg"}
            aria-labelledby={"contained-modal-title-vcenter"}
            centered
            header={header}
            body={body}
            footer={footer}
        />
    )
}

// Alert'lerde kullanmak üzere üstten açılan modal döndürür.
export function AlertModal({modalShow, setModalShow, header}) {
    return (
        <CustomModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            header={header}
            headerstyle={{borderColor: "transparent", fontWeight: "bold", color: "red"}}
            body={null}
            footer={null}
        />
    )
}

// Onaylamada kullanmak üzere üstten açılan modal döndürür.
export function ConfirmModal({modalShow, setModalShow, body, footer}) {
    return (
        <CustomModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            header={null}
            body={body}
            footer={footer}
        />
    )
}