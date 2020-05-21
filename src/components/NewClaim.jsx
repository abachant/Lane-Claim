import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import EXIF from 'exif-js';
import * as utils from '../utils';


function NewClaim(props) {
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState();
    
    const showUploadModal = props.showUploadModal;
    const showConfirmationModal = props.showConfirmationModal;
    const showSuccessModal = props.showSuccessModal;

    const toggleUploadModal = props.toggleUploadModal;
    const toggleConfirmationModal = props.toggleConfirmationModal;
    const toggleSuccessModal = props.toggleSuccessModal;

    const incidentsRef = props.incidentsRef;
    const storage = props.storage;
    let inputFile;

    /**
    * Retrieve latitude, longitude, and datetime of photo from its exif data
    */
    function getExif (file, callback) {
        EXIF.getData(file, function () {
        var allMetaData = EXIF.getAllTags(this)
        var gpsInfo = utils.parseDMS(allMetaData)
        var exifInfo = false
        if (gpsInfo) {
            exifInfo = {
            latitude: gpsInfo.Latitude,
            longitude: gpsInfo.Longitude,
            dateTime: allMetaData.DateTime
            }
        }

        callback(exifInfo)
        })
    }

    /**
    * Validate that the file is acceptable before proceeding to next modal
    */
    function validateFile () {
        let fileInput = document.getElementById('file-input')
        inputFile = fileInput.files[0]
        // Make sure file is not empty
        if (inputFile !== undefined){
            setFile(inputFile);
            EXIF.getData(inputFile);
            // Make sure file is a Jpeg
            if (utils.isFileExtensionJpeg(inputFile)) {
                getExif(inputFile, function (exifData) {
                    // Make sure file has exif data before proceeding
                    if (exifData) {
                        inputFile.dateTime = exifData.dateTime
                        inputFile.latitude = exifData.latitude
                        inputFile.longitude = exifData.longitude
                        console.log('we gots dat exif dat')
                        // Add temporary marker to confirmMap Modal

                        // Create filename for photo for storing/databasing by combining dateTime with gps position
                        let inputFileName = exifData.dateTime.split(' ')[0] + '_' + exifData.dateTime.split(' ')[1] + '_' + exifData.latitude + '_' + exifData.longitude
                        // Convert all '.'s to 'p's because they aren't allowed to be used in firebase names
                        inputFileName = inputFileName.replace(/\./g, 'p')
                        setFileName(inputFileName);
                    }
                })
                // Proceed to Confirmation Modal
                toggleUploadModal(false)
                toggleConfirmationModal(true)

            } else {
                // File is not a Jpeg warning
            }
        } else {
            // File is empty warning 
        }
    }

    /**
    Upload incident to firebase 
    */
    function uploadToFirebase() {
        if (typeof file !== 'undefined') {
            storage.child(fileName).put(file)
            storage.child(fileName).getDownloadURL().then(function(url) {
              // `url` is the download URL for 'storage.child(fileName).jpg'
              var downloadURL = url
              incidentsRef.child(fileName).set({
                name: fileName,
                imgDownloadURL: downloadURL,
                dateTime: file.dateTime,
                latitude: file.latitude,
                longitude: file.longitude,
                licensePlate: document.getElementById('license-plate').value,
                state: document.getElementById('state-selector').value,
                comment: document.getElementById('picture-comment').value
              })
              // Proceed to Success Modal
              toggleConfirmationModal(false); 
              toggleSuccessModal(true);

            }).catch(function(error) {
              console.error(error)
            })
          } else {
              console.log(inputFile)
          }
    }

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
                    <h6>Upload a photo of a vehicle obstructing a bike lane</h6>
                    <input type="file" name="claim-file" id="file-input" accept="image/.jpeg" />
                    <p>File must be a jpeg</p>
                    <p>File does not contain GPS metadata</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => toggleUploadModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => validateFile()}>
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
                        <input type="text" id="license-plate" /><br />
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
                    <Button variant="primary" onClick={() => {uploadToFirebase()}}>
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