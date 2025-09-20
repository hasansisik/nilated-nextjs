import { createReducer } from "@reduxjs/toolkit";
import { getPage, updatePage } from "../actions/pageActions";

interface PageState {
  pages: {
    [key: string]: any;
  };
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: PageState = {
  pages: {},
  loading: false,
  error: null
};

export const pageReducer = createReducer(initialState, (builder) => {
  builder
    // Get Page
    .addCase(getPage.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getPage.fulfilled, (state, action) => {
      state.loading = false;
      state.pages[action.payload.pageType] = action.payload;
      state.error = null;
    })
    .addCase(getPage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update Page
    .addCase(updatePage.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updatePage.fulfilled, (state, action) => {
      state.loading = false;
      state.pages[action.payload.pageType] = action.payload;
      state.success = true;
      state.message = "Page updated successfully";
      state.error = null;
    })
    .addCase(updatePage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default pageReducer; 