import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Map = ({ tweets }) => {
    return (
        <div>
            <h1>Tweets Over The World </h1>
            <MapContainer center={[0, 0]} zoom={2} style={{ height: '50vh', width: '100%', marginTop: '8%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {tweets.map((hit) => {
                    const coordinates = hit._source.coordinates || {};
                    if (!coordinates.lat || !coordinates.lon) {
                        return null;
                    }
                    return (
                        <Marker key={hit._id} position={[coordinates.lat, coordinates.lon]}>
                            <Popup>
                                <strong>{hit._source.text}</strong>
                                <br />
                                Sentiment: {hit._source.sentiment}
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default Map;
