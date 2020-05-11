import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function NewClaim() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="success" onClick={handleShow}>
                Submit New Claim
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Submit New Claim</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>Upload an image of a vehicle obstructing a bike lane</h6>
                    <input type="file" name="claim-file" id="file-input" accept="image/.jpeg" />
                    <p>Please choose a photo</p>
                    <p>File must be a jpeg</p>
                    <p>File does not contain GPS metadata</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Next
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default NewClaim;
