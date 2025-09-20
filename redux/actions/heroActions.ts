import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface HeroPayload {
  activeHero?: string;
  hero1?: {
    badge?: {
      visible?: boolean;
      label?: string;
      text?: string;
      link?: string;
      backgroundColor?: string;
      labelBgColor?: string;
      labelTextColor?: string;
      textColor?: string;
      iconColor?: string;
    };
    title?: string;
    description?: string;
    primaryButton?: {
      visible?: boolean;
      text?: string;
      link?: string;
      backgroundColor?: string;
      textColor?: string;
      iconColor?: string;
    };
    secondaryButton?: {
      visible?: boolean;
      text?: string;
      link?: string;
      backgroundColor?: string;
      borderColor?: string;
      textColor?: string;
      iconColor?: string;
    };
    images?: {
      background?: string;
      shape1?: string;
      shape2?: string;
      shape3?: string;
    };
    card?: {
      visible?: boolean;
      image?: string;
      title?: string;
      description?: string;
      backgroundColor?: string;
      titleColor?: string;
      descriptionColor?: string;
      button?: {
        label?: string;
        text?: string;
        link?: string;
        backgroundColor?: string;
        labelBgColor?: string;
        labelTextColor?: string;
        textColor?: string;
        iconColor?: string;
      };
    };
  };
  hero2?: {
    autoplay?: boolean;
    slideDelay?: number;
    showNavigation?: boolean;
    navigationButtonColor?: string;
    paginationVisible?: boolean;
    videoId?: string;
    badgeBackgroundColor?: string;
    badgeTextColor?: string;
    badgeBorderColor?: string;
    titleColor?: string;
    descriptionColor?: string;
    primaryButtonBackgroundColor?: string;
    primaryButtonTextColor?: string;
    videoButtonBackgroundColor?: string;
    videoButtonTextColor?: string;
    videoButtonIconColor?: string;
    slides?: Array<{
      backgroundImage?: string;
      badge?: string;
      title?: string;
      description?: string;
      primaryButtonText?: string;
      primaryButtonLink?: string;
      videoButtonVisible?: boolean;
      videoButtonText?: string;
      lineImage?: string;
    }>;
  };
  hero3?: {
    badge?: {
      visible?: boolean;
      text?: string;
      backgroundColor?: string;
      textColor?: string;
      borderColor?: string;
    };
    title?: {
      part1?: string;
      part2?: string;
    };
    description?: string;
    button?: {
      visible?: boolean;
      text?: string;
      link?: string;
      backgroundColor?: string;
      textColor?: string;
      iconColor?: string;
    };
    buttons?: {
      secondary?: {
        visible?: boolean;
        text?: string;
        link?: string;
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
      };
    };
    avatarsVisible?: boolean;
    avatars?: Array<{
      image?: string;
      alt?: string;
      visible?: boolean;
      borderColor?: string;
      backgroundColor?: string;
    }>;
    images?: {
      image1?: string;
      image2?: string;
      image3?: string;
      image4?: string;
      star?: string;
    };
  };
}

// Get hero data
export const getHero = createAsyncThunk(
  "hero/getHero",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/hero`);
      return data.hero;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Hero bilgileri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update hero data
export const updateHero = createAsyncThunk(
  "hero/updateHero",
  async (payload: HeroPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/hero`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.hero;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Hero güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
); 