import { createReducer } from "@reduxjs/toolkit";
import { getFaq, updateFaq } from "../actions/faqActions";
import faqData from "@/data/faq.json";

interface FaqState {
  faq: any;
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

// Use the data from faq.json as initial state
const initialState: FaqState = {
  faq: faqData,
  loading: false,
  error: null,
};

export const faqReducer = createReducer(initialState, (builder) => {
  builder
    // Get FAQ
    .addCase(getFaq.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getFaq.fulfilled, (state, action) => {
      state.loading = false;
      state.faq = action.payload;
      state.error = null;
    })
    .addCase(getFaq.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update FAQ
    .addCase(updateFaq.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateFaq.fulfilled, (state, action) => {
      state.loading = false;
      state.faq = action.payload;
      state.success = true;
      state.message = "FAQ başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateFaq.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default faqReducer; 