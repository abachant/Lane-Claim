import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import ReportTable from './components/ReportTable';
import { Map, Circle, Popup, TileLayer } from 'react-leaflet';
import * as firebase from 'firebase';
import './index.css';

function App() {
  const database = firebase.database().ref();
  const incidentsRef = database.child('incidents');
  const storage = firebase.storage().ref();
  let incidentMarkers;

  const [markerList, setMarkerList] = useState([ ]);

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

            {/* Create Marker for each incident in State */}
            {markerList.map(item => (
              <Circle key={item.name} center={[item.latitude, item.longitude]} radius={8} className="marker">
                <Popup>
                  <div className="marker-popup">
                    <img src={item.imgDownloadURL} alt="bike lane obstruction incident" className="marker-popup-photo img-thumbnail"/>
                    <p>License Plate: {item.licensePlate}</p>
                    <p>License State: {item.state}</p>
                    <p>Comment: {item.comment}</p>
                  </div>
                </Popup>
              </Circle>)
            )}
          </Map>
        </div>
        <ReportTable markerList={markerList}/>
      </div>
    </div>
  );
}

export default App;