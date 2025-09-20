import { createReducer } from "@reduxjs/toolkit";
import {
  getAllHizmetler,
  getSingleHizmet,
  createHizmet,
  updateHizmet,
  deleteHizmet,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../actions/hizmetActions";

interface HizmetState {
  hizmetler: any[];
  hizmet: any;
  categories: any[];
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const initialState: HizmetState = {
  hizmetler: [],
  hizmet: {},
  categories: [],
  loading: false,
  error: null,
  success: false,
  message: null
};

export const hizmetReducer = createReducer(initialState, (builder) => {
  builder
    // ==================== HIZMET REDUCERS ====================
    
    // Get All Hizmetler
    .addCase(getAllHizmetler.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllHizmetler.fulfilled, (state, action) => {
      state.loading = false;
      state.hizmetler = action.payload;
      state.error = null;
    })
    .addCase(getAllHizmetler.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Get Single Hizmet
    .addCase(getSingleHizmet.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getSingleHizmet.fulfilled, (state, action) => {
      state.loading = false;
      state.hizmet = action.payload;
      state.error = null;
    })
    .addCase(getSingleHizmet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Create Hizmet
    .addCase(createHizmet.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(createHizmet.fulfilled, (state, action) => {
      state.loading = false;
      state.hizmetler = [action.payload, ...state.hizmetler];
      state.success = true;
      state.message = "Hizmet başarıyla oluşturuldu";
      state.error = null;
    })
    .addCase(createHizmet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Update Hizmet
    .addCase(updateHizmet.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateHizmet.fulfilled, (state, action) => {
      state.loading = false;
      state.hizmetler = state.hizmetler.map(hizmet => 
        hizmet._id === action.payload._id ? action.payload : hizmet
      );
      if (state.hizmet._id === action.payload._id) {
        state.hizmet = action.payload;
      }
      state.success = true;
      state.message = "Hizmet başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateHizmet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Delete Hizmet
    .addCase(deleteHizmet.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(deleteHizmet.fulfilled, (state, action) => {
      state.loading = false;
      state.hizmetler = state.hizmetler.filter(hizmet => hizmet._id !== action.payload);
      state.success = true;
      state.message = "Hizmet başarıyla silindi";
      state.error = null;
    })
    .addCase(deleteHizmet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // ==================== CATEGORY REDUCERS ====================
    
    // Get All Categories
    .addCase(getAllCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload;
      state.error = null;
    })
    .addCase(getAllCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Create Category
    .addCase(createCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(createCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = [...state.categories, action.payload];
      state.success = true;
      state.message = "Kategori başarıyla oluşturuldu";
      state.error = null;
    })
    .addCase(createCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Update Category
    .addCase(updateCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = state.categories.map(category => 
        category._id === action.payload._id ? action.payload : category
      );
      state.success = true;
      state.message = "Kategori başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Delete Category
    .addCase(deleteCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(deleteCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = state.categories.filter(category => category._id !== action.payload);
      state.success = true;
      state.message = "Kategori başarıyla silindi";
      state.error = null;
    })
    .addCase(deleteCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default hizmetReducer; 