# 🏨 StayFinder - Hotel Listing Web Application (CRUD)

A responsive Single Page Application (SPA) built with **ReactJS**, **Redux Toolkit**, and **Node.js/Express**. This project allows users to browse, search, filter, paginate, add, edit, and delete hotel listings with image upload capability and geolocation map integration.

---

## 🚀 Features

### Frontend (React + Redux)
- **Reusable Form Component**: Single unified form for both adding and updating hotel listings with client-side validation.
- **Image Upload & Live Preview**: Real-time image preview before submitting hotel records.
- **Card-based Responsive Layout**: Modern, human-crafted card design featuring exterior images, pricing, coordinate badges, and description snippets.
- **Search & Price Range Filters**: Filter hotels by title search and minimum/maximum price per night.
- **Pagination Support**: Smooth paginated results with page navigation controls.
- **Interactive Detail Page**: Dedicated view with Leaflet & OpenStreetMap pinpointing hotel coordinates (Latitude/Longitude).
- **SEO & Accessibility Optimization**: Dynamic meta tags powered by `react-helmet-async` and semantic image `alt` attributes.
- **Delete Confirmation & Toast Notification**: Prompt confirmation dialog with auto-dismissing success alert.

### Backend (Node.js + Express)
- **RESTful API Architecture**: Complete CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE`).
- **Local Server File Storage**: Multipart image uploads handled securely using `multer`.
- **Query Parameter Filtering**: Server-side filtering for search query, price ranges, and pagination limits.
- **Persistent Data Store**: JSON-based storage engine ensuring data durability across server restarts.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Redux Toolkit, React-Redux, React Router DOM, React Helmet Async, Leaflet, React-Leaflet, Lucide React
- **Backend**: Node.js, Express.js, Multer, CORS
- **Storage**: Local server disk storage for uploaded media & persistent JSON database

---

## 📁 Project Structure

```text
hotel-listing-app/
├── backend/
│   ├── uploads/            # Server-stored hotel images
│   ├── hotels.json         # Persistent database records
│   ├── server.js           # Express server & API endpoints
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, HotelCard, HotelForm, Pagination, FilterSidebar)
│   │   ├── pages/          # SPA pages (HomePage, HotelDetailPage)
│   │   ├── redux/          # Redux Toolkit store & hotelSlice
│   │   ├── App.jsx         # Client routing
│   │   ├── App.css         # Clean, human-crafted styles
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

---

## ⚙️ Installation & Setup Instructions

Follow these simple steps to run the application locally:

### 1. Clone the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/hotel-listing-app.git
cd hotel-listing-app
```

### 2. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
> Backend runs at: `http://localhost:5000`

### 3. Start the Frontend Application
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
> Frontend application will launch at: `http://localhost:5173`

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/hotels` | Fetch hotels with optional search, minPrice, maxPrice, and page params |
| `GET` | `/api/hotels/:id` | Fetch single hotel details by ID |
| `POST` | `/api/hotels` | Create new hotel record with multipart image upload |
| `PUT` | `/api/hotels/:id` | Update existing hotel details and optional new image |
| `DELETE` | `/api/hotels/:id` | Delete hotel record and clean up associated image file |