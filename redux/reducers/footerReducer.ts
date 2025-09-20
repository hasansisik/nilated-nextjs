import { createReducer } from "@reduxjs/toolkit";
import { getFooter, updateFooter } from "../actions/footerActions";

interface FooterState {
  footer: any;
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: FooterState = {
  footer: null,
  loading: false,
  error: null,
};

export const footerReducer = createReducer(initialState, (builder) => {
  builder
    // Hydration action for SSR
    .addCase('footer/hydrate', (state, action) => {
      return {
        ...state,
        footer: action.payload,
        loading: false,
        error: null
      };
    })
    // Get Footer
    .addCase(getFooter.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getFooter.fulfilled, (state, action) => {
      state.loading = false;
      state.footer = action.payload;
      state.error = null;
    })
    .addCase(getFooter.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update Footer
    .addCase(updateFooter.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateFooter.fulfilled, (state, action) => {
      state.loading = false;
      state.footer = action.payload;
      state.success = true;
      state.message = "Footer başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateFooter.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default footerReducer; 