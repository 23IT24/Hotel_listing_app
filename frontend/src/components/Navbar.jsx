import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand Logo & Name */}
        <Link to="/" className="nav-brand">
          <Building2 size={26} color="#38bdf8" />
          <span>StayFinder</span>
        </Link>

        {/* Add Hotel Button */}
        <div className="nav-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate('/add')}
          >
            <PlusCircle size={18} />
            <span>Add Hotel</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;