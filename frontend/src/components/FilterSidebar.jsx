import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels, setSearchQuery, setPriceFilter, setCurrentPage } from '../redux/hotelSlice';
import { Search, Filter, RotateCcw } from 'lucide-react';

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { searchQuery, minPrice, maxPrice } = useSelector((state) => state.hotels);

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  // Apply filters button
  const handleApplyFilter = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
    dispatch(setPriceFilter({ minPrice: localMin, maxPrice: localMax }));
    dispatch(setCurrentPage(1)); 
    dispatch(fetchHotels({ search: localSearch, minPrice: localMin, maxPrice: localMax, page: 1 }));
  };

  // Reset filters button
  const handleReset = () => {
    setLocalSearch('');
    setLocalMin('');
    setLocalMax('');
    dispatch(setSearchQuery(''));
    dispatch(setPriceFilter({ minPrice: '', maxPrice: '' }));
    dispatch(setCurrentPage(1));
    dispatch(fetchHotels({ search: '', minPrice: '', maxPrice: '', page: 1 }));
  };

  return (
    <aside className="filter-card">
      <h3 className="filter-title">Filters</h3>

      <form onSubmit={handleApplyFilter}>
        {/* 1. Search by Hotel Name */}
        <div className="filter-group">
          <label>Search Hotel</label>
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="e.g. Ocean, Resort..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </div>

        {/* 2. Price Range Filter */}
        <div className="filter-group">
          <label>Price Range (₹)</label>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
            />
            <span style={{ color: '#94a3b8' }}>-</span>
            <input
              type="number"
              placeholder="Max"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
            <Filter size={16} />
            <span>Apply Filters</span>
          </button>
          
          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <RotateCcw size={14} />
            <span>Reset All</span>
          </button>
        </div>
      </form>
    </aside>
  );
};

export default FilterSidebar;