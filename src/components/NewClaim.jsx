import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


function NewClaim(props) {
    const showUploadModal = props.showUploadModal;
    const showConfirmationModal = props.showConfirmationModal;
    const showSuccessModal = props.showSuccessModal;

    const toggleUploadModal = props.toggleUploadModal;
    const toggleConfirmationModal = props.toggleConfirmationModal;
    const toggleSuccessModal = props.toggleSuccessModal;

    return (
        <>
            <Button variant="success" onClick={() => {toggleUploadModal(true);}}>
                Submit New Claim
            </Button>

            <Modal show={showUploadModal} onHide={() => toggleUploadModal(false)} id="upload-modal" animation={false}>
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
                    <Button variant="secondary" onClick={() => toggleUploadModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {toggleUploadModal(false); toggleConfirmationModal(true);}}>
                        Next
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmationModal} onHide={() => toggleConfirmationModal(false)} id="confirmation-modal" animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        License Plate:<br />
                        <input type="text" id="licensePlate" /><br />
                        <label htmlFor="state-selector">License State:</label>
                        <select className="form-control" id="state-selector">
                            <option value="N/A">N/A</option>
                            <option value="AL">AL</option>
                            <option value="AK">AK</option>
                            <option value="AR">AR</option>
                            <option value="AZ">AZ</option>
                            <option value="CA">CA</option>
                            <option value="CO">CO</option>
                            <option value="CT">CT</option>
                            <option value="DC">DC</option>
                            <option value="DE">DE</option>
                            <option value="FL">FL</option>
                            <option value="GA">GA</option>
                            <option value="HI">HI</option>
                            <option value="IA">IA</option>
                            <option value="ID">ID</option>
                            <option value="IL">IL</option>
                            <option value="IN">IN</option>
                            <option value="KS">KS</option>
                            <option value="KY">KY</option>
                            <option value="LA">LA</option>
                            <option value="MA">MA</option>
                            <option value="MD">MD</option>
                            <option value="ME">ME</option>
                            <option value="MI">MI</option>
                            <option value="MN">MN</option>
                            <option value="MO">MO</option>
                            <option value="MS">MS</option>
                            <option value="MT">MT</option>
                            <option value="NC">NC</option>
                            <option value="NE">NE</option>
                            <option value="NH">NH</option>
                            <option value="NJ">NJ</option>
                            <option value="NM">NM</option>
                            <option value="NV">NV</option>
                            <option value="NY">NY</option>
                            <option value="ND">ND</option>
                            <option value="OH">OH</option>
                            <option value="OK">OK</option>
                            <option value="OR">OR</option>
                            <option value="PA">PA</option>
                            <option value="RI">RI</option>
                            <option value="SC">SC</option>
                            <option value="SD">SD</option>
                            <option value="TN">TN</option>
                            <option value="TX">TX</option>
                            <option value="UT">UT</option>
                            <option value="VT">VT</option>
                            <option value="VA">VA</option>
                            <option value="WA">WA</option>
                            <option value="WI">WI</option>
                            <option value="WV">WV</option>
                            <option value="WY">WY</option>
                        </select>
                        Comment:<br />
                        <input type="text" id="picture-comment" />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {toggleConfirmationModal(false); toggleUploadModal(true);}}>
                        Back
                    </Button>
                    <Button variant="primary" onClick={() => {toggleConfirmationModal(false); toggleSuccessModal(true)}}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showSuccessModal} onHide={() => toggleSuccessModal(false)} id="success-modal" animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Successful!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => {toggleSuccessModal(false); toggleUploadModal(true);}}>
                        Submit Another Claim
                    </Button>
                    <Button variant="primary" onClick={() => toggleSuccessModal(false)}>
                        Exit to Map
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default NewClaim;
