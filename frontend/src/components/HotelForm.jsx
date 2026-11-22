import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addHotel, updateHotel, fetchHotels } from '../redux/hotelSlice';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { ArrowLeft, UploadCloud, AlertCircle } from 'lucide-react';

const HotelForm = () => {
  const { id } = useParams(); // If id exists -> Edit mode, else -> Add mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    latitude: '',
    longitude: '',
    price: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // If Edit mode, fetch current hotel details
  useEffect(() => {
    if (isEditMode) {
      axios.get(`http://localhost:5000/api/hotels/${id}`)
        .then((res) => {
          setFormData({
            title: res.data.title,
            description: res.data.description,
            latitude: res.data.latitude,
            longitude: res.data.longitude,
            price: res.data.price
          });
          setImagePreview(res.data.image_url);
        })
        .catch(() => alert('Hotel data load panna mudiyala!'));
    }
  }, [id, isEditMode]);

  // Handle image upload & preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: 'Please select a valid image file!' }));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Live Instant Preview
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  // Form Validation
  const validate = () => {
    const err = {};
    if (!formData.title.trim()) err.title = 'Hotel Title thevai!';
    if (!formData.description.trim()) err.description = 'Description thevai!';
    if (!formData.latitude || isNaN(formData.latitude)) err.latitude = 'Valid Latitude thevai (e.g. 13.0827)!';
    if (!formData.longitude || isNaN(formData.longitude)) err.longitude = 'Valid Longitude thevai (e.g. 80.2707)!';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      err.price = 'Valid price per night thevai!';
    }
    if (!isEditMode && !imageFile) {
      err.image = 'Hotel image upload pannanum!';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('latitude', formData.latitude);
    data.append('longitude', formData.longitude);
    data.append('price', formData.price);

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (isEditMode) {
        await dispatch(updateHotel({ id, formData: data })).unwrap();
      } else {
        await dispatch(addHotel(data)).unwrap();
      }
      dispatch(fetchHotels());
      navigate('/');
    } catch (err) {
      alert(err || 'Action failed!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <Helmet>
        <title>{isEditMode ? 'Edit Hotel Details' : 'Add New Hotel'} | StayFinder</title>
      </Helmet>

      <button onClick={() => navigate('/')} className="btn-secondary" style={{ width: 'auto', marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <ArrowLeft size={16} /> Back to Listings
      </button>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
          {isEditMode ? 'Edit Hotel Details' : 'Add New Hotel'}
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
          Fill in the details below to {isEditMode ? 'update' : 'publish'} this hotel listing.
        </p>

        <form onSubmit={handleSubmit}>
          {/* 1. Image Upload & Preview */}
          <div className="filter-group">
            <label>Hotel Image {isEditMode && '(Leave empty to keep current image)'}</label>
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}>
              <input type="file" accept="image/*" onChange={handleImageChange} id="hotel-image-input" style={{ display: 'none' }} />
              <label htmlFor="hotel-image-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <UploadCloud size={32} color="#0284c7" />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0284c7' }}>Click to choose image</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>PNG, JPG or WEBP</span>
              </label>
            </div>
            {errors.image && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px' }}>{errors.image}</p>}

            {/* Live Image Preview */}
            {imagePreview && (
              <div style={{ marginTop: '14px' }}>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Image Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Hotel preview" 
                  style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                />
              </div>
            )}
          </div>

          {/* 2. Hotel Title */}
          <div className="filter-group">
            <label>Hotel Title</label>
            <input
              type="text"
              placeholder="e.g. Grand Ocean Resort"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
            />
            {errors.title && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.title}</p>}
          </div>

          {/* 3. Description */}
          <div className="filter-group">
            <label>Description</label>
            <textarea
              rows="4"
              placeholder="Describe the hotel amenities, view, and location..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', resize: 'vertical' }}
            />
            {errors.description && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.description}</p>}
          </div>

          {/* 4. Latitude & Longitude */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="filter-group">
              <label>Latitude</label>
              <input
                type="text"
                placeholder="e.g. 13.0827"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
              />
              {errors.latitude && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.latitude}</p>}
            </div>

            <div className="filter-group">
              <label>Longitude</label>
              <input
                type="text"
                placeholder="e.g. 80.2707"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
              />
              {errors.longitude && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.longitude}</p>}
            </div>
          </div>

          {/* 5. Price */}
          <div className="filter-group">
            <label>Price per Night (₹)</label>
            <input
              type="number"
              placeholder="e.g. 4500"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
            />
            {errors.price && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.price}</p>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={submitting}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}
          >
            {submitting ? 'Saving...' : isEditMode ? 'Update Hotel' : 'Create Hotel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HotelForm;