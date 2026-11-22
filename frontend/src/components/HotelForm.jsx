import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addHotel, updateHotel, fetchHotels } from '../redux/hotelSlice';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { ArrowLeft, UploadCloud } from 'lucide-react';

const HotelForm = () => {
  const { id } = useParams();
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
        .catch(() => alert('Failed to load hotel details.'));
    }
  }, [id, isEditMode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: 'Please select a valid image file.' }));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const validate = () => {
    const err = {};
    if (!formData.title.trim()) err.title = 'Hotel title is required.';
    if (!formData.description.trim()) err.description = 'Description is required.';
    if (!formData.latitude || isNaN(formData.latitude)) err.latitude = 'Valid latitude is required (e.g. 13.0827).';
    if (!formData.longitude || isNaN(formData.longitude)) err.longitude = 'Valid longitude is required (e.g. 80.2707).';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      err.price = 'Please enter a valid price per night.';
    }
    if (!isEditMode && !imageFile) {
      err.image = 'Hotel image is required.';
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
        <title>{isEditMode ? 'Edit Hotel Listing' : 'Add New Hotel'} | StayFinder</title>
      </Helmet>

      <button onClick={() => navigate('/')} className="btn-secondary" style={{ width: 'auto', marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <ArrowLeft size={16} /> Back to Listings
      </button>

      <div style={{ background: '#ffffff', border: '1px solid #dee2e6', borderRadius: '4px', padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#212529', marginBottom: '6px' }}>
          {isEditMode ? 'Edit Hotel Listing' : 'Add New Hotel Listing'}
        </h2>
        <p style={{ color: '#6c757d', fontSize: '13px', marginBottom: '20px' }}>
          Please provide complete hotel information and coordinates for location mapping.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="filter-group">
            <label>Hotel Image {isEditMode && '(Leave empty to keep existing image)'}</label>
            <div style={{ border: '2px dashed #ced4da', borderRadius: '4px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#f8f9fa' }}>
              <input type="file" accept="image/*" onChange={handleImageChange} id="hotel-image-input" style={{ display: 'none' }} />
              <label htmlFor="hotel-image-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <UploadCloud size={28} color="#0d6efd" />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0d6efd' }}>Click to select an image</span>
                <span style={{ fontSize: '12px', color: '#6c757d' }}>Supported formats: PNG, JPG, JPEG, WEBP</span>
              </label>
            </div>
            {errors.image && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.image}</p>}

            {imagePreview && (
              <div style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Selected Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Hotel preview" 
                  style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #dee2e6' }} 
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="filter-group">
            <label>Hotel Title</label>
            <input
              type="text"
              placeholder="e.g. Grand Ocean Resort"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
            {errors.title && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.title}</p>}
          </div>

            {/* Description */}
          <div className="filter-group">
            <label>Description</label>
            <textarea
              rows="4"
              placeholder="Provide a detailed description of the hotel and amenities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #ced4da', borderRadius: '4px', resize: 'vertical' }}
            />
            {errors.description && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.description}</p>}
          </div>

          {/* Latitude & Longitude */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="filter-group">
              <label>Latitude</label>
              <input
                type="text"
                placeholder="e.g. 13.0827"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #ced4da', borderRadius: '4px' }}
              />
              {errors.latitude && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.latitude}</p>}
            </div>

            <div className="filter-group">
              <label>Longitude</label>
              <input
                type="text"
                placeholder="e.g. 80.2707"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #ced4da', borderRadius: '4px' }}
              />
              {errors.longitude && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.longitude}</p>}
            </div>
          </div>

          {/* Price */}
          <div className="filter-group">
            <label>Price per Night (₹)</label>
            <input
              type="number"
              placeholder="e.g. 4500"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
            {errors.price && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.price}</p>}
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={submitting}
            style={{ width: '100%', justifyContent: 'center', padding: '10px', marginTop: '10px' }}
          >
            {submitting ? 'Saving...' : isEditMode ? 'Update Hotel' : 'Create Hotel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HotelForm;