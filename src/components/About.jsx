import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function About(props) {
    const showAboutModal = props.showAboutModal;

    const toggleAboutModal = props.toggleAboutModal;
    const toggleUploadModal = props.toggleUploadModal;

    return (
        <>
            <Button variant="link" onClick={() => toggleAboutModal(true)}>
                about
            </Button>

            <Modal show={showAboutModal} onHide={() => toggleAboutModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>About Lane Claim</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Lane Claim is progressive web app dedicated to protecting bike lanes from automobile obstructions.</p>
                    <h3>Goals</h3>
                    <ul>
                        <li>To use this data to determine which bikelanes are in the most need for better protection</li>
                        <li>To potentially hold offenders accountable</li>
                    </ul>
                    
                    <h3>How To Use</h3>
                    <p>Simply take a picture of the offending vehicle and after submitting it Lane Claim will place a marker at its location with the offender's information.</p>    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => toggleAboutModal(false)}>
                        Close
                    </Button>
                    <Button variant="success" onClick={() => {toggleAboutModal(false); toggleUploadModal(true);}}>
                        Submit New Claim
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default About;