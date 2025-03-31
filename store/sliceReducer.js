// redux/activePageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const activePageSlice = createSlice({
  name: 'activePage',
  initialState: { 
    page: 'Home',
    email:'',
  }, // Default active page
  reducers: {
    setActivePage: (state, action) => {
      state.page = action.payload;
    },
    setEmail:(state,action)=>{
      state.email = action.payload; 
    }
  },
});

export const { setActivePage,setEmail } = activePageSlice.actions;
export default activePageSlice.reducer;
