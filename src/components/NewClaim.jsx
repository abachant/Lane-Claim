import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Map, Marker, TileLayer } from 'react-leaflet';
import EXIF from 'exif-js';
import * as utils from '../utils';
import REACT_APP_MAPQUEST_API_KEY from './temporary_key.jsx'

const axios = require('axios');

function NewClaim(props) {
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState();
    const [confirmationMarker, setConfirmationMarker] = useState();
    const [location, setLocation] = useState();
    
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
    * Perform axios GET call to mapquest reversegeocode api to convert [Lat,Long] to Street Address
    */
    const getLocation = async (key, position) => {
        try {
          let response = await axios.get(`http://www.mapquestapi.com/geocoding/v1/reverse?key=${key}&location=${position}`);
          response = response.data.results[0].locations[0];
          
          // Get street name without specific address by removing first substring
          const formattedStreet = response.street.split(" ").slice(1).join(" ")

          const location = `${formattedStreet}, ${response.adminArea5}, ${response.adminArea3} ${response.postalCode}`
          setLocation(location)
        } catch (error) {
          console.error(error);
        }
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
                        // Add temporary marker to confirmMap Modal
                        setConfirmationMarker([inputFile.latitude, inputFile.longitude])
                        // Create filename for photo for storing/databasing by combining dateTime with gps position
                        let inputFileName = exifData.dateTime.split(' ')[0] + '_' + exifData.dateTime.split(' ')[1] + '_' + exifData.latitude + '_' + exifData.longitude
                        
                        // Convert all '.'s to 'p's because they aren't allowed to be used in firebase names
                        inputFileName = inputFileName.replace(/\./g, 'p')
                        setFileName(inputFileName);

                        // Get street address of marker
                        getLocation(REACT_APP_MAPQUEST_API_KEY,[exifData.latitude, exifData.longitude])

                        // Proceed to Confirmation Modal
                        toggleUploadModal(false)
                        toggleConfirmationModal(true)
                    } else {
                        // File does not contain any exif data warning
                        alert('File is missing exif data')
                    }
                })

            } else {
                // File is not a Jpeg warning
                alert('File is not a Jpeg')
            }
        } else {
            // File is empty warning 
            alert('Please select a Jpeg with exif data')
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
                location: location,
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
                    <p>File must be a jpeg with exif data</p>
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

            {/* Modal for confirming submission details */}
            <Modal show={showConfirmationModal} onHide={() => toggleConfirmationModal(false)} id="confirmation-modal" animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Map id="confirmation-map" className="map" center={confirmationMarker} zoom={17}>
                    <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <Marker position={confirmationMarker}></Marker>
                </Map>
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
                    <Button variant="success" onClick={() => {toggleSuccessModal(false); toggleUploadModal(true)}}>
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