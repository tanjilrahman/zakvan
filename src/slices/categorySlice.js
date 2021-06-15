import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selected: { category: 'New In', scroll: false },
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    changeCategory: (state, action) => {
      state.selected.category = action.payload;
    },
    scrollToView: (state, action) => {
      state.selected.scroll = action.payload;
    },
  },
});

export const { changeCategory, scrollToView } = categorySlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectCategory = (state) => state.category.selected.category;

export const selectScroll = (state) => state.category.selected.scroll;

// export const selectTotal = (state) =>
//   state.basket.items.reduce((total, item) => total + Number(item.price), 0);

export default categorySlice.reducer;
