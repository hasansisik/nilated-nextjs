import { createReducer } from "@reduxjs/toolkit";
import {
  getAllServices,
  getSingleService,
  createService,
  updateService,
  deleteService,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../actions/serviceActions";

interface ServiceState {
  services: any[];
  service: any;
  categories: any[];
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const initialState: ServiceState = {
  services: [],
  service: {},
  categories: [],
  loading: false,
  error: null,
  success: false,
  message: null
};

export const serviceReducer = createReducer(initialState, (builder) => {
  builder
    // ==================== SERVICE REDUCERS ====================
    
    // Get All Services
    .addCase(getAllServices.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllServices.fulfilled, (state, action) => {
      state.loading = false;
      state.services = action.payload;
      state.error = null;
    })
    .addCase(getAllServices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Get Single Service
    .addCase(getSingleService.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getSingleService.fulfilled, (state, action) => {
      state.loading = false;
      state.service = action.payload;
      state.error = null;
    })
    .addCase(getSingleService.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Create Service
    .addCase(createService.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(createService.fulfilled, (state, action) => {
      state.loading = false;
      state.services = [action.payload, ...state.services];
      state.success = true;
      state.message = "Servis başarıyla oluşturuldu";
      state.error = null;
    })
    .addCase(createService.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Update Service
    .addCase(updateService.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateService.fulfilled, (state, action) => {
      state.loading = false;
      state.services = state.services.map(service => 
        service._id === action.payload._id ? action.payload : service
      );
      if (state.service._id === action.payload._id) {
        state.service = action.payload;
      }
      state.success = true;
      state.message = "Servis başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateService.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Delete Service
    .addCase(deleteService.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(deleteService.fulfilled, (state, action) => {
      state.loading = false;
      state.services = state.services.filter(service => service._id !== action.payload);
      state.success = true;
      state.message = "Servis başarıyla silindi";
      state.error = null;
    })
    .addCase(deleteService.rejected, (state, action) => {
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

export default serviceReducer; 