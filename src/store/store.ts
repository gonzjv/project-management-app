import { configureStore } from "@reduxjs/toolkit";
import authReducer  from './auth/authSlice';
import { useDispatch } from 'react-redux'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>() 