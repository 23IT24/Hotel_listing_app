import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage, fetchHotels } from '../redux/hotelSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = () => {
  const dispatch = useDispatch();
  const { currentPage, totalPages, searchQuery, minPrice, maxPrice } = useSelector((state) => state.hotels);

 
  if (totalPages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
      dispatch(fetchHotels({ search: searchQuery, minPrice, maxPrice, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers [1, 2, 3...]
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      {/* Previous Button */}
      <button 
        className="page-btn"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Number Buttons */}
      {pages.map((p) => (
        <button
          key={p}
          className={`page-btn ${currentPage === p ? 'active' : ''}`}
          onClick={() => handlePageChange(p)}
        >
          {p}
        </button>
      ))}

      {/* Next Button */}
      <button 
        className="page-btn"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;