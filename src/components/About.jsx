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
                        <li>To use this data to determine which bikelanes are in the most need for better protection.</li>
                        <li>To potentially hold offenders accountable.</li>
                    </ul>
                    
                    <h3>How To Use</h3>
                    <ul>
                        <li>Simply take a photo of the offending vehicle and upload it with the 'Submit New Claim' button</li>
                        <li>Add any supplemental info like the offender's liscence plate or add a comment</li>
                        <li>Lane Claim will place a marker at its location with its information</li>
                    </ul>

                    <h3>Open Source</h3>
                    <ul>
                        <li>Lane Claim is open source and pull requests are welcome!</li>
                        <li>View the source code <a href="https://github.com/abachant/Lane-Claim">here</a>.</li>
                    </ul>

                    <h3>Submit a Bug</h3>
                        <ul>
                            <li><a href="mailto:laneclaim@gmail.com">Send an email</a></li>
                            <li><a href="https://github.com/abachant/Lane-Claim/issues">Submit through GitHub</a></li>
                        </ul>
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