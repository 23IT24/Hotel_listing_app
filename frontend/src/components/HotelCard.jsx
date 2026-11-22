import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteHotel } from '../redux/hotelSlice';
import { MapPin, Edit3, Trash2, ArrowRight } from 'lucide-react';

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = (e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(`Are you sure you want to delete "${hotel.title}"?`);
    if (confirmDelete) {
      dispatch(deleteHotel(hotel.id));
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit/${hotel.id}`);
  };

  return (
    <div 
      className="hotel-card"
      onClick={() => navigate(`/hotel/${hotel.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-image-wrap">
        <img 
          src={hotel.image_url} 
          alt={`Exterior view of ${hotel.title}`} 
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60';
          }}
        />
      </div>

      <div className="card-body">
        <div>
          <div className="hotel-card-header">
            <h3 className="hotel-title">{hotel.title}</h3>
            <div className="hotel-price">
              ₹{Number(hotel.price).toLocaleString()}
              <small> / night</small>
            </div>
          </div>

          <div className="hotel-coords">
            <MapPin size={14} color="#0d6efd" />
            <span>Coordinates: {Number(hotel.latitude).toFixed(4)}, {Number(hotel.longitude).toFixed(4)}</span>
          </div>

          <p className="hotel-desc-snippet">
            {hotel.description}
          </p>
        </div>

        <div className="card-footer">
          <span 
            style={{ 
              fontSize: '13px', 
              color: '#0d6efd', 
              fontWeight: '600', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px' 
            }}
          >
            View Details & Map <ArrowRight size={14} />
          </span>

          <div className="card-actions">
            <button 
              className="btn-icon-edit" 
              onClick={handleEdit}
              title="Edit Hotel"
            >
              <Edit3 size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Edit
            </button>
            <button 
              className="btn-icon-delete" 
              onClick={handleDelete}
              title="Delete Hotel"
            >
              <Trash2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;