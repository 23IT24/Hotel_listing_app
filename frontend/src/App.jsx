import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HotelDetailPage from './pages/HotelDetailPage';
import HotelForm from './components/HotelForm';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar />

      {/* Main SPA Pages */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotel/:id" element={<HotelDetailPage />} />
          <Route path="/add" element={<HotelForm />} />
          <Route path="/edit/:id" element={<HotelForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;