import React from 'react';
import NavBar from './components/NavBar';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import './index.css';

function App() {
  return (
    <div className="App">
      <NavBar />
      <div className="container-fluid" id="map-container">
        <Map className="map" center={[39.8283, -98.5795]} zoom={5}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
        </Map>
      </div>
    </div>
  );
}

export default App;
