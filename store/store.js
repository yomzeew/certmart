// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import activePageReducer from './sliceReducer';

const store = configureStore({
  reducer: {
    activePage: activePageReducer,
  },
});

export default store;
