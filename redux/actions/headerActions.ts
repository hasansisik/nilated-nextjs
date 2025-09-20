import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface HeaderPayload {
  logo?: {
    src?: string;
    alt?: string;
    text?: string;
  };
  links?: {
    freeTrialLink?: {
      href?: string;
      text?: string;
    };
    secondActionButton?: {
      href?: string;
      text?: string;
    };
  };
  mainMenu?: Array<{
    _id: string;
    name: string;
    link: string;
    order: number;
  }>;
  socialLinks?: Array<any>;
  topBarItems?: Array<any>;
  showDarkModeToggle?: boolean;
  showActionButton?: boolean;
  showSecondActionButton?: boolean;
  actionButtonText?: string;
  actionButtonLink?: string;
  secondActionButtonText?: string;
  secondActionButtonLink?: string;
  headerComponent?: string;
  workingHours?: string;
  topBarColor?: string;
  topBarTextColor?: string;
  mobileMenuButtonColor?: string;
  phoneIconBgColor?: string;
  phoneIconColor?: string;
  phoneQuestionText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  secondButtonColor?: string;
  secondButtonTextColor?: string;
  secondButtonBorderColor?: string;
}

// Get header data
export const getHeader = createAsyncThunk(
  "header/getHeader",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/header`);
      return data.header;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Header bilgileri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update header data
export const updateHeader = createAsyncThunk(
  "header/updateHeader",
  async (payload: HeaderPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/header`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.header;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Header güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
); 