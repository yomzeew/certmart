// redux/activePageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const activePageSlice = createSlice({
  name: 'activePage',
  initialState: { page: 'Home' }, // Default active page
  reducers: {
    setActivePage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { setActivePage } = activePageSlice.actions;
export default activePageSlice.reducer;
