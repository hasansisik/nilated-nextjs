import { createReducer } from "@reduxjs/toolkit";
import { getHeader, updateHeader } from "../actions/headerActions";

interface HeaderState {
  header: any;
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: HeaderState = {
  header: null,
  loading: false,
  error: null,
};

export const headerReducer = createReducer(initialState, (builder) => {
  builder
    // Hydration action for SSR
    .addCase('header/hydrate', (state, action) => {
      return {
        ...state,
        header: action.payload,
        loading: false,
        error: null
      };
    })
    // Get Header
    .addCase(getHeader.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getHeader.fulfilled, (state, action) => {
      state.loading = false;
      state.header = action.payload;
      state.error = null;
    })
    .addCase(getHeader.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update Header
    .addCase(updateHeader.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateHeader.fulfilled, (state, action) => {
      state.loading = false;
      state.header = action.payload;
      state.success = true;
      state.message = "Header başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateHeader.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default headerReducer; 