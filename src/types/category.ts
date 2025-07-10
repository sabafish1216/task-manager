export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
} 