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

  // Initial fetch
  useEffect(() => {
    dispatch(fetchHotels({ page: currentPage }));
  }, [dispatch, currentPage]);

  // Delete popup auto dismiss (3 seconds)
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
      {/* 1. SEO Dynamic Meta Tags */}
      <Helmet>
        <title>Explore Best Hotels & Resorts | StayFinder</title>
        <meta name="description" content="Browse curated luxury and budget-friendly hotels with verified reviews, maps, and direct booking." />
      </Helmet>

      {/* 2. Success Delete Alert Popup */}
      {deleteSuccess && (
        <div className="alert-popup">
          <CheckCircle2 size={18} />
          <span>Hotel record successfully deleted from server!</span>
        </div>
      )}

      {/* 3. Main Page Layout */}
      <div className="page-layout">
        {/* Left Side: Search & Price Filter */}
        <FilterSidebar />

        {/* Right Side: Hotels List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
              Available Hotels <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>({totalCount} found)</span>
            </h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
              <p>Hotels load aagudhu, please wait...</p>
            </div>
          ) : error ? (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '8px', color: '#b91c1c', display: 'flex', gap: '8px' }}>
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', color: '#334155' }}>Endha hotel-um kedaikkala!</h3>
              <p style={{ color: '#64748b', marginTop: '6px' }}>Filter settings maathi try pannunga.</p>
            </div>
          ) : (
            <div className="hotels-grid">
              {items.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination />
        </div>
      </div>
    </>
  );
};

export default HomePage;