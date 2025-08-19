// lib/redux/reducers/articlesSlice.ts
import { ArticleDTO } from '@/types/article.dto'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface ArticlesState {
  data: ArticleDTO[]
  loading: boolean
  error: string | null
}

const initialState: ArticlesState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchArticles = createAsyncThunk<ArticleDTO[]>('articles/fetchArticles', async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_GET}/articles`)
  return res.data
})

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Có lỗi xảy ra'
      })
  },
})

export default articlesSlice.reducer
