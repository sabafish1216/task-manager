import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import categoryReducer from './categorySlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    categories: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 