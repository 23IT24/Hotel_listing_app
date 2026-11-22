const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'hotels.json');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Helper functions to read & save JSON data
const readHotels = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveHotels = (hotels) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(hotels, null, 2), 'utf8');
};

// Multer Storage Setup
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

// GET /api/hotels (Search, Filter, Pagination)
app.get('/api/hotels', (req, res) => {
  let { search, minPrice, maxPrice, page = 1, limit = 4 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  let hotels = readHotels();
  let filtered = [...hotels];

  if (search && search.trim() !== '') {
    const s = search.toLowerCase();
    filtered = filtered.filter(h => h.title.toLowerCase().includes(s));
  }

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

// GET /api/hotels/:id
app.get('/api/hotels/:id', (req, res) => {
  const hotelId = parseInt(req.params.id);
  const hotels = readHotels();
  const hotel = hotels.find(h => h.id === hotelId);

  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found!' });
  }

  res.json(hotel);
});

// POST /api/hotels (Add Hotel & save to file)
app.post('/api/hotels', upload.single('image'), (req, res) => {
  try {
    const { title, description, latitude, longitude, price } = req.body;

    if (!title || !description || !latitude || !longitude || !price) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    let image_url = '';
    if (req.file) {
      image_url = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    } else {
      return res.status(400).json({ message: 'Please upload an image file!' });
    }

    const hotels = readHotels();
    const newId = hotels.length > 0 ? Math.max(...hotels.map(h => h.id)) + 1 : 1;

    const newHotel = {
      id: newId,
      title,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      price: parseFloat(price),
      image_url,
      created_at: new Date().toISOString()
    };

    hotels.unshift(newHotel);
    saveHotels(hotels);

    res.status(201).json(newHotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/hotels/:id
app.put('/api/hotels/:id', upload.single('image'), (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const hotels = readHotels();
    const hotelIndex = hotels.findIndex(h => h.id === hotelId);

    if (hotelIndex === -1) {
      return res.status(404).json({ message: 'Hotel not found!' });
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

    saveHotels(hotels);
    res.json(hotels[hotelIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/hotels/:id
app.delete('/api/hotels/:id', (req, res) => {
  const hotelId = parseInt(req.params.id);
  const hotels = readHotels();
  const hotelIndex = hotels.findIndex(h => h.id === hotelId);

  if (hotelIndex === -1) {
    return res.status(404).json({ message: 'Hotel not found!' });
  }

  const deletedHotel = hotels.splice(hotelIndex, 1)[0];
  saveHotels(hotels);

  if (deletedHotel.image_url && deletedHotel.image_url.includes('/uploads/')) {
    const filename = deletedHotel.image_url.split('/uploads/')[1];
    const filePath = path.join(__dirname, 'uploads', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  res.json({ message: 'Hotel successfully deleted!', deletedId: hotelId });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Server running at http://localhost:${PORT}`);
});