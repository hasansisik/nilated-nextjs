import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface PageSection {
  id: string;
  name: string;
  type: string;
  description?: string;
}

export interface PageContent {
  pageType: string;
  sections?: PageSection[];
  hero?: {
    title?: string;
    description?: string;
  };
  content?: string;
}

// Get page data
export const getPage = createAsyncThunk(
  "page/getPage",
  async (pageType: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/page/${pageType}`);
      return data.page;
    } catch (error: any) {
      const message = error.response?.data?.message || `Failed to load ${pageType} page data`;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update page data
export const updatePage = createAsyncThunk(
  "page/updatePage",
  async ({ pageType, pageData }: { pageType: string; pageData: Partial<PageContent> }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/page/${pageType}`, pageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.page;
    } catch (error: any) {
      const message = error.response?.data?.message || `Failed to update ${pageType} page`;
      return thunkAPI.rejectWithValue(message);
    }
  }
); 