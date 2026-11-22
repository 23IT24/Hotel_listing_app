import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ArrowLeft, MapPin, Tag, Calendar, Edit } from 'lucide-react';
import L from 'leaflet';

// Fix for default Leaflet marker icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const HotelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/hotels/${id}`)
      .then((res) => {
        setHotel(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
        <p>Loading hotel details...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2>Hotel Not Found!</h2>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '16px' }}>
          Back to Listings
        </button>
      </div>
    );
  }

  const lat = parseFloat(hotel.latitude);
  const lng = parseFloat(hotel.longitude);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* 1. SEO Dynamic Meta Tags with React Helmet */}
      <Helmet>
        <title>{`${hotel.title} - Book at ₹${hotel.price} | StayFinder`}</title>
        <meta name="description" content={hotel.description.slice(0, 150)} />
      </Helmet>

      {/* Back Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Back to All Hotels
        </button>
        <button onClick={() => navigate(`/edit/${hotel.id}`)} className="btn-icon-edit" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Edit size={14} /> Edit This Hotel
        </button>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        {/* Large Hero Image with SEO Alt Tag */}
        <div style={{ height: '380px', width: '100%', background: '#e2e8f0' }}>
          <img 
            src={hotel.image_url} 
            alt={`Detailed view of ${hotel.title}`} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        {/* Content Body */}
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                {hotel.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px' }}>
                <MapPin size={16} color="#0284c7" />
                <span>Coordinates: {lat}, {lng}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0284c7' }}>
                ₹{Number(hotel.price).toLocaleString()}
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}> / night</span>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '24px 0' }} />

          {/* Description Section */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
              About this property
            </h3>
            <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '15px' }}>
              {hotel.description}
            </p>
          </div>

          {/* Interactive Leaflet Map Section */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#0284c7" />
              Property Location on Map
            </h3>

            <div style={{ height: '350px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
              <MapContainer 
                center={[lat, lng]} 
                zoom={14} 
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                  <Popup>
                    <strong>{hotel.title}</strong> <br /> ₹{hotel.price} / night
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HotelDetailPage;