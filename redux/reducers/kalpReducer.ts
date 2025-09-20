import { createReducer } from "@reduxjs/toolkit";
import {
  getAllKalpler,
  getSingleKalp,
  createKalp,
  updateKalp,
  deleteKalp
} from "../actions/kalpActions";

interface KalpState {
  kalpler: any[];
  kalp: any;
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const initialState: KalpState = {
  kalpler: [],
  kalp: {},
  loading: false,
  error: null,
  success: false,
  message: null
};

export const kalpReducer = createReducer(initialState, (builder) => {
  builder
    // ==================== KALP REDUCERS ====================
    
    // Get All Kalpler
    .addCase(getAllKalpler.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllKalpler.fulfilled, (state, action) => {
      state.loading = false;
      state.kalpler = action.payload;
      state.error = null;
    })
    .addCase(getAllKalpler.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Get Single Kalp
    .addCase(getSingleKalp.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getSingleKalp.fulfilled, (state, action) => {
      state.loading = false;
      state.kalp = action.payload;
      state.error = null;
    })
    .addCase(getSingleKalp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Create Kalp
    .addCase(createKalp.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(createKalp.fulfilled, (state, action) => {
      state.loading = false;
      state.kalpler = [action.payload, ...state.kalpler];
      state.success = true;
      state.message = "Kalp başarıyla oluşturuldu";
      state.error = null;
    })
    .addCase(createKalp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Update Kalp
    .addCase(updateKalp.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateKalp.fulfilled, (state, action) => {
      state.loading = false;
      state.kalpler = state.kalpler.map(kalp => 
        kalp._id === action.payload._id ? action.payload : kalp
      );
      if (state.kalp._id === action.payload._id) {
        state.kalp = action.payload;
      }
      state.success = true;
      state.message = "Kalp başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateKalp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Delete Kalp
    .addCase(deleteKalp.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(deleteKalp.fulfilled, (state, action) => {
      state.loading = false;
      state.kalpler = state.kalpler.filter(kalp => kalp._id !== action.payload);
      state.success = true;
      state.message = "Kalp başarıyla silindi";
      state.error = null;
    })
    .addCase(deleteKalp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default kalpReducer;
