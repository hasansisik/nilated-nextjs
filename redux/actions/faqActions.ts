import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface FaqPayload {
  activeFaq?: string;
  faqs1?: {
    heading?: {
      title?: string;
      description?: string;
      titleColor?: string;
      descriptionColor?: string;
    };
    mainImage?: string;
    backgroundImage?: string;
    numberColor?: string;
    numberBgColor?: string;
    supportItems?: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    questions?: Array<{
      question: string;
      answer: string;
    }>;
  };
  faqs2?: {
    heading?: {
      tag?: string;
      title?: string;
      description?: string;
      titleColor?: string;
      descriptionColor?: string;
    };
    tagVisible?: boolean;
    tagBackgroundColor?: string;
    tagTextColor?: string;
    tagImage?: string;
    questions?: Array<{
      question: string;
      answer: string;
    }>;
  };
  faqs3?: {
    heading?: {
      tag?: string;
      title?: string;
      description?: string;
      titleColor?: string;
      descriptionColor?: string;
    };
    tagVisible?: boolean;
    tagBackgroundColor?: string;
    tagTextColor?: string;
    tagImage?: string;
    descriptionVisible?: boolean;
    leftImagesVisible?: boolean;
    buttons?: {
      primary?: {
        text?: string;
        link?: string;
        visible?: boolean;
        backgroundColor?: string;
        textColor?: string;
      };
      secondary?: {
        text?: string;
        link?: string;
        visible?: boolean;
        textColor?: string;
      };
    };
    leftImage1?: string;
    leftImage2?: string;
    questions?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

// Get FAQ data
export const getFaq = createAsyncThunk(
  "faq/getFaq",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/faq`);
      return data.faq;
    } catch (error: any) {
      const message = error.response?.data?.message || 'FAQ bilgileri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update FAQ data
export const updateFaq = createAsyncThunk(
  "faq/updateFaq",
  async (payload: FaqPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/faq`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.faq;
    } catch (error: any) {
      const message = error.response?.data?.message || 'FAQ güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
); 
