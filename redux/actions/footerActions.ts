import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface FooterPayload {
  logo?: {
    src?: string;
    alt?: string;
    text?: string;
  };
  copyright?: string;
  description?: string;
  socialLinks?: Array<{
    _id: string;
    name: string;
    link: string;
    order: number;
  }>;
  columns?: Array<{
    _id: string;
    title: string;
    order: number;
    links: Array<{
      _id: string;
      name: string;
      link: string;
      order: number;
    }>;
  }>;
  contactItems?: {
    address?: string;
    phone?: string;
    email?: string;
    hours?: string;
  };
  instagramPosts?: Array<any>;
  appLinks?: Array<any>;
  showAppLinks?: boolean;
  showInstagram?: boolean;
  showPrivacyLinks?: boolean;
  showSocialLinks?: boolean;
  privacyLinks?: Array<{
    _id: string;
    name: string;
    link: string;
    order: number;
  }>;
  footerComponent?: string;
}

// Get footer data
export const getFooter = createAsyncThunk(
  "footer/getFooter",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/footer`);
      return data.footer;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Footer bilgileri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update footer data
export const updateFooter = createAsyncThunk(
  "footer/updateFooter",
  async (payload: FooterPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/footer`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.footer;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Footer güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
); 