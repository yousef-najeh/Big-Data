import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

const Map = ({ tweets }) => {
    const [selectedTweet, setSelectedTweet] = useState(null);
    const [modalData, setModalData] = useState(null);

    const handleMarkerClick = async (tweet) => {
        setSelectedTweet(tweet);
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/tweets/${tweet._id}`);
            const data = await response.json();
            setModalData(data._source);
        } catch (error) {
            console.error('Error fetching tweet details:', error);
        }
    };

    const handleClose = () => {
        setSelectedTweet(null);
        setModalData(null);
    };

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
                        <Marker
                            key={hit._id}
                            position={[coordinates.lat, coordinates.lon]}
                            eventHandlers={{
                                click: () => handleMarkerClick(hit),
                            }}
                        />
                    );
                })}
                {selectedTweet && (
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Tweet Details</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                                </div>
                                <div className="modal-body">
                                    {modalData ? (
                                        <div>
                                            <p><strong>Tweet:</strong> {modalData.text}</p>
                                            <p><strong>Created At:</strong> {modalData.created_at}</p>
                                            <p><strong>Sentiment:</strong> {modalData.sentiment}</p>
                                        </div>
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </MapContainer>
        </div>
    );
};

export default Map;
