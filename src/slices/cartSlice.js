import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    removeFromCart: (state, action) => {
      const index = state.items.findIndex(
        (cartItem) => cartItem.id === action.payload.id
      );

      let newCart = [...state.items];

      if (index >= 0) {
        newCart.splice(index, 1);
      } else {
        console.warn('Cant remove product.');
      }

      state.items = newCart;
    },
    updateCart: (state, action) => {
      let item = state.items.find((item) => item.id === action.payload.id);

      const restOfTheItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );

      item.quantity = action.payload.quantity;

      state.items = [...restOfTheItems, item];
    },
  },
});

export const { addToCart, removeFromCart, updateCart } = cartSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectCartItems = (state) => state.cart.items;

// export const selectTotal = (state) =>
//   state.basket.items.reduce((total, item) => total + Number(item.price), 0);

export default cartSlice.reducer;
