// src/redux/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const response = await axios.get("http://localhost:5000/api/products");
  return response.data;
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    favorites: [],
    loading: false,
    error: null,
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const productId = action.payload;
      if (state.favorites.includes(productId)) {
        state.favorites = state.favorites.filter((id) => id !== productId);
      } else {
        state.favorites.push(productId);
      }
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { toggleFavorite } = productsSlice.actions;
export default productsSlice.reducer;
