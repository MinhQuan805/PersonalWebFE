import { configureStore } from '@reduxjs/toolkit';
import alertReducer from '@/redux/reducer/alertReducer';

export const store = configureStore({
  reducer: {
    alert: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
