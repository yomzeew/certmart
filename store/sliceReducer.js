import { createSlice } from '@reduxjs/toolkit';

const activePageSlice = createSlice({
  name: 'activePage',
  initialState: { 
    page: 'Home',
    email: '',
    user: null, // Add a user object to store login data
  },
  reducers: {
    setActivePage: (state, action) => {
      state.page = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    login: (state, action) => {
      state.user = action.payload; // Save the full user data
      state.email = action.payload.email; // Optional: also update email
    },
    logout: (state) => {
      state.user = null;
      state.email = '';
    },
  },
});

export const { setActivePage, setEmail, login, logout } = activePageSlice.actions;
export default activePageSlice.reducer;
