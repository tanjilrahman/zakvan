import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../slices/cartSlice';
import categoryReducer from '../slices/categorySlice';
import wishReducer from '../slices/wishSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    category: categoryReducer,
    wish: wishReducer,
  },
});
