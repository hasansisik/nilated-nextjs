import { createReducer } from "@reduxjs/toolkit";
import { getOther, updateOther } from "../actions/otherActions";

interface OtherState {
  other: any;
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: OtherState = {
  other: null,
  loading: false,
  error: null,
};

export const otherReducer = createReducer(initialState, (builder) => {
  builder
    // Hydration action for SSR
    .addCase('other/hydrate', (state, action) => {
      return {
        ...state,
        other: action.payload,
        loading: false,
        error: null
      };
    })
    // Get Other
    .addCase(getOther.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getOther.fulfilled, (state, action) => {
      state.loading = false;
      state.other = action.payload;
      state.error = null;
    })
    .addCase(getOther.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update Other
    .addCase(updateOther.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateOther.fulfilled, (state, action) => {
      state.loading = false;
      state.other = action.payload;
      state.success = true;
      state.message = "Diğer ayarlar başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateOther.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default otherReducer; 