import { createReducer } from "@reduxjs/toolkit";
import { getHero, updateHero } from "../actions/heroActions";

interface HeroState {
  hero: any;
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: HeroState = {
  hero: null,
  loading: false,
  error: null,
};

export const heroReducer = createReducer(initialState, (builder) => {
  builder
    // Hydration action for SSR
    .addCase('hero/hydrate', (state, action) => {
      return {
        ...state,
        hero: action.payload,
        loading: false,
        error: null
      };
    })
    // Get Hero
    .addCase(getHero.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getHero.fulfilled, (state, action) => {
      state.loading = false;
      state.hero = action.payload;
      state.error = null;
    })
    .addCase(getHero.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update Hero
    .addCase(updateHero.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateHero.fulfilled, (state, action) => {
      state.loading = false;
      state.hero = action.payload;
      state.success = true;
      state.message = "Hero başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateHero.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default heroReducer; 