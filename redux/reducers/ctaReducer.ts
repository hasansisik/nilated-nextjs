import { createReducer } from "@reduxjs/toolkit";
import { getCta, updateCta } from "../actions/ctaActions";

interface CtaState {
  cta: any;
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: CtaState = {
  cta: null,
  loading: false,
  error: null,
};

export const ctaReducer = createReducer(initialState, (builder) => {
  builder
    // Hydration action for SSR
    .addCase('cta/hydrate', (state, action) => {
      return {
        ...state,
        cta: action.payload,
        loading: false,
        error: null
      };
    })
    // Get CTA
    .addCase(getCta.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getCta.fulfilled, (state, action) => {
      state.loading = false;
      state.cta = action.payload;
      state.error = null;
    })
    .addCase(getCta.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update CTA
    .addCase(updateCta.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateCta.fulfilled, (state, action) => {
      state.loading = false;
      state.cta = action.payload;
      state.success = true;
      state.message = "CTA başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateCta.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default ctaReducer; 