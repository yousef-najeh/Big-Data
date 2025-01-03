import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Map = ({ tweets }) => {
  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {tweets.map((tweet, index) => (
        <Marker key={index} position={[tweet.lat, tweet.lon]}>
          <Popup>
            <strong>{tweet.text}</strong>
            <br />
            Sentiment: {tweet.sentiment}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
