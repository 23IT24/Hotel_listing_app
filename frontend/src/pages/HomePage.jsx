import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotels, clearDeleteSuccess } from '../redux/hotelSlice';
import FilterSidebar from '../components/FilterSidebar';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const HomePage = () => {
  const dispatch = useDispatch();
  const { items, totalCount, loading, error, deleteSuccess, currentPage } = useSelector((state) => state.hotels);

  useEffect(() => {
    dispatch(fetchHotels({ page: currentPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (deleteSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearDeleteSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteSuccess, dispatch]);

  return (
    <>
      <Helmet>
        <title>Explore Hotels & Resorts | StayFinder</title>
        <meta name="description" content="Browse curated luxury and budget hotels with geolocation map integration and instant booking." />
      </Helmet>

      {/* Delete Notification Toast */}
      {deleteSuccess && (
        <div className="alert-popup">
          <CheckCircle2 size={16} />
          <span>Hotel record has been successfully deleted!</span>
        </div>
      )}

      <div className="page-layout">
        <FilterSidebar />

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#212529' }}>
              Available Hotels <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: '400' }}>({totalCount} listings found)</span>
            </h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#6c757d' }}>
              <p>Loading available hotels, please wait...</p>
            </div>
          ) : error ? (
            <div style={{ background: '#f8d7da', border: '1px solid #f5c2c7', padding: '14px', borderRadius: '4px', color: '#842029', display: 'flex', gap: '8px' }}>
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', background: '#ffffff', borderRadius: '4px', border: '1px solid #dee2e6' }}>
              <h3 style={{ fontSize: '16px', color: '#212529' }}>No hotels match your search criteria.</h3>
              <p style={{ color: '#6c757d', marginTop: '6px' }}>Try resetting or modifying your filters.</p>
            </div>
          ) : (
            <div className="hotels-grid">
              {items.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}

          <Pagination />
        </div>
      </div>
    </>
  );
};

export default HomePage;