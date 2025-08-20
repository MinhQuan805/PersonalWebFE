// lib/redux/reducers/productsSlice.ts
import { ProductDTO } from '@/types/product.dto'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import products from '@/data/products.json';
import axios from 'axios'

interface ProductsState {
  data: ProductDTO[]
  loading: boolean
  error: string | null
}

const initialState: ProductsState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchProducts = createAsyncThunk<ProductDTO[]>('products/fetchProducts', async () => {
  // const res = await axios.get(`${process.env.NEXT_PUBLIC_API_GET}/products`)
  // return res.data;
  return products;
})

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Có lỗi xảy ra'
      })
  },
})

export default productsSlice.reducer
