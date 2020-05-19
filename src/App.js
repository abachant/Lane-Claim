import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import * as firebase from 'firebase';
import './index.css';

function App(props) {
  let file;
  const database = firebase.database().ref();
  const incidentsRef = database.child('incidents');
  const storage = firebase.storage().ref();
  let incidentMarkers;

  const [markerList, setMarkerList] = useState([
    {name:"test1", latitude: 2.31123, longitude:35.2322, key:0},
    {name:"test2", latitude: 24.31123, longitude:34.2322, key:1},
    {name:"test3", latitude: 22.31123, longitude:38.2322, key:2},
  ]);

  // useEffect(() => {
  //   database.on('value', function(snapshot){
  //     incidentMarkers = snapshot.child('incidents/').val();
  //     // console.log(incidentMarkers)
  //     for (var i = 0; i < Object.keys(incidentMarkers).length; i++) {
  //       console.log(incidentMarkers[Object.keys(incidentMarkers)[i]])
  //       let incident = incidentMarkers[Object.keys(incidentMarkers)[i]];
  //       console.log(incident.name)

  //     }
  //   });
  // });

  return (
    <div className="App">
      <NavBar />
      <div className="container-fluid" id="map-container">
      <Map className="map" center={[39.8283, -98.5795]} zoom={5}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {markerList.map(item => (<Marker key={item.key} position={[item.latitude, item.longitude]}></Marker>))}
      </Map>
      </div>
    </div>
  );
}

export default App;
