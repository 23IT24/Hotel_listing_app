const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Multer Setup (Image Upload Storage) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
   
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
   
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});


let hotels = [
  {
    id: 1,
    title: "Grand Ocean Resort",
    description: "Beachfront luxury resort with ocean views, private beach access, and multi-cuisine restaurant.",
    latitude: 13.0827,
    longitude: 80.2707,
    price: 4500,
    image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Mountain Mist Villa",
    description: "Peaceful hillside cottage surrounded by tea estates, misty mornings, and trekking trails.",
    latitude: 11.4102,
    longitude: 76.6950,
    price: 3200,
    image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=60",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "City Center Executive Suites",
    description: "Modern business hotel located in the heart of the city with high-speed WiFi and conference halls.",
    latitude: 12.9716,
    longitude: 77.5946,
    price: 2800,
    image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=60",
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "Heritage Palace Residency",
    description: "Experience royal luxury with traditional architecture, courtyards, and royal spa amenities.",
    latitude: 9.9252,
    longitude: 78.1198,
    price: 5500,
    image_url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=60",
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title: "Lakeview Serenity Cottages",
    description: "Calm and scenic lakeside wooden cottages ideal for family weekends and campfire nights.",
    latitude: 10.2381,
    longitude: 77.4892,
    price: 3800,
    image_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=60",
    created_at: new Date().toISOString()
  }
];

let nextId = 6;

// --- API Endpoints ---

// 1. GET ALL HOTELS (With Search, Price Filter & Pagination)

app.get('/api/hotels', (req, res) => {
  let { search, minPrice, maxPrice, page = 1, limit = 4 } = req.query;
  
  page = parseInt(page);
  limit = parseInt(limit);

  let filtered = [...hotels];

  // Title search filter
  if (search && search.trim() !== '') {
    const s = search.toLowerCase();
    filtered = filtered.filter(h => h.title.toLowerCase().includes(s));
  }

  // Price range filter
  if (minPrice !== undefined && minPrice !== '') {
    filtered = filtered.filter(h => Number(h.price) >= Number(minPrice));
  }
  if (maxPrice !== undefined && maxPrice !== '') {
    filtered = filtered.filter(h => Number(h.price) <= Number(maxPrice));
  }

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const paginatedHotels = filtered.slice(startIndex, startIndex + limit);

  res.json({
    hotels: paginatedHotels,
    totalCount,
    totalPages,
    currentPage: page
  });
});

// 2. GET SINGLE HOTEL BY ID (Detail Page-kaga)

app.get('/api/hotels/:id', (req, res) => {
  const hotelId = parseInt(req.params.id);
  const hotel = hotels.find(h => h.id === hotelId);

  if (!hotel) {
    return res.status(404).json({ message: "Hotel not found!" });
  }

  res.json(hotel);
});

// 3. CREATE HOTEL (With Image Upload)

app.post('/api/hotels', upload.single('image'), (req, res) => {
  try {
    const { title, description, latitude, longitude, price } = req.body;

  
    if (!title || !description || !latitude || !longitude || !price) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    let image_url = '';
    if (req.file) {
      
      image_url = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    } else {
      return res.status(400).json({ message: "Please uplaod an image file!" });
    }

    const newHotel = {
      id: nextId++,
      title,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      price: parseFloat(price),
      image_url,
      created_at: new Date().toISOString()
    };

    hotels.unshift(newHotel); 
    res.status(201).json(newHotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. UPDATE HOTEL BY ID

app.put('/api/hotels/:id', upload.single('image'), (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const hotelIndex = hotels.findIndex(h => h.id === hotelId);

    if (hotelIndex === -1) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const { title, description, latitude, longitude, price } = req.body;
    const existing = hotels[hotelIndex];

    let image_url = existing.image_url;
    
    if (req.file) {
      image_url = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    }

    hotels[hotelIndex] = {
      ...existing,
      title: title || existing.title,
      description: description || existing.description,
      latitude: latitude ? parseFloat(latitude) : existing.latitude,
      longitude: longitude ? parseFloat(longitude) : existing.longitude,
      price: price ? parseFloat(price) : existing.price,
      image_url,
      updated_at: new Date().toISOString()
    };

    res.json(hotels[hotelIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. DELETE HOTEL BY ID

app.delete('/api/hotels/:id', (req, res) => {
  const hotelId = parseInt(req.params.id);
  const hotelIndex = hotels.findIndex(h => h.id === hotelId);

  if (hotelIndex === -1) {
    return res.status(404).json({ message: "Hotel not found" });
  }

  const deletedHotel = hotels.splice(hotelIndex, 1)[0];

  
  if (deletedHotel.image_url && deletedHotel.image_url.includes('/uploads/')) {
    const filename = deletedHotel.image_url.split('/uploads/')[1];
    const filePath = path.join(__dirname, 'uploads', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  res.json({ message: "Hotel successfully deleted!", deletedId: hotelId });
});


app.listen(PORT, () => {
  console.log(`🚀 Backend Server running at http://localhost:${PORT}`);
});