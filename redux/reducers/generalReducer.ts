import { createReducer } from "@reduxjs/toolkit";
import { getGeneral, updateGeneral, updateSeoPage } from "../actions/generalActions";

interface GeneralState {
  general: any;
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: GeneralState = {
  general: null,
  loading: false,
  error: null,
};

export const generalReducer = createReducer(initialState, (builder) => {
  builder
    // Get General
    .addCase(getGeneral.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getGeneral.fulfilled, (state, action) => {
      state.loading = false;
      state.general = action.payload;
      state.error = null;
    })
    .addCase(getGeneral.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update General
    .addCase(updateGeneral.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateGeneral.fulfilled, (state, action) => {
      state.loading = false;
      state.general = action.payload;
      state.success = true;
      state.message = "Genel ayarlar başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateGeneral.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Update SEO Page
    .addCase(updateSeoPage.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateSeoPage.fulfilled, (state, action) => {
      state.loading = false;
      state.general = action.payload;
      state.success = true;
      state.message = "SEO ayarları başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateSeoPage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default generalReducer; 