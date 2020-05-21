import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import * as firebase from 'firebase';
import './index.css';

function App() {
  const database = firebase.database().ref();
  const incidentsRef = database.child('incidents');
  const storage = firebase.storage().ref();
  let incidentMarkers;

  const [markerList, setMarkerList] = useState([
  ]);

  useEffect(() => {
    database.on('value', (snapshot) => {
      incidentMarkers = snapshot.child('incidents/').val();
      setMarkerList(Object.values(incidentMarkers).map((item) => item))
      })
    }, []);

  return (
    <div className="App">
      <NavBar incidentsRef={incidentsRef} storage={storage}/>
      <div className="container-fluid" id="map-container">
        <Map className="map" center={[39.8283, -98.5795]} zoom={5}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />

          {markerList.map(item => (
            <Marker key={item.key} position={[item.latitude, item.longitude]}>
              <Popup>
                <div className="marker-popup">
                  <img src={item.imgDownloadURL} alt="Photo of parking incident" className="marker-popup-photo"/>
                  <p>License Plate: {item.licensePlate}</p>
                  <p>License State: {item.state}</p>
                  <p>Comment: {item.comment}</p>
                </div>
              </Popup>
            </Marker>)
          )}
        </Map>
      </div>
    </div>
  );
}

export default App;
