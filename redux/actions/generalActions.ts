import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface SeoPageConfig {
  id: string;
  name: string;
  url: string;
  title: string;
  description: string;
  lastUpdated: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface GeneralPayload {
  siteName?: string;
  siteDescription?: string;
  favicon?: string;
  cloudinary?: {
    cloudName?: string;
    apiKey?: string;
    apiSecret?: string;
  };
  premium?: {
    price?: number;
    currency?: string;
    features?: string[];
    ctaText?: string;
    subtitle?: string;
    yearlyPriceText?: string;
    description?: string;
    leftTitle?: string;
    leftSubtitle?: string;
    rightTitle?: string;
  };
  iyzico?: {
    apiKey?: string;
    secretKey?: string;
    uri?: string;
  };
  whatsapp?: {
    enabled?: boolean;
    phoneNumber?: string;
    message?: string;
  };
  phone?: {
    enabled?: boolean;
    phoneNumber?: string;
  };
  cookieConsent?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    modalTitle?: string;
    modalDescription?: string;
    necessaryTitle?: string;
    necessaryDescription?: string;
    functionalTitle?: string;
    functionalDescription?: string;
    analyticsTitle?: string;
    analyticsDescription?: string;
    performanceTitle?: string;
    performanceDescription?: string;
    moreInfoText?: string;
    acceptAllText?: string;
    rejectAllText?: string;
    customizeText?: string;
    savePreferencesText?: string;
    alwaysActiveText?: string;
    iconColor?: string;
    buttonBgColor?: string;
    position?: 'bottom-left' | 'bottom-right';
  };
  theme?: {
    headerStyle?: number;
    footerStyle?: number;
  };
  colors?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    textColor?: string;
    darkPrimaryColor?: string;
    darkSecondaryColor?: string;
    darkAccentColor?: string;
    darkTextColor?: string;
  };
  seo?: {
    general?: {
      title?: string;
      description?: string;
      keywords?: string;
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: string;
    };
    pages?: SeoPageConfig[];
    pageUpdate?: {
      id: string;
      data: Partial<SeoPageConfig>;
    };
  };
}

// Get general settings
export const getGeneral = createAsyncThunk(
  "general/getGeneral",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/general`);
      return data.general;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Genel ayarlar alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update general settings
export const updateGeneral = createAsyncThunk(
  "general/updateGeneral",
  async (payload: GeneralPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/general`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.general;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Genel ayarlar güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update a specific SEO page
export const updateSeoPage = createAsyncThunk(
  "general/updateSeoPage",
  async ({ id, data }: { id: string; data: Partial<SeoPageConfig> }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        seo: {
          pageUpdate: {
            id,
            data
          }
        }
      };
      
      const response = await axios.put(`${server}/general`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data.general;
    } catch (error: any) {
      const message = error.response?.data?.message || 'SEO ayarları güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
); 