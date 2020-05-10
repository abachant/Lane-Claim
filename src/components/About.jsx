import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function About() {
    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="link" onClick={handleShow}>
                about
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>About Lane Claim</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Lane Claim is progressive web app dedicated to protecting bike lanes from automobile obstructions and holding offenders acountable.</p>
                    <p>Simply take a picture of the offending vehicle and after submitting it Lane Claim will place a marker at its location with the offender's information.</p>    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="success" onClick={handleClose}>
                        Submit a Claim
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default About;
