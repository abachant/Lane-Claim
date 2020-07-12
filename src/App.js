import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import ReportTable from './components/ReportTable';
import { Map, Circle, Popup, TileLayer} from 'react-leaflet';
import L from 'leaflet';
import Collapse from 'react-bootstrap/Collapse'
import * as firebase from 'firebase';
import './index.css';

function App() {
  const database = firebase.database().ref();
  const incidentsRef = database.child('incidents');
  const storage = firebase.storage().ref();
  let incidentMarkers;

  const [markerList, setMarkerList] = useState([ ]);
  const [toggleReportTable, setToggleReportTable] = useState(true);

  useEffect(() => {
    // Add each database entry from firebase to State
    database.on('value', (snapshot) => {
      incidentMarkers = snapshot.child('incidents/').val();
      setMarkerList(Object.values(incidentMarkers).map((item) => item))
      })
    }, []);

  return (
    <div className="App">
      <NavBar incidentsRef={incidentsRef} storage={storage}/>
      <div className="container-fluid row map">
          <div id="map-container">
            <Map className="map" center={[39.8283, -98.5795]} zoom={5}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            {/* <button className="btn btn-primary" data-toggle="collapse" data-target="#report-table-container">blumbpf</button> */}

            {/* Create Marker for each incident in State */}
            {markerList.map(item => (
              <Circle key={item.name} center={[item.latitude, item.longitude]} radius={8} className="marker">
                <Popup>
                  <div className="marker-popup">
                    <img src={item.imgDownloadURL} alt="bike lane obstruction incident" className="marker-popup-photo img-thumbnail"/>
                    <table className="table table-sm table-bordered popup-table" >
                      <thead>
                        <tr>
                          <th colSpan="2">License</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{item.licensePlate}</td>
                          <td>{item.state}</td>
                        </tr>
                      </tbody> 
                    </table>
                    <table className="table table-sm table-bordered popup-table">
                      <thead>
                        <tr>
                          <th>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{item.location}</td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="table table-sm table-bordered popup-table">
                      <thead>
                        <tr>
                          <th>Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{item.comment}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Popup>
              </Circle>)
            )}
          </Map>
        </div>
        <button className="btn btn-primary" onClick={() => setToggleReportTable(!toggleReportTable)} aria-controls="report-table-container" arai-expanded="toggleReportTable">Table</button>
        <Collapse in={toggleReportTable}>
          <div id="report-table-container" className="col-md-4 hidden-xs">
            <ReportTable markerList={markerList}/>  
          </div> 
        </Collapse>
      </div>
    </div>
  );
}

export default App;