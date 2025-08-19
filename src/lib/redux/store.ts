import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './reducers/productsSlice'
import articlesReducer from './reducers/articlesSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    articles: articlesReducer,
  },
  preloadedState: {},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
