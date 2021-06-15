import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

export const wishSlice = createSlice({
  name: 'wish',
  initialState,
  reducers: {
    addToList: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    removeFromList: (state, action) => {
      const index = state.items.findIndex(
        (wishItem) => wishItem.id === action.payload.id
      );

      let newWish = [...state.items];

      if (index >= 0) {
        newWish.splice(index, 1);
      } else {
        console.warn('Cant remove product.');
      }

      state.items = newWish;
    },
  },
});

export const { addToList, removeFromList } = wishSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.wish.items;

export default wishSlice.reducer;
