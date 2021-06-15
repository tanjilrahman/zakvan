import { createSlice } from '@reduxjs/toolkit';

// const products = db
//   .collection('products')
//   .orderBy('timestamp', 'desc')
//   .get()
//   .then((data) => {
//     data.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//   });

const initialState = {
  products: [],
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProducts: (state, action) => {
      state.products = [...action.payload];
    },
  },
});

export const { fetchProducts } = productsSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectProducts = (state) => state.products.products;

export default productsSlice.reducer;
