import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/hotels';

// 1. Fetch hotels with search, price filters, and pagination
export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async ({ search = '', minPrice = '', maxPrice = '', page = 1, limit = 4 } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    params.append('page', page);
    params.append('limit', limit);

    const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);
    return response.data;
  }
);

// 2. Add new hotel
export const addHotel = createAsyncThunk(
  'hotels/addHotel',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_BASE_URL, formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create hotel listing');
    }
  }
);

// 3. Update existing hotel
export const updateHotel = createAsyncThunk(
  'hotels/updateHotel',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update hotel listing');
    }
  }
);

// 4. Delete hotel
export const deleteHotel = createAsyncThunk(
  'hotels/deleteHotel',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete hotel listing');
    }
  }
);

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: {
    items: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,
    searchQuery: '',
    minPrice: '',
    maxPrice: '',
    deleteSuccess: false
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setPriceFilter: (state, action) => {
      state.minPrice = action.payload.minPrice;
      state.maxPrice = action.payload.maxPrice;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearDeleteSuccess: (state) => {
      state.deleteSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch hotels cases
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.hotels;
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete hotel
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.totalCount -= 1;
        state.deleteSuccess = true;
      });
  }
});

export const { setSearchQuery, setPriceFilter, setCurrentPage, clearDeleteSuccess } = hotelSlice.actions;
export default hotelSlice.reducer;