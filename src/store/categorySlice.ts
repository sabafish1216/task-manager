import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, CategoryState } from '../types/category';

const defaultCategories: Category[] = [
  {
    id: '1',
    name: '仕事',
    color: '#1976d2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'プライベート',
    color: '#dc004e',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: '学習',
    color: '#388e3c',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialState: CategoryState = {
  categories: defaultCategories,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>) => {
      console.log('addCategory reducer called', action.payload);
      const newCategory: Category = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log('New category created', newCategory);
      state.categories.push(newCategory);
      console.log('Categories after push', state.categories);
    },
    updateCategory: (state, action: PayloadAction<{ id: string; updates: Partial<Omit<Category, 'id' | 'createdAt'>> }>) => {
      const { id, updates } = action.payload;
      const categoryIndex = state.categories.findIndex(category => category.id === id);
      if (categoryIndex !== -1) {
        state.categories[categoryIndex] = {
          ...state.categories[categoryIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(category => category.id !== action.payload);
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer; 